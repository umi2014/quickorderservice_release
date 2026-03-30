const pool = require('../../db/pool');

const inventoryService = {
  // 1. 入库 (Inbound)
  async inbound(shopId, userId, productId, qty, productionDate, expiryDate) {
    return await pool.transaction(async () => {
      // 1.1 获取商品信息算出默认批次号
      const batchNo = `BATCH_${Date.now()}`;
      
      // 1.2 如果没有传 expiryDate，则尝试通过 products.DEFAULT_SHELF_LIFE_DAYS 推算
      if (!expiryDate && productionDate) {
         const [[product]] = await pool.query('SELECT DEFAULT_SHELF_LIFE_DAYS FROM products WHERE PRODUCT_ID = ?', [productId]);
         if (product && product.DEFAULT_SHELF_LIFE_DAYS) {
             const pd = new Date(productionDate);
             pd.setDate(pd.getDate() + product.DEFAULT_SHELF_LIFE_DAYS);
             expiryDate = pd.toISOString().split('T')[0];
         }
      }

      // 1.3 创建批次 records
      const insertBatchSql = `
        INSERT INTO inventory_batches 
        (SHOP_ID, PRODUCT_ID, BATCH_NO, PRODUCTION_DATE, EXPIRY_DATE, REMAINING_QTY, STATUS)
        VALUES (?, ?, ?, ?, ?, ?, '0')
      `;
      const [batchResult] = await pool.query(insertBatchSql, [shopId, productId, batchNo, productionDate || null, expiryDate || null, qty]);
      const batchId = batchResult.insertId;

      // 1.4 创建流水记录
      const insertTxSql = `
        INSERT INTO inventory_transactions 
        (SHOP_ID, PRODUCT_ID, BATCH_ID, TRANSACTION_TYPE, QTY, REASON, CREATED_BY)
        VALUES (?, ?, ?, 'IN', ?, '入库', ?)
      `;
      await pool.query(insertTxSql, [shopId, productId, batchId, qty, userId]);

      return { success: true, batchId };
    });
  },

  // 2. 出库 (Outbound) - FIFO 基于过期时间
  async outbound(shopId, userId, productId, requestQty, reason) {
      return await pool.transaction(async () => {
          const findBatchesSql = `
            SELECT BATCH_ID, REMAINING_QTY, EXPIRY_DATE 
            FROM inventory_batches 
            WHERE SHOP_ID = ? AND PRODUCT_ID = ? AND STATUS = '0' AND REMAINING_QTY > 0
            ORDER BY EXPIRY_DATE IS NULL ASC, EXPIRY_DATE ASC, BATCH_ID ASC
            FOR UPDATE
          `;
          const [batches] = await pool.query(findBatchesSql, [shopId, productId]);

          let qtyToFulfill = parseFloat(requestQty);
          let totalAvailable = batches.reduce((sum, b) => sum + parseFloat(b.REMAINING_QTY), 0);

          if (totalAvailable < qtyToFulfill) {
              throw new Error(`库存不足。需要: ${qtyToFulfill}, 当前可用: ${totalAvailable}`);
          }

          const txs = [];
          for (let batch of batches) {
              if (qtyToFulfill <= 0) break;

              let deduct = 0;
              let currentBatchQty = parseFloat(batch.REMAINING_QTY);
              if (currentBatchQty >= qtyToFulfill) {
                  deduct = qtyToFulfill;
                  qtyToFulfill = 0;
              } else {
                  deduct = currentBatchQty;
                  qtyToFulfill -= currentBatchQty;
              }

              let updatedQty = currentBatchQty - deduct;
              let newStatus = updatedQty === 0 ? '1' : '0';
              await pool.query(`UPDATE inventory_batches SET REMAINING_QTY = ?, STATUS = ? WHERE BATCH_ID = ?`, [updatedQty, newStatus, batch.BATCH_ID]);

              const insertTxSql = `
                INSERT INTO inventory_transactions 
                (SHOP_ID, PRODUCT_ID, BATCH_ID, TRANSACTION_TYPE, QTY, REASON, CREATED_BY)
                VALUES (?, ?, ?, 'OUT', ?, ?, ?)
              `;
              await pool.query(insertTxSql, [shopId, productId, batch.BATCH_ID, deduct, reason || '出库', userId]);

              txs.push({ batchId: batch.BATCH_ID, deducted: deduct });
          }

          return { success: true, details: txs };
      });
  },

  // 3. 库存概览及预警
  async overview(shopId, langType) {
      const sql = `
        SELECT 
            p.PRODUCT_ID, p.PRODUCT_TYPE, p.SKU, p.UNIT, p.DEFAULT_SHELF_LIFE_DAYS, p.EXPIRY_WARN_DAYS,
            pl.PRODUCT_NAME,
            COALESCE(SUM(b.REMAINING_QTY), 0) AS TOTAL_QTY
        FROM products p
        LEFT JOIN product_language pl ON p.PRODUCT_ID = pl.PRODUCT_ID AND pl.LANGUAGE_TYPE = ?
        LEFT JOIN inventory_batches b ON p.PRODUCT_ID = b.PRODUCT_ID AND b.SHOP_ID = ? AND b.STATUS = '0'
        WHERE p.SHOP_ID = ? AND p.DELETE_FLG = '0'
        GROUP BY p.PRODUCT_ID, p.PRODUCT_TYPE, p.SKU, p.UNIT, p.DEFAULT_SHELF_LIFE_DAYS, p.EXPIRY_WARN_DAYS, pl.PRODUCT_NAME
      `;
      const [products] = await pool.query(sql, [langType || 'zh', shopId, shopId]);

      for (let p of products) {
         p.batches = [];
         p.warnStatus = 'GREEN'; 
         if (p.TOTAL_QTY > 0) {
             const [batches] = await pool.query(`
                SELECT BATCH_ID, BATCH_NO, REMAINING_QTY, EXPIRY_DATE 
                FROM inventory_batches 
                WHERE SHOP_ID = ? AND PRODUCT_ID = ? AND STATUS = '0' AND REMAINING_QTY > 0
                ORDER BY EXPIRY_DATE ASC
             `, [shopId, p.PRODUCT_ID]);
             p.batches = batches;

             if (batches.length > 0) {
                 const earliestBatch = batches[0];
                 if (earliestBatch.EXPIRY_DATE) {
                     const warnDays = p.EXPIRY_WARN_DAYS || 7;
                     const today = new Date();
                     const expDate = new Date(earliestBatch.EXPIRY_DATE);
                     const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                     if (diffDays < 0) {
                         p.warnStatus = 'RED'; 
                     } else if (diffDays <= warnDays) {
                         p.warnStatus = 'YELLOW'; 
                     }
                 }
             }
         }
      }

      return products;
  },

  // 4. 盘点修正
  async checkTake(shopId, userId, productId, actualQty, reason) {
      return await pool.transaction(async () => {
         actualQty = parseFloat(actualQty);
         const [res] = await pool.query(`SELECT COALESCE(SUM(REMAINING_QTY), 0) as total FROM inventory_batches WHERE SHOP_ID=? AND PRODUCT_ID=? AND STATUS='0'`, [shopId, productId]);
         const systemQty = parseFloat(res[0].total);

         const diff = actualQty - systemQty;

         if (diff > 0) {
             const batchNo = `CHECK_IN_${Date.now()}`;
             const [b] = await pool.query(`INSERT INTO inventory_batches (SHOP_ID, PRODUCT_ID, BATCH_NO, REMAINING_QTY, STATUS) VALUES (?, ?, ?, ?, '0')`, [shopId, productId, batchNo, diff]);
             await pool.query(`INSERT INTO inventory_transactions (SHOP_ID, PRODUCT_ID, BATCH_ID, TRANSACTION_TYPE, QTY, REASON, CREATED_BY) VALUES (?, ?, ?, 'CHECK', ?, ?, ?)`, [shopId, productId, b.insertId, diff, reason || '盘盈入库', userId]);
         } else if (diff < 0) {
             const outQty = Math.abs(diff);
             const findBatchesSql = `SELECT BATCH_ID, REMAINING_QTY FROM inventory_batches WHERE SHOP_ID = ? AND PRODUCT_ID = ? AND STATUS = '0' AND REMAINING_QTY > 0 ORDER BY EXPIRY_DATE IS NULL ASC, EXPIRY_DATE ASC FOR UPDATE`;
             const [batches] = await pool.query(findBatchesSql, [shopId, productId]);
             let qToFulfill = outQty;
             for (let batch of batches) {
                 if (qToFulfill <= 0) break;
                 let currentBatchQty = parseFloat(batch.REMAINING_QTY);
                 let deduct = currentBatchQty >= qToFulfill ? qToFulfill : currentBatchQty;
                 qToFulfill -= deduct;
                 let newStatus = (currentBatchQty - deduct) === 0 ? '1' : '0';
                 await pool.query(`UPDATE inventory_batches SET REMAINING_QTY = ?, STATUS = ? WHERE BATCH_ID = ?`, [currentBatchQty - deduct, newStatus, batch.BATCH_ID]);
                 await pool.query(`INSERT INTO inventory_transactions (SHOP_ID, PRODUCT_ID, BATCH_ID, TRANSACTION_TYPE, QTY, REASON, CREATED_BY) VALUES (?, ?, ?, 'CHECK', ?, ?, ?)`, [shopId, productId, batch.BATCH_ID, deduct, reason || '盘亏出库', userId]);
             }
         }
         return { success: true, diff };
      });
  },

  // 5. 根据ID获取商品详情(查询现有商品)
  async getProduct(shopId, productId, langType) {
      const sql = `
        SELECT 
            p.PRODUCT_ID, p.PRODUCT_TYPE, p.SKU, p.UNIT, p.DEFAULT_SHELF_LIFE_DAYS, p.PRODUCT_IMG, p.PRICE,
            pl.PRODUCT_NAME, pl.PRODUCT_DETAIL
        FROM products p
        LEFT JOIN product_language pl ON p.PRODUCT_ID = pl.PRODUCT_ID AND pl.LANGUAGE_TYPE = ?
        WHERE p.SHOP_ID = ? AND p.PRODUCT_ID = ? AND p.DELETE_FLG = '0'
      `;
      const [rows] = await pool.query(sql, [langType || 'zh', shopId, productId]);
      if (rows && rows.length > 0) {
          return { success: true, data: rows[0] };
      }
      return { success: false, error: 'Product not found' };
  },

  // 6. 商品 CRUD: 获取所有商品
  async getAllProducts(shopId, langType) {
      const sql = `
        SELECT 
            p.PRODUCT_ID, p.PRODUCT_TYPE, p.SKU, p.UNIT, p.DEFAULT_SHELF_LIFE_DAYS, p.EXPIRY_WARN_DAYS, p.PRICE,
            pl.PRODUCT_NAME, pl.PRODUCT_DETAIL
        FROM products p
        LEFT JOIN product_language pl ON p.PRODUCT_ID = pl.PRODUCT_ID AND pl.LANGUAGE_TYPE = ?
        WHERE p.SHOP_ID = ? AND p.DELETE_FLG = '0'
        ORDER BY p.PRODUCT_ID DESC
      `;
      const [rows] = await pool.query(sql, [langType || 'zh', shopId]);
      return { success: true, data: rows };
  },

  // 7. 商品 CRUD: 新增商品
  async createProduct(shopId, data) {
      return await pool.transaction(async () => {
          const { productName, productType, sku, unit, defaultShelfLifeDays, expiryWarnDays, price } = data;
          
          const insertProductSql = `
            INSERT INTO products (SHOP_ID, PRODUCT_TYPE, SKU, UNIT, DEFAULT_SHELF_LIFE_DAYS, EXPIRY_WARN_DAYS, PRICE, DELETE_FLG)
            VALUES (?, ?, ?, ?, ?, ?, ?, '0')
          `;
          const [res] = await pool.query(insertProductSql, [
              shopId, productType || '01', sku || '', unit || '', 
              defaultShelfLifeDays ? parseInt(defaultShelfLifeDays) : null, 
              expiryWarnDays ? parseInt(expiryWarnDays) : 7, 
              price ? parseFloat(price) : 0
          ]);
          
          const productId = res.insertId;
          
          // 简易处理：直接写入当前语言的名称（实际系统中可能需要分别写 zh 和 ja）
          const insertLangSql = `
            INSERT INTO product_language (PRODUCT_ID, LANGUAGE_TYPE, PRODUCT_NAME)
            VALUES (?, 'zh', ?)
          `;
          await pool.query(insertLangSql, [productId, productName]);
          
          // 如果系统需要双语都有一条记录以防 JOIN 查不到
          await pool.query(`INSERT INTO product_language (PRODUCT_ID, LANGUAGE_TYPE, PRODUCT_NAME) VALUES (?, 'ja', ?)`, [productId, productName]);

          return { success: true, productId };
      });
  },

  // 8. 商品 CRUD: 更新商品
  async updateProduct(shopId, productId, data) {
      return await pool.transaction(async () => {
          const { productName, productType, sku, unit, defaultShelfLifeDays, expiryWarnDays, price } = data;
          
          const updateProductSql = `
            UPDATE products 
            SET PRODUCT_TYPE = ?, SKU = ?, UNIT = ?, DEFAULT_SHELF_LIFE_DAYS = ?, EXPIRY_WARN_DAYS = ?, PRICE = ?
            WHERE SHOP_ID = ? AND PRODUCT_ID = ?
          `;
          await pool.query(updateProductSql, [
              productType || '01', sku || '', unit || '', 
              defaultShelfLifeDays ? parseInt(defaultShelfLifeDays) : null, 
              expiryWarnDays ? parseInt(expiryWarnDays) : 7,
              price ? parseFloat(price) : 0, 
              shopId, productId
          ]);
          
          // 简易更新所有语言下的名字为同样的
          if (productName) {
              const updateLangSql = `UPDATE product_language SET PRODUCT_NAME = ? WHERE PRODUCT_ID = ?`;
              await pool.query(updateLangSql, [productName, productId]);
          }

          return { success: true };
      });
  },

  // 9. 商品 CRUD: 删除商品 (软删除)
  async deleteProduct(shopId, productId) {
      const sql = `UPDATE products SET DELETE_FLG = '1' WHERE SHOP_ID = ? AND PRODUCT_ID = ?`;
      await pool.query(sql, [shopId, productId]);
      return { success: true };
  }
};

module.exports = inventoryService;

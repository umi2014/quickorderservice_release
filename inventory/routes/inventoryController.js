const express = require('express');
const router = express.Router();
const inventoryService = require('../service/inventoryService');

// POST /inventory/inbound
router.post('/inbound', async (req, res) => {
    try {
        const { shopId, userId, productId, qty, productionDate, expiryDate } = req.body;
        if (!shopId || !productId || qty === undefined || qty === '' || isNaN(qty) || Number(qty) <= 0) {
            return res.status(400).json({ error: 'Invalid or missing parameters (qty must be positive)' });
        }
        const result = await inventoryService.inbound(shopId, userId, productId, Number(qty), productionDate, expiryDate);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/outbound
router.post('/outbound', async (req, res) => {
    try {
        const { shopId, userId, productId, qty, reason } = req.body;
        if (!shopId || !productId || qty === undefined || qty === '' || isNaN(qty) || Number(qty) <= 0) {
            return res.status(400).json({ error: 'Invalid or missing parameters (qty must be positive)' });
        }
        const result = await inventoryService.outbound(shopId, userId, productId, Number(qty), reason);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/overview
router.post('/overview', async (req, res) => {
    try {
        const { shopId, langType } = req.body;
        if (!shopId) {
            return res.status(400).json({ error: 'Missing shopId' });
        }
        const result = await inventoryService.overview(shopId, langType);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/check
router.post('/check', async (req, res) => {
    try {
        const { shopId, userId, productId, actualQty, reason } = req.body;
        if (!shopId || !productId || actualQty === undefined || actualQty === '' || isNaN(actualQty) || Number(actualQty) < 0) {
            return res.status(400).json({ error: 'Invalid or missing parameters (actualQty must be >= 0)' });
        }
        const result = await inventoryService.checkTake(shopId, userId, productId, Number(actualQty), reason);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/product/get
router.post('/product/get', async (req, res) => {
    try {
        const { shopId, productId, langType } = req.body;
        if (!shopId || !productId) {
            return res.status(400).json({ error: 'Missing shopId or productId' });
        }
        const result = await inventoryService.getProduct(shopId, productId, langType);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/products/get
router.post('/products/get', async (req, res) => {
    try {
        const { shopId, langType } = req.body;
        if (!shopId) return res.status(400).json({ error: 'Missing shopId' });
        const result = await inventoryService.getAllProducts(shopId, langType);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/product/create
router.post('/product/create', async (req, res) => {
    try {
        const { shopId, productName } = req.body;
        if (!shopId || !productName) return res.status(400).json({ error: 'Missing required parameters' });
        const result = await inventoryService.createProduct(shopId, req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/product/update
router.post('/product/update', async (req, res) => {
    try {
        const { shopId, productId } = req.body;
        if (!shopId || !productId) return res.status(400).json({ error: 'Missing required parameters' });
        const result = await inventoryService.updateProduct(shopId, productId, req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/product/delete
router.post('/product/delete', async (req, res) => {
    try {
        const { shopId, productId } = req.body;
        if (!shopId || !productId) return res.status(400).json({ error: 'Missing required parameters' });
        const result = await inventoryService.deleteProduct(shopId, productId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

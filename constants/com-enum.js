/**
 *  Enum
 *
 *  @version 1.0
 *  @author CSC
 */
const comEnum = {
  /** オーダーステータス */
  OrderStatus: {
    ORDERED: {
      val: "1",
      dispname: "オーダー済み"
    },
    PREPARE_ORDER: {
      val: "2",
      dispname: "準備開始"
    },
    SERVING_ORDER: {
      val: "3",
      dispname: "サービング開始"
    },
    PURCHASE_ORDER: {
      val: "4",
      dispname: "会計済み"
    },
    REFUND_ORDER: {
      val: "5",
      dispname: "返金済み"
    }
  },
  /** アクセス権限 */
  Roll_ITEM: {
    KITCHEN: {
      val: "1",
      dispname: "厨房"
    },
    CASHIER: {
      val: "2",
      dispname: "レジ"
    },
    MANAGER: {
      val: "3",
      dispname: "店長"
    },
    OWNER: {
      val: "4",
      dispname: "オーナー"
    }
  },
  /** 勘定科目レベル1 */
  EnumACCOUNT_ITEM_LEVEL1: {
    ASSET_TOTAL: {
      val: "AT",
      dispname: "資産の部"
    },
    DEBT_TOTAL: {
      val: "DT",
      dispname: "負債の部"
    },
    PURE_ASSET_TOTAL: {
      val: "PT",
      dispname: "純資産の部"
    }
  },
  /** 勘定科目レベル2 */
  EnumACCOUNT_ITEM_LEVEL2: {
    LIQUID_ASSET: {
      val: "LA",
      dispname: "流動資産"
    },
    FIXED_ASSET: {
      val: "FA",
      dispname: "固定資産"
    },
    LIQUID_TOTAL: {
      val: "LT",
      dispname: "流動負債"
    },
    FIXED_DEBT: {
      val: "FD",
      dispname: "固定負債"
    },
    FUND_INVESTMENT_AMOUNT: {
      val: "FI",
      dispname: "基金・出資金"
    },
    PROVIDENT_AMOUNT: {
      val: "PA",
      dispname: "積立金"
    },
    EVALUATION_CONVER_DIFFERENCE: {
      val: "EC",
      dispname: "評価・換算差額等"
    }
  },
  /** 勘定科目レベル3 */
  EnumACCOUNT_ITEM_LEVEL3: {
    ACCOUNT_ITEM_LEVEL3_01: {
      val: "01",
      dispname: "勘定科目レベル3_01"
    },
    ACCOUNT_ITEM_LEVEL3_02: {
      val: "02",
      dispname: "勘定科目レベル3_02"
    },
    ACCOUNT_ITEM_LEVEL3_03: {
      val: "03",
      dispname: "勘定科目レベル3_03"
    },
    ACCOUNT_ITEM_LEVEL3_04: {
      val: "04",
      dispname: "勘定科目レベル3_04"
    }
  },
  /** 添付書類必須種別 */
  EnumATTACH_DOC_REQUIRED_TYPE: {
    NOT_REQUIRE: {
      val: "0",
      dispname: "必須としない"
    },
    REQUIRED: {
      val: "1",
      dispname: "必須とする"
    },
    REQUIRED_ANY_ONE_IN_GROUP: {
      val: "2",
      dispname: "グループ内でいずれかを必須とする"
    }
  },
  /** パンくずリスト */
  EnumBREADCRUMB_LIST: {
    ATH0102100: {
      val: "ATH0102100",
      dispname: "パスワード変更"
    },
    ENT0101100: {
      val: "ENT0101100",
      dispname: "年度別届出状況一覧"
    },
    ENT0102100: {
      val: "ENT0102100",
      dispname: "届出タイプ選択"
    },
    ENT0201100: {
      val: "ENT0201100",
      dispname: "事業報告書等Web入力"
    },
    ENT0201200: {
      val: "ENT0201100",
      dispname: "事業報告書等Web入力"
    },
    ENT0201300: {
      val: "ENT0201100",
      dispname: "事業報告書等Web入力"
    },
    ENT0201400: {
      val: "ENT0201100",
      dispname: "事業報告書等Web入力"
    },
    ENT0201500: {
      val: "ENT0201100",
      dispname: "事業報告書等Web入力"
    },
    ENT0301100: {
      val: "ENT0301100",
      dispname: "経営情報等一覧"
    },
    ENT0301110: {
      val: "ENT0301110",
      dispname: "経営情報等Web入力"
    },
    ENT0301200: {
      val: "ENT0301100",
      dispname: "経営情報等一覧"
    },
    MNM0101100: {
      val: "MNM0101100",
      dispname: "届出検索"
    },
    MNM0201100: {
      val: "MNM0201100",
      dispname: "法人情報検索"
    },
    MNM0201200: {
      val: "MNM0201200",
      dispname: "法人情報登録・照会"
    },
    MNM0301100: {
      val: "MNM0301100",
      dispname: "ユーザ検索"
    },
    MNM0301200: {
      val: "MNM0301200",
      dispname: "ユーザ登録"
    },
    MNM0301300: {
      val: "MNM0301300",
      dispname: "ユーザ情報"
    },
    UTL0101100: {
      val: "UTL0101100",
      dispname: "トップ"
    }
  },
  /** 本来業務_介護種別 */
  EnumCARE_TYPE: {
    CARE_ELDERLY_FACILITY: {
      val: "1",
      dispname: "介護老人保健施設"
    },
    MEDICAL_CARE_HOSPITAL: {
      val: "2",
      dispname: "介護医療院"
    }
  },
  /** セル型 */
  EnumCELL_TYPE: {
    STRING: {
      val: "STRING",
      dispname: "文字列"
    },
    DATE: {
      val: "DATE",
      dispname: "日付"
    },
    INTEGER: {
      val: "INTEGER",
      dispname: "数値"
    }
  },
  /** 法人類型法人種類 */
  EnumCORP_TYPE_CORP_KIND: {
    SOC_MED_CORP: {
      val: "1",
      dispname: "社会医療法人"
    },
    SPECIFIC_MED_CORP: {
      val: "2",
      dispname: "特定医療法人"
    },
    INVESTMENT_AMOUNT_LIMIT_MED_CORP: {
      val: "3",
      dispname: "出資額限度法人"
    },
    OTHER: {
      val: "4",
      dispname: "その他"
    }
  },
  /** 小数点以下桁数 */
  EnumDECIMAL_POINT_BELOW_DIGITS: {
    NO_DECIMAL_POINT: {
      val: "0",
      dispname: "小数点なし"
    },
    DECIMAL_POINT_BELOW_THE_FIRST: {
      val: "1",
      dispname: "小数点以下第一位まで"
    },
    DECIMAL_POINT_BELOW_THE_SECOND: {
      val: "2",
      dispname: "小数点以下第二位まで"
    }
  },
  /** 編集区分 */
  EnumEDIT_CLASS: {
    CORP_INP: {
      val: "1",
      dispname: "法人入力"
    },
    PREF_INP: {
      val: "2",
      dispname: "都道府県入力"
    },
    READ_ONLY: {
      val: "3",
      dispname: "閲覧"
    }
  },
  /** エラー種別 */
  EnumERR_TYPE: {
    INPUT_CHK_ERROR: {
      val: "1",
      dispname: "入力チェックエラー"
    },
    NOTIFICATION_WARNING_ERROR: {
      val: "2",
      dispname: "届出警告エラー"
    },
    WARNING_ERROR: {
      val: "3",
      dispname: "警告エラー"
    }
  },
  /** 役員及び評議員の役職種別 */
  EnumEXECUTIVE_TYPE: {
    CHAIRPERSON: {
      val: "1",
      dispname: "理事"
    },
    AUDITOR: {
      val: "2",
      dispname: "監事"
    },
    COUNCILOR: {
      val: "3",
      dispname: "評議員"
    }
  },
  /** 有無区分 */
  EnumEXIST_TYPE: {
    AVAILBLE: {
      val: "1",
      dispname: "１有"
    },
    NOT_AVAILBLE: {
      val: "2",
      dispname: "２無"
    }
  },
  /** 施設区分 */
  EnumFACILITY_CLASS: {
    HP: {
      val: "1",
      dispname: "病院"
    },
    GENERAL_CL: {
      val: "2",
      dispname: "一般診療所"
    },
    DENTISTRY_CL: {
      val: "3",
      dispname: "歯科診療所"
    },
    ANL_NOT_APPLICABLE: {
      val: "9",
      dispname: "分析対象外"
    }
  },
  /** ファイル操作管理ステータス */
  EnumFILE_OPERATION_MANAGE_STATUS: {
    UNTREATED: {
      val: "0",
      dispname: "未処理"
    },
    PROCESSING: {
      val: "1",
      dispname: "処理中"
    },
    COMPLETED: {
      val: "2",
      dispname: "完了"
    },
    ERR: {
      val: "3",
      dispname: "エラー"
    }
  },
  /** ファイル操作管理（ファイル単位）ステータス */
  EnumFILE_OPE_MNG_DETAIL_FILES_STS: {
    UNTREATED: {
      val: "0",
      dispname: "未処理"
    },
    TREATED: {
      val: "1",
      dispname: "処理済"
    }
  },
  /** ファイル種別 */
  EnumFILE_TYPE: {
    FT_BIZ_REPORT: {
      val: "01",
      dispname: "事業報告書"
    },
    FT_BALANCESHEET: {
      val: "02",
      dispname: "貸借対照表"
    },
    FT_PROFIT_LOSS: {
      val: "03",
      dispname: "損益計算書"
    },
    FT_ATTACHEMENT: {
      val: "04",
      dispname: "添付書類"
    },
    FT_MGT_INFO_ETC: {
      val: "05",
      dispname: "経営情報等"
    },
    FT_NOTICE_SEARCH_DL: {
      val: "06",
      dispname: "届出検索ダウンロード"
    },
    FT_PREF_PDF_DL: {
      val: "07",
      dispname: "都道府県PDFダウンロード"
    }
  },
  /** 基金出資金種別 */
  EnumFUND_INVESTMENT_AMOUNT_TYPE: {
    FUND: {
      val: "1",
      dispname: "基金"
    },
    INVESTMENT_AMOUNT: {
      val: "2",
      dispname: "出資金"
    }
  },
  /** 基金制度採用有無法人種類 */
  EnumFUND_SYST_ADOPT_EXIST_CORP_KIND: {
    FUND_SYST_ADOPT: {
      val: "1",
      dispname: "基金制度採用"
    },
    FUND_SYST_NOT_ADOPT: {
      val: "2",
      dispname: "基金制度不採用"
    }
  },
  /** 病院・診療所区分 */
  EnumHOSPITAL_CLINIC_DIVISION: {
    HOSPITAL: {
      val: "01-01",
      dispname: "病院"
    },
    CLINIC: {
      val: "02-01",
      dispname: "診療所"
    },
    REPORT_NOT_APPLICABLE: {
      val: "03",
      dispname: "報告対象外"
    }
  },
  /** 本来業務_病院診療所種別 */
  EnumHOSPITAL_CLINIC_TYPE: {
    HOSPITAL: {
      val: "1",
      dispname: "病院"
    },
    CLINIC: {
      val: "2",
      dispname: "診療所"
    }
  },
  /** 入力切替種別 */
  EnumINPUT_CHANGE_TYPE: {
    INPUT_VALUE: {
      val: "0",
      dispname: "入力値"
    },
    CALCULATED_VALUE: {
      val: "1",
      dispname: "計算値"
    }
  },
  /** 入力状況 */
  EnumINPUT_STATE: {
    NOT_ENTERED: {
      val: "0",
      dispname: "未入力（未保存）"
    },
    NOTIFICATION_ENABLED: {
      val: "1",
      dispname: "届出可能"
    },
    ERROR_STATE: {
      val: "2",
      dispname: "エラーあり（届出不可）"
    }
  },
  /** 出資持分法人種類 */
  EnumINVESTMENT_EQUITY_CORP_KIND: {
    FOUNDATION: {
      val: "1",
      dispname: "財団"
    },
    ASSOCIATION_INVESTMENT_EQUITY_AVAILBLE: {
      val: "2",
      dispname: "社団（出資持分あり）"
    },
    ASSOCIATION_INVESTMENT_EQUITY_NOT_AVAILBLE: {
      val: "3",
      dispname: "社団（出資持分なし）"
    }
  },
  /** ログイン有効無効種別 */
  EnumLOGIN_UNAVAILABLE_TYPE: {
    AVAILABLE: {
      val: "0",
      dispname: "有効"
    },
    UNAVAILABLE: {
      val: "1",
      dispname: "無効（ログイン不可）"
    }
  },
  /** メール送信ステータス */
  EnumMAIL_SEND_STATUS: {
    UNSEND: {
      val: "0",
      dispname: "未送信"
    },
    SENDING: {
      val: "1",
      dispname: "送信中"
    },
    SEND: {
      val: "2",
      dispname: "送信済"
    },
    ERR: {
      val: "3",
      dispname: "エラー"
    }
  },
  /** メール種別 */
  EnumMAIL_TYPE: {
    NOTICE: {
      val: "01",
      dispname: "届出"
    },
    APPR: {
      val: "02",
      dispname: "承認"
    },
    REMAND: {
      val: "03",
      dispname: "差戻し"
    },
    BACK: {
      val: "04",
      dispname: "取戻し"
    },
    USER_INFO_REG: {
      val: "05",
      dispname: "ユーザ情報登録"
    },
    PASS_RESET_NOTICE: {
      val: "06",
      dispname: "パスワードリセット通知"
    },
    PASS_RESET_RE_NOTICE: {
      val: "07",
      dispname: "パスワードリセット再通知"
    }
  },
  /** 主たる診療科区分 */
  EnumMAIN_CL_DEPARTMENT_CLASS: {
    INTERNAL_MEDICINE: {
      val: "01",
      dispname: "01内科"
    },
    RESPIRATORY_MEDICINE: {
      val: "02",
      dispname: "02呼吸器内科"
    },
    CARDIOLOGY: {
      val: "03",
      dispname: "03循環器内科"
    },
    GASTROENTEROLOGY: {
      val: "04",
      dispname: "04消化器内科（胃腸内科）"
    },
    NEPHROLOGY: {
      val: "05",
      dispname: "05腎臓内科"
    },
    NEUROLOGY: {
      val: "06",
      dispname: "06神経内科"
    },
    DIABETOLOGY_INTERNAL_MEDICINE: {
      val: "07",
      dispname: "07糖尿病内科（代謝内科）"
    },
    HEMATOLOGY: {
      val: "08",
      dispname: "08血液内科"
    },
    DERMATOLOGY: {
      val: "09",
      dispname: "09皮膚科"
    },
    ALLERGOLOGY: {
      val: "10",
      dispname: "10アレルギー科"
    },
    RHEUMATOLOGY: {
      val: "11",
      dispname: "11リウマチ科"
    },
    INFECTIOUS_DISEASE: {
      val: "12",
      dispname: "12感染症科"
    },
    PEDIATRICS: {
      val: "13",
      dispname: "13小児科"
    },
    PSYCHIATRY: {
      val: "14",
      dispname: "14精神科"
    },
    PSYCHOSOMATIC_MEDICINE: {
      val: "15",
      dispname: "15心療内科"
    },
    SURGERY: {
      val: "16",
      dispname: "16外科"
    },
    HORACIC_SURGERY: {
      val: "17",
      dispname: "17呼吸器外科"
    },
    CARDIOVASCULAR_SURGERY: {
      val: "18",
      dispname: "18心臓血管外科"
    },
    BREAST_SURGERY: {
      val: "19",
      dispname: "19乳腺外科"
    },
    TRACHEA_ESOPHAUS_SURGERY: {
      val: "20",
      dispname: "20気管食道外科"
    },
    GASTROENTEROLOGICAL_SURGERY: {
      val: "21",
      dispname: "21消化器外科（胃腸外科）"
    },
    UROLOGY: {
      val: "22",
      dispname: "22泌尿器科"
    },
    PROCTOLOGY: {
      val: "23",
      dispname: "23肛門外科"
    },
    NEUROSURGERY: {
      val: "24",
      dispname: "24脳神経外科"
    },
    ORTHOPEDIC_SURGERY: {
      val: "25",
      dispname: "25整形外科"
    },
    PLASTIC_SURGERY: {
      val: "26",
      dispname: "26形成外科"
    },
    COSMETIC_SURGERY: {
      val: "27",
      dispname: "27美容外科"
    },
    OPHTHALMOLOGY: {
      val: "28",
      dispname: "28眼科"
    },
    ENT: {
      val: "29",
      dispname: "29耳鼻咽喉科"
    },
    PEDIATRIC_SURGERY: {
      val: "30",
      dispname: "30小児外科"
    },
    OBSTETRICS_GYNECOLOGY: {
      val: "31",
      dispname: "31産婦人科"
    },
    OBSTETRICS: {
      val: "32",
      dispname: "32産科"
    },
    GYNECOLOGY: {
      val: "33",
      dispname: "33婦人科"
    },
    REHABILITATION: {
      val: "34",
      dispname: "34リハビリテーション科"
    },
    REDIOLOGY: {
      val: "35",
      dispname: "35放射線科"
    },
    ANESTHESILOLGY: {
      val: "36",
      dispname: "36麻酔科"
    },
    DIAGNOSTIC_PATHOLOGY: {
      val: "37",
      dispname: "37病理診断科"
    },
    CLINICAL_LABORATORY: {
      val: "38",
      dispname: "38臨床検査科"
    },
    EMERGENCY_MEDICINE: {
      val: "39",
      dispname: "39救急科"
    },
    DENTISTRY: {
      val: "40",
      dispname: "40歯科"
    },
    ORTHODONTICS: {
      val: "41",
      dispname: "41矯正歯科"
    },
    PEDIATRIC_DENTISTRY: {
      val: "42",
      dispname: "42小児歯科"
    },
    DENTAL_SURGERY: {
      val: "43",
      dispname: "43歯科口腔外科"
    },
    OTHER_CL_DEPARTMENT: {
      val: "44",
      dispname: "44その他の診療科"
    }
  },
  /** 会計月区分 */
  EnumMONTH_DIVISION: {
    JANUARY: {
      val: "01",
      dispname: "1月"
    },
    FEBRUARY: {
      val: "02",
      dispname: "2月"
    },
    MARCH: {
      val: "03",
      dispname: "3月"
    },
    APRIL: {
      val: "04",
      dispname: "4月"
    },
    MAY: {
      val: "05",
      dispname: "5月"
    },
    JUNE: {
      val: "06",
      dispname: "6月"
    },
    JULY: {
      val: "07",
      dispname: "7月"
    },
    AUGUST: {
      val: "08",
      dispname: "8月"
    },
    SEPTEMBER: {
      val: "09",
      dispname: "9月"
    },
    OCTOBER: {
      val: "10",
      dispname: "10月"
    },
    NOVEMBER: {
      val: "11",
      dispname: "11月"
    },
    DECEMBER: {
      val: "12",
      dispname: "12月"
    }
  },
  /** 届出操作ID */
  EnumNOTICE_OPE_ID: {
    CORP_INP: {
      val: "E01",
      dispname: "法人入力"
    },
    CORP_NOTICE: {
      val: "E02",
      dispname: "法人届出"
    },
    CORP_BACK: {
      val: "E03",
      dispname: "法人取戻し"
    },
    MECHA_INP: {
      val: "E04",
      dispname: "機構入力"
    },
    MECHA_NOTICE: {
      val: "E05",
      dispname: "機構届出"
    },
    MECHA_BACK: {
      val: "E06",
      dispname: "機構取戻し"
    },
    PREF_APPR: {
      val: "E07",
      dispname: "都道府県承認"
    },
    PREF_APPR_CANCEL: {
      val: "E08",
      dispname: "都道府県承認取消"
    },
    PREF_REMAND: {
      val: "E09",
      dispname: "都道府県差戻し"
    }
  },
  /** 届出状況一覧ステータス表示種別 */
  EnumNOTICE_SITU_LIST_DISPLAY_TYPE: {
    UNNOTICE: {
      val: "1",
      dispname: "未届出"
    },
    NOTICE: {
      val: "2",
      dispname: "届出済み"
    },
    REMAND: {
      val: "3",
      dispname: "差戻し"
    },
    APPR_WAIT: {
      val: "4",
      dispname: "承認待ち"
    },
    APPR: {
      val: "5",
      dispname: "承認済み"
    },
    CONFIRM: {
      val: "6",
      dispname: "確定"
    }
  },
  /** 届出ステータス */
  EnumNOTICE_STATUS: {
    CORP_INP_WAIT: {
      val: "S1",
      dispname: "法人入力待ち"
    },
    CORP_INP_COMP_WAIT: {
      val: "S2",
      dispname: "法人入力完了待ち"
    },
    REMAND: {
      val: "S3",
      dispname: "差戻し"
    },
    PREF_APPR_WAIT: {
      val: "S4",
      dispname: "都道府県承認待ち"
    },
    APPR: {
      val: "S5",
      dispname: "承認済み"
    }
  },
  /** 届出タイプ */
  EnumNOTICE_TYPE: {
    CL_OP_MED_CORP: {
      val: "1",
      dispname: "診療所のみ開設している医療法人"
    },
    HP_EL_CARE_OP_MED_CORP: {
      val: "2",
      dispname: "病院・老健・介護院のいずれか又は複数を開設している医療法人"
    },
    BS_DEBT_TWO_BIL_OR_PL_ONE_BIL: {
      val: "3",
      dispname: "医療法第51条第２項に該当する（BS負債20億以上又はPL収益10億以上等）社会医療法人"
    },
    NOT_APPLI_SOC_MED_CORP: {
      val: "4",
      dispname: "医療法第51条第２項に該当しない社会医療法人"
    },
    BS_DEBT_FIVE_BIL_OR_PL_SEVEN_BIL: {
      val: "5",
      dispname: "医療法第51条第２項に該当する（BS負債50億以上又はPL収益70億以上）医療法人"
    },
    REGION_MED_SOURCES_PROM_CORP: {
      val: "6",
      dispname: "地域医療連携推進法人"
    }
  },
  /** 届出方法種別 */
  EnumNOTIFICATION_METHOD_TYPE: {
    NOT_NOTIFICATION: {
      val: "0",
      dispname: "未届出"
    },
    WEB_INPUTS: {
      val: "1",
      dispname: "Web入力"
    },
    DOCUMENT_INPUTS: {
      val: "2",
      dispname: "書面入力"
    }
  },
  /** 届出検索ダウンロード種別 */
  EnumNOTIFICATION_SEARCH_DL_TYPE: {
    PDF_DOWNLOAD: {
      val: "P",
      dispname: "PDFダウンロード"
    },
    CSV_DOWNLOAD: {
      val: "C",
      dispname: "CSVダウンロード"
    }
  },
  /** 届出検索操作種別 */
  EnumNOTIFICATION_SEARCH_OPE_TYPE: {
    APPROVAL: {
      val: "1",
      dispname: "承認"
    },
    REMAND: {
      val: "2",
      dispname: "差戻し"
    },
    APPROVAL_CANCEL: {
      val: "3",
      dispname: "承認取消"
    },
    PDF_DOWNLOAD: {
      val: "4",
      dispname: "PDFダウンロード"
    },
    CSV_DOWNLOAD: {
      val: "5",
      dispname: "CSVダウンロード"
    }
  },
  /** 操作ID */
  EnumOPE_ID: {
    EXCEL_FORM_UL: {
      val: "01",
      dispname: "フォームのアップロード（Excel）"
    },
    CSV_UL: {
      val: "02",
      dispname: "CSVのアップロード"
    },
    EXCEL_FORM_BULK_UL: {
      val: "03",
      dispname: "フォームの一括アップロード（Excel）"
    },
    CSV_BULK_UL: {
      val: "04",
      dispname: "CSVの一括アップロード"
    },
    SAVE: {
      val: "05",
      dispname: "保存"
    },
    EXCEL_FORM_BLANK_UL: {
      val: "06",
      dispname: "フォームのダウンロード（ブランク）"
    },
    EXCEL_FORM_BLANK_BULK_UL: {
      val: "07",
      dispname: "フォームの一括ダウンロード（ブランク）"
    },
    EXCEL_FORM_INP_DL: {
      val: "08",
      dispname: "入力済みフォームのダウンロード（Excel）"
    },
    EXCEL_FORM_BULK_INP_DL: {
      val: "09",
      dispname: "入力済みフォームの一括ダウンロード（Excel）"
    },
    UL_ORI_FILE_DL: {
      val: "10",
      dispname: "アップロードしたファイルのダウンロード（オリジナル）"
    },
    UL_EXCEL_FORM_DL: {
      val: "11",
      dispname: "アップロードしたフォームのダウンロード(Excel)"
    },
    UL_CSV_FORM_DL: {
      val: "12",
      dispname: "アップロードしたフォームのダウンロード(CSV)"
    },
    UL_CSV_FORM_BULK_DL: {
      val: "13",
      dispname: "アップロードした入力フォームの一括ダウンロード（CSV）"
    },
    UL_EXCEL_FORM_BULK_DL: {
      val: "14",
      dispname: "アップロードした入力フォームの一括ダウンロード（Excel）"
    },
    PDF_BIZ_REPORT_ETC_DL: {
      val: "15",
      dispname: "PDFダウンロード（事業報告書等）"
    },
    CSV_BIZ_REPORT_ETC_MGT_INFO_ETC_DL: {
      val: "16",
      dispname: "CSVダウンロード（事業報告書等+経営情報等）"
    }
  },
  /** 都道府県メール通知種別 */
  EnumPREF_MAIL_NOTIFY_TYPE: {
    NOT_RECEIVE: {
      val: "0",
      dispname: "受信しない"
    },
    RECEIVE: {
      val: "1",
      dispname: "受信する"
    }
  },
  /** 処理状態ID */
  EnumPROCESS_STATE_ID: {
    PROC_WAIT: {
      val: "0",
      dispname: "処理待ち"
    },
    PROCESSING: {
      val: "1",
      dispname: "処理中"
    },
    PROC_END: {
      val: "2",
      dispname: "完了"
    },
    ERROR_EXISTS: {
      val: "3",
      dispname: "エラー有り"
    },
    EXCEPTION_ERR: {
      val: "4",
      dispname: "エラー発生"
    },
    DOWNLOAD_OK: {
      val: "5",
      dispname: "ダウンロード可能"
    }
  },
  /** 処理状況対象ID */
  EnumPROC_STATUS_TARGET_ID: {
    BUSINESS_REPORT: {
      val: "1",
      dispname: "事業報告書"
    },
    BALANCESHEET: {
      val: "2",
      dispname: "貸借対照表"
    },
    PROFIT_LOSS: {
      val: "3",
      dispname: "損益計算書"
    },
    ATTACHEMENT: {
      val: "4",
      dispname: "添付書類"
    }
  },
  /** パスワード強制変更種別 */
  EnumPWD_FORCED_CHANGE_TYPE: {
    NOT_FORCED_CHANGE: {
      val: "0",
      dispname: "強制変更としない"
    },
    FORCED_CHANGE: {
      val: "1",
      dispname: "強制変更とする"
    }
  },
  /** 報告書ID */
  EnumREPORT_ID: {
    BIZ_ENTP001: {
      val: "BIZ_ENTP001",
      dispname: "事業報告書タイプ１～５Excelファイル"
    },
    BIZ_ENTP003: {
      val: "BIZ_ENTP003",
      dispname: "事業報告書タイプ１～５（ブランク）Excelファイル"
    },
    BIZ_ENTP004: {
      val: "BIZ_ENTP004",
      dispname: "事業報告書タイプ１～５（入力済み）Excelファイル"
    },
    BS__ENTP006: {
      val: "BS__ENTP006",
      dispname: "貸借対照表タイプ１Excelファイル"
    },
    BS__ENTP008: {
      val: "BS__ENTP008",
      dispname: "貸借対照表タイプ１（ブランク）Excelファイル"
    },
    BS__ENTP009: {
      val: "BS__ENTP009",
      dispname: "貸借対照表タイプ１（入力済み）Excelファイル"
    },
    BS__ENTP011: {
      val: "BS__ENTP011",
      dispname: "貸借対照表タイプ２～５Excelファイル"
    },
    BS__ENTP013: {
      val: "BS__ENTP013",
      dispname: "貸借対照表タイプ２～５（ブランク）Excelファイル"
    },
    BS__ENTP014: {
      val: "BS__ENTP014",
      dispname: "貸借対照表タイプ２～５（入力済み）Excelファイル"
    },
    PL__ENTP016: {
      val: "PL__ENTP016",
      dispname: "損益計算書タイプ１Excelファイル"
    },
    PL__ENTP018: {
      val: "PL__ENTP018",
      dispname: "損益計算書タイプ１（ブランク）Excelファイル"
    },
    PL__ENTP019: {
      val: "PL__ENTP019",
      dispname: "損益計算書タイプ１（入力済み）Excelファイル"
    },
    PL__ENTP021: {
      val: "PL__ENTP021",
      dispname: "損益計算書タイプ２～５Excelファイル"
    },
    PL__ENTP023: {
      val: "PL__ENTP023",
      dispname: "損益計算書タイプ２～５（ブランク）Excelファイル"
    },
    PL__ENTP024: {
      val: "PL__ENTP024",
      dispname: "損益計算書タイプ２～５（入力済み）Excelファイル"
    },
    MNG_ENTP026: {
      val: "MNG_ENTP026",
      dispname: "（様式１）経営情報等（病院）Excelファイル"
    },
    MNG_ENTP028: {
      val: "MNG_ENTP028",
      dispname: "（様式１）経営情報等（病院）（ブランク）Excelファイル"
    },
    MNG_ENTP029: {
      val: "MNG_ENTP029",
      dispname: "（様式１）経営情報等（病院）（入力済み）Excelファイル"
    },
    MNG_ENTP031: {
      val: "MNG_ENTP031",
      dispname: "（様式２）経営情報等（診療所）Excelファイル"
    },
    MNG_ENTP033: {
      val: "MNG_ENTP033",
      dispname: "（様式２）経営情報等（診療所）（ブランク）Excelファイル"
    },
    MNG_ENTP034: {
      val: "MNG_ENTP034",
      dispname: "（様式２）経営情報等（診療所）（入力済み）Excelファイル"
    },
    MNG_ENTP036: {
      val: "MNG_ENTP036",
      dispname: "（様式３）経営情報等（報告対象外）Excelファイル"
    },
    MNG_ENTP038: {
      val: "MNG_ENTP038",
      dispname: "（様式３）経営情報等（報告対象外）（ブランク）Excelファイル"
    },
    MNG_ENTP039: {
      val: "MNG_ENTP039",
      dispname: "（様式３）経営情報等（報告対象外）（入力済み）Excelファイル"
    },
    BIZ_ENTF101: {
      val: "BIZ_ENTF101",
      dispname: "事業報告基本データCSVファイル"
    },
    BIZ_ENTF102: {
      val: "BIZ_ENTF102",
      dispname: "事業報告基本データ_従たる事務所の所在地CSVファイル"
    },
    BIZ_ENTF103: {
      val: "BIZ_ENTF103",
      dispname: "事業報告基本データ_役員及び評議員CSVファイル"
    },
    BIZ_ENTF104: {
      val: "BIZ_ENTF104",
      dispname: "本来業務（病院、診療所）CSVファイル"
    },
    BIZ_ENTF105: {
      val: "BIZ_ENTF105",
      dispname: "本来業務（介護老人保健施設、介護医療院）CSVファイル"
    },
    BIZ_ENTF106: {
      val: "BIZ_ENTF106",
      dispname: "附帯業務CSVファイル"
    },
    BIZ_ENTF107: {
      val: "BIZ_ENTF107",
      dispname: "収益業務CSVファイル"
    },
    BIZ_ENTF108: {
      val: "BIZ_ENTF108",
      dispname: "議決又は同意した事項CSVファイル"
    },
    BIZ_ENTF109: {
      val: "BIZ_ENTF109",
      dispname: "会計年度内に発行した医療機関債CSVファイル"
    },
    BIZ_ENTF110: {
      val: "BIZ_ENTF110",
      dispname: "会計年度内に購入した医療機関債CSVファイル"
    },
    BIZ_ENTF111: {
      val: "BIZ_ENTF111",
      dispname: "会計年度内に開設（許可を含む）した主要な施設CSVファイル"
    },
    BIZ_ENTF112: {
      val: "BIZ_ENTF112",
      dispname: "会計年度内に他の法律、通知等での指定事項CSVファイル"
    },
    BIZ_ENTF113: {
      val: "BIZ_ENTF113",
      dispname: "事業報告_その他CSVファイル"
    },
    BS__ENTF201: {
      val: "BS__ENTF201",
      dispname: "貸借対照表CSVファイル"
    },
    BS__ENTF202: {
      val: "BS__ENTF202",
      dispname: "貸借対照表CSVファイル（入力済み）"
    },
    PL__ENTF301: {
      val: "PL__ENTF301",
      dispname: "損益計算書CSVファイル"
    },
    PL__ENTF302: {
      val: "PL__ENTF302",
      dispname: "損益計算書CSVファイル（入力済み）"
    },
    MNG_ENTF401: {
      val: "MNG_ENTF401",
      dispname: "経営情報等CSVファイル"
    },
    MNG_ENTF402: {
      val: "MNG_ENTF402",
      dispname: "経営情報等CSVファイル（入力済み）"
    },
    MNG_ENTF404: {
      val: "MNG_ENTF404",
      dispname: "経営情報等単一ZIPファイル（ブランク）"
    },
    MNG_ENTF405: {
      val: "MNG_ENTF405",
      dispname: "経営情報等ZIPファイル（入力済み）"
    },
    MNG_ENTF406: {
      val: "MNG_ENTF406",
      dispname: "経営情報等ZIPファイル（アップロード）"
    },
    MNG_ENTF407: {
      val: "MNG_ENTF407",
      dispname: "経営情報等複数ZIPファイル（ブランク）"
    },
    NTF_MNMF101: {
      val: "NTF_MNMF101",
      dispname: "届出状況一覧CSVファイル"
    },
    NTF_MNMF102: {
      val: "NTF_MNMF102",
      dispname: "事業報告書+経営情報ZIPファイル"
    },
    COR_MNMF201: {
      val: "COR_MNMF201",
      dispname: "法人情報CSVファイル"
    },
    TOP_UTLF101: {
      val: "TOP_UTLF101",
      dispname: "事業報告書等ZIPファイル"
    }
  },
  /** 報告対象区分 */
  EnumREPORT_NOT_APPLICABLE: {
    REPORT_APPLICABLE: {
      val: "0",
      dispname: "報告対象"
    },
    REPORT_NOT_APPLICABLE: {
      val: "1",
      dispname: "報告対象外"
    }
  },
  /** 病床機能報告有無区分 */
  EnumSICKBED_FEATURE_REPORT_EXIST_CLASS: {
    AVAILBLE_DISPATCH_NOT_INCLUDE: {
      val: "1",
      dispname: "１有（派遣を含まない）"
    },
    AVAILBLE_DISPATCH_INCLUDE: {
      val: "2",
      dispname: "２有（派遣を含む）"
    },
    NOT_AVAILBLE: {
      val: "3",
      dispname: "３無"
    }
  },
  /** ステッパー表示種別 */
  EnumSTEPPER_DISPLAY_TYPE: {
    UNINP: {
      val: "1",
      dispname: "未入力"
    },
    INP: {
      val: "2",
      dispname: "入力中"
    },
    NOTICE: {
      val: "3",
      dispname: "届出済み"
    },
    APPR_WAIT: {
      val: "4",
      dispname: "承認待ち"
    },
    APPR: {
      val: "5",
      dispname: "承認済み"
    },
    CONFIRM: {
      val: "6",
      dispname: "確定"
    }
  },
  /** 消費税の経理方式種別 */
  EnumTAX_ACCOUNTING_METHOD_TYPE: {
    EXCLUSIVE_OF_TAX: {
      val: "1",
      dispname: "１税抜"
    },
    TAX_INCLUDED: {
      val: "2",
      dispname: "２税込"
    }
  },
  /** アップロードフォーム(タイプ6用)処理区分 */
  EnumUPLOAD_FORM_SAVE_PROC_CLASS: {
    FIRST_UPLOAD: {
      val: "1",
      dispname: "初回アップロード"
    },
    DELETE_ONLY: {
      val: "2",
      dispname: "削除のみ"
    },
    DELETE_AND_UPLOAD: {
      val: "3",
      dispname: "削除+アップロード"
    },
    COMMENT_UPDATE_ONLY: {
      val: "4",
      dispname: "コメント更新のみ"
    }
  },
  /** アップロード届出の希望有無区分 */
  EnumUPLOAD_NOTIFICATION_EXIST_TYPE: {
    AVAILBLE: {
      val: "1",
      dispname: "有"
    },
    NOT_AVAILBLE: {
      val: "2",
      dispname: "無"
    }
  },
  /** ユーザ検索操作種別 */
  EnumUSER_SEARCH_OPE_TYPE: {
    ENABLE: {
      val: "1",
      dispname: "有効化"
    },
    DISABLE: {
      val: "2",
      dispname: "無効化"
    },
    DELETE: {
      val: "3",
      dispname: "削除"
    }
  },
  /** ユーザ種別 */
  EnumUSER_TYPE: {
    MEDIC_CORP: {
      val: "01",
      dispname: "医療法人"
    },
    PREF_STAFF: {
      val: "02",
      dispname: "都道府県"
    },
    PROXY_INPUT_STAFF: {
      val: "03",
      dispname: "代理入力"
    },
    MEDIC_CARE_ORG_STAFF: {
      val: "04",
      dispname: "機構職員"
    }
  },
  /** 利用規約同意種別 */
  EnumUSE_TERMS_CONSENT_TYPE: {
    NOT_CONSENT: {
      val: "0",
      dispname: "同意しない"
    },
    CONSENTED: {
      val: "1",
      dispname: "同意する"
    }
  },
}
module.exports = comEnum;

# Policy Engine

خدمة FastAPI لقرارات توزيع الحمل بين الأبراج.

## التشغيل محلياً
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## مثال طلب API
```json
POST /policy/decision
{
  "downlink_mbps": 30,
  "uplink_mbps": 5,
  "rssi_dbm": -70,
  "sinr_db": 20,
  "cell_id": 1000
}
```

## ربط مع BigQuery
- الخدمة تسجل كل قرار نقل في جدول BigQuery (يجب ضبط متغيرات البيئة للمفتاح والمشروع).

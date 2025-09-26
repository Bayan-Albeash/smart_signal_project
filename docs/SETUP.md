# دليل الإعداد السريع - SmartSignal AI

## 📦 التثبيت السريع

### 1. تحضير البيئة
```bash
# إنشاء البيئة الافتراضية للباك إند
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# تثبيت تبعيات الفرونت إند
cd ../frontend
npm install
```

### 2. تشغيل المشروع

#### الطريقة الأولى: تشغيل تلقائي
```bash
# انقر مرتين على الملف
start.bat
```

#### الطريقة الثانية: تشغيل يدوي
```bash
# Terminal 1: الباك إند
cd backend
python app.py

# Terminal 2: الفرونت إند (في terminal جديد)
cd frontend
npm run dev
```

## 🔧 إعدادات البيئة

### متطلبات النظام
- ✅ Python 3.8+ مثبت
- ✅ Node.js 18+ مثبت
- ✅ Git مثبت (اختياري)

### البورتات المطلوبة
- `5000` - Flask Backend
- `5173` - React Frontend
- `8765` - WebSocket Server

## 🌍 متغيرات البيئة

انشئ ملف `.env` في مجلد `backend`:
```env
# Google Cloud (اختياري)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# API Keys (اختياري)
GEMINI_API_KEY=your-gemini-api-key

# Database (اختياري)
DATABASE_URL=sqlite:///app.db
```

## ⚡ نصائح الأداء

1. **تأكد من تفعيل البيئة الافتراضية** قبل تشغيل Python
2. **تأكد من تثبيت جميع التبعيات** قبل التشغيل
3. **أعد تشغيل النظام** إذا واجهت مشاكل في البورتات

## 🔍 حل المشاكل

### مشكلة: البورت مشغول
```bash
# إيقاف العمليات المشغلة للبورت
netstat -ano | findstr :5000
taskkill /PID <رقم_العملية> /F
```

### مشكلة: البيئة الافتراضية لا تعمل
```bash
# إعادة إنشاء البيئة الافتراضية
rmdir venv /s
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### مشكلة: npm install فشل
```bash
# تنظيف cache و إعادة التثبيت
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---
🚀 **المشروع جاهز للعمل!**
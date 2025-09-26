# دليل تشغيل مشروع SmartSignal AI

## 🚀 الطريقة السريعة (موصى بها)

### 1. تشغيل تلقائي مع تموضع النوافذ
```bash
# انقر مرتين على الملف
start_positioned.bat
```

### 2. تشغيل مبسط مع تموضع
```bash
# انقر مرتين على الملف
start_compact.bat
```

### 3. تشغيل متقدم مع تموضع دقيق
```bash
# انقر مرتين على الملف
start_powerful.bat
```

### 4. تشغيل يدوي مع دليل التموضع
```bash
# انقر مرتين على الملف
start_manual.bat
```

### 5. تشغيل بسيط (بدون تموضع)
```bash
# انقر مرتين على الملف
start_simple.bat
```

## 📋 الطريقة اليدوية

### 1. تشغيل Backend (الخلفية)
```bash
# افتح Command Prompt في مجلد المشروع
cd smart-signal-ai-mvp\backend

# تفعيل البيئة الافتراضية
venv\Scripts\activate

# تشغيل الخادم
python app.py
```

### 2. تشغيل Frontend (الواجهة)
```bash
# افتح Command Prompt جديد
cd smart-signal-ai-mvp\frontend

# تثبيت المكتبات (إذا لم تكن مثبتة)
npm install

# تشغيل خادم التطوير
npm run dev
```

### 3. تشغيل Policy Engine (اختياري)
```bash
# افتح Command Prompt جديد
cd smart-signal-ai-mvp\backend\policy_engine

# تثبيت المكتبات
pip install -r requirements.txt

# تشغيل الخادم
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🌐 الوصول للتطبيق

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Policy Engine**: http://localhost:8000

## 📐 تموضع النوافذ

### التخطيط المقترح:
```
┌─────────────────┬─────────────────┐
│   Backend       │   Frontend      │
│   (Top Left)    │   (Top Right)   │
│   600x400       │   600x400       │
├─────────────────┼─────────────────┤
│   Policy Engine │   (Available)   │
│   (Bottom Left) │                 │
│   600x400       │                 │
└─────────────────┴─────────────────┘
```

### خيارات التموضع:
1. **start_positioned.bat**: تموضع تلقائي
2. **start_compact.bat**: تموضع مبسط
3. **start_powerful.bat**: تموضع دقيق مع PowerShell
4. **start_manual.bat**: دليل تموضع يدوي
5. **start_simple.bat**: بدون تموضع

## ⚠️ ملاحظات مهمة

1. **تأكد من تثبيت Node.js** على جهازك
2. **تأكد من تثبيت Python 3.8+** على جهازك
3. **البيئة الافتراضية** موجودة في `smart-signal-ai-mvp\backend\venv`
4. **المكتبات** مثبتة مسبقاً في البيئة الافتراضية

## 🔧 حل المشاكل

### مشكلة: "npm run dev" لا يعمل
```bash
# تأكد من أنك في مجلد frontend
cd smart-signal-ai-mvp\frontend

# تثبيت المكتبات
npm install

# تشغيل التطبيق
npm run dev
```

### مشكلة: "python app.py" لا يعمل
```bash
# تأكد من تفعيل البيئة الافتراضية
cd smart-signal-ai-mvp\backend
venv\Scripts\activate

# تشغيل التطبيق
python app.py
```

### مشكلة: البورت مشغول
- تأكد من إغلاق جميع النوافذ السابقة
- أعد تشغيل Command Prompt
- جرب تشغيل الملفات مرة أخرى

## 📱 المميزات المتاحة

- ✅ **واجهة مستخدم تفاعلية** مع React
- ✅ **خرائط Google** مع أبراج حقيقية
- ✅ **محاكاة ذكية** مع XGBoost
- ✅ **تحليلات متقدمة** مع رسوم بيانية
- ✅ **Chatbot ذكي** مع Gemini AI
- ✅ **تقارير قابلة للتنزيل** (CSV/PDF)
- ✅ **وضع داكن/فاتح** قابل للتبديل
- ✅ **تأثيرات بصرية متحركة** للارقام والجداول

## 🎯 الاستخدام

1. **الصفحة الرئيسية**: نظرة عامة على المشروع
2. **الخريطة والمحاكاة**: مراقبة الأبراج ومحاكاة إعادة التوزيع
3. **التحليلات**: تقارير مفصلة ومؤشرات الأداء
4. **نبذة عن**: معلومات عن المشروع والفريق
5. **تواصل**: معلومات التواصل والاستفسارات

## 🆘 الدعم

إذا واجهت أي مشاكل، تأكد من:
- تشغيل جميع الأوامر من المجلد الصحيح
- تفعيل البيئة الافتراضية للـ Python
- تثبيت جميع المكتبات المطلوبة
- فتح البورتات المطلوبة (5000, 5173, 8000)

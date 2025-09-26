# SmartSignal AI - مشروع الذكاء الاصطناعي لإدارة الإشارات

## 📋 نظرة عامة
مشروع SmartSignal AI هو نظام ذكي لإدارة وتحليل إشارات الاتصالات باستخدام الذكاء الاصطناعي وتعلم الآلة.

## 📁 هيكل المشروع

```
smart_signal_project_organized/
├── backend/                 # خادم Flask الخلفي
│   ├── app.py              # التطبيق الرئيسي
│   ├── routes/             # مسارات API
│   ├── models/             # نماذج البيانات
│   ├── services/           # خدمات النظام
│   ├── utils/              # أدوات مساعدة
│   ├── ml/                 # خوارزميات التعلم الآلي
│   └── policy_engine/      # محرك السياسات
├── frontend/               # واجهة React المستخدم
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   ├── pages/          # صفحات التطبيق
│   │   ├── context/        # إدارة الحالة
│   │   ├── hooks/          # React Hooks
│   │   └── utils/          # أدوات مساعدة
│   ├── package.json        # تبعيات Node.js
│   └── vite.config.js      # إعدادات Vite
├── data/                   # بيانات الأبراج والإشارات
├── docs/                   # التوثيق
├── scripts/                # سكريبتات التشغيل
└── tests/                  # الاختبارات
```

## 🚀 كيفية التشغيل

### المتطلبات الأساسية
- Python 3.8+
- Node.js 18+
- npm أو yarn

### تشغيل الباك إند
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### تشغيل الفرونت إند
```bash
cd frontend
npm install
npm run dev
```

## ✨ المميزات

- 🗺️ **خرائط تفاعلية** مع Google Maps
- 🤖 **ذكاء اصطناعي** مع XGBoost
- 💬 **شات بوت ذكي** مع Gemini AI
- 📊 **تحليلات متقدمة** ولوحة معلومات
- 🔄 **تحديثات فورية** مع WebSocket
- 📱 **تصميم متجاوب** وسهل الاستخدام
- 🌙 **الوضع المظلم/الفاتح** قابل للتبديل

## 🔗 الخدمات

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **WebSocket**: ws://localhost:8765

## 📞 الدعم

للحصول على المساعدة أو الإبلاغ عن مشاكل، يرجى فتح issue في GitHub.

---
تم تطوير هذا المشروع بواسطة فريق SmartSignal AI
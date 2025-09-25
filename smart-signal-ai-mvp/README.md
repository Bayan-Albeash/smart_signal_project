# SmartSignal AI - نظام ذكي لتوزيع إشارات الاتصال

## 🎯 نظرة عامة

SmartSignal AI هو نظام ذكي متطور لتوزيع إشارات الاتصال الخلوي باستخدام الذكاء الاصطناعي والتعلم الآلي. يهدف النظام إلى تحسين كفاءة الشبكات الخلوية وتقليل الحمل الزائد على الأبراج من خلال إعادة التوزيع الذكي للمستخدمين.

## ✨ المميزات الرئيسية

### 🤖 الذكاء الاصطناعي
- **XGBoost Model**: تنبؤ ذكي بحمل الأبراج
- **Gemini AI Integration**: تفسير القرارات وتقديم التوصيات
- **Policy Engine**: اتخاذ قرارات ذكية لإعادة التوزيع

### 📊 المحاكاة والتحليل
- **Real-time Simulation**: محاكاة فورية لتوزيع المستخدمين
- **Interactive Google Maps**: خرائط تفاعلية مع أيقونات الأبراج الحقيقية
- **Scenario Replay**: إعادة تشغيل السيناريوهات بصرياً مع timeline
- **Advanced Analytics**: لوحة تحكم شاملة مع Recharts و KPIs
- **Signal Flow Visualization**: خطوط تدفق الإشارات بين الأبراج

### 🗺️ البيانات الجغرافية
- **Jordan Towers Data**: بيانات أبراج حقيقية من الأردن
- **Real-time Monitoring**: مراقبة لحظية للأداء
- **Heatmap Visualization**: تصور حراري للحمل

### 🎨 تجربة المستخدم المتقدمة
- **Dark/Light Mode**: وضع داكن وفاتح مع حفظ التفضيلات
- **Framer Motion**: animations سلسة ومتقدمة
- **Responsive Design**: تصميم متجاوب لجميع الأجهزة
- **Interactive Elements**: عناصر تفاعلية مع hover effects
- **Real-time Updates**: تحديثات لحظية للبيانات

## 🏗️ البنية التقنية

```
smart-signal-ai-mvp/
├── backend/                 # Flask API Server
│   ├── app.py              # Main application
│   ├── routes/             # API endpoints
│   ├── models/             # Data models
│   ├── ml/                 # ML models
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── hooks/          # Custom hooks
│   └── package.json        # Node dependencies
├── ml-models/              # Trained ML models
├── data/                   # Data files
└── docs/                   # Documentation
```

## 🚀 التثبيت والتشغيل

### المتطلبات
- Python 3.9+
- Node.js 18+
- Google Maps API Key
- Gemini AI API Key

### 1. تشغيل سريع

```bash
# اضغط مرتين على الملف
start.bat
```

### 2. إعداد متغيرات البيئة

```bash
# انسخ ملف المثال
cp .env.example .env

# عدّل الملف وأضف مفاتيح API الخاصة بك
# GOOGLE_MAPS_API_KEY=your-key-here
# GEMINI_API_KEY=your-key-here
```

### 2. تشغيل يدوي

#### Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

#### Policy Engine:
```bash
cd backend/policy_engine
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🌐 الخدمات المُشغلة

- **Backend API**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`
- **Policy Engine**: `http://localhost:8000`

## 📱 الصفحات الرئيسية

### 🏠 الصفحة الرئيسية
- شعار النظام
- فيديو توضيحي
- إحصائيات سريعة
- زر الانتقال للخريطة

### 🗺️ خريطة المحاكاة
- **خرائط Google Maps تفاعلية** مع أيقونات الأبراج الحقيقية
- **ألوان متدرجة** حسب الحمل (🟢 عادي، 🟠 مزدحم، 🔴 محمل زائد)
- **خطوط تدفق الإشارات** مع Polyline متحركة
- **Scenario Replay** مع timeline تفاعلي
- **لوحة التحكم** مع أزرار التحكم المتقدمة
- **تفاصيل الأبراج** عند النقر عليها

### 📊 التحليلات والتقارير
- **Recharts Integration** للرسوم البيانية التفاعلية
- **KPIs حية** مع اتجاهات التغيير
- **Heatmap visualization** لتوزيع الحمل
- **مقارنات الأداء** قبل وبعد التحسين
- **تقارير Gemini AI** مع توصيات ذكية
- **تنزيل التقارير** بصيغة JSON

## 🤖 نماذج الذكاء الاصطناعي

### XGBoost Predictor
```python
# تنبؤ بحمل الأبراج
predictor = XGBoostPredictor()
predictions = predictor.predict_tower_loads(towers_data)
```

### Gemini AI Integration
```python
# تفسير القرارات
explanation = model.generate_content(context)
```

### Policy Engine المتقدم
```python
# قرارات ذكية مع hysteresis و rollback
policy_decision = {
    "decision": "migrate",
    "load_percentage": 85.3,
    "failure_rate": 5.2,
    "rollback": False,
    "hysteresis_applied": True
}
```

## 📊 البيانات المدعومة

### أبراج الأردن
- **زين الأردن**: 40% من الأبراج
- **أورانج الأردن**: 35% من الأبراج  
- **أمنية**: 25% من الأبراج

### المدن المُغطاة
- عمان (4 أبراج)
- الزرقاء (2 برج)
- إربد (2 برج)
- العقبة (1 برج)
- الكرك (1 برج)
- الطفيلة (1 برج)
- معان (1 برج)

## 🔧 التكوين

### متغيرات البيئة
```bash
# Backend
FLASK_ENV=development
DEBUG=True

# Google Services
GOOGLE_MAPS_API_KEY=your_api_key
GEMINI_API_KEY=your_gemini_key

# Database
DATABASE_URL=sqlite:///app.db
```

## 📈 المقاييس والأداء

### KPIs الرئيسية
- **Network Efficiency**: 85-95%
- **User Satisfaction**: 4.0-5.0
- **Tower Utilization**: 70-85%
- **Handover Success Rate**: 95-99%

### التحسينات المتوقعة
- تقليل الحمل الزائد: 75%
- تحسين زمن الاستجابة: 26%
- زيادة الكفاءة: 16%
- رضا المستخدمين: 44%

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19** - واجهة المستخدم
- **Vite** - أداة البناء
- **Tailwind CSS** - التصميم مع Dark Mode
- **Google Maps API** - الخرائط التفاعلية
- **Recharts** - الرسوم البيانية التفاعلية
- **Framer Motion** - animations متقدمة
- **Lucide React** - أيقونات حديثة

### Backend
- **Flask** - خادم API الرئيسي
- **FastAPI** - Policy Engine
- **SQLAlchemy** - قاعدة البيانات
- **XGBoost** - التعلم الآلي
- **Google Cloud** - الخدمات السحابية
- **BigQuery** - تسجيل القرارات

### ML/AI
- **XGBoost** - نموذج التنبؤ
- **Gemini AI** - تفسير القرارات
- **Pandas** - معالجة البيانات
- **NumPy** - العمليات الرياضية

## 📝 API Endpoints

### Simulation
- `POST /api/simulation/run` - تشغيل المحاكاة
- `GET /api/simulation/towers` - بيانات الأبراج
- `GET /api/simulation/realtime` - البيانات اللحظية

### Analytics
- `GET /api/analytics/kpis` - مؤشرات الأداء
- `GET /api/analytics/heatmap` - بيانات الخريطة الحرارية
- `POST /api/analytics/reports/generate` - توليد التقارير

### Gemini AI
- `POST /api/gemini/explain` - تفسير القرارات
- `POST /api/gemini/chat` - محادثة مع الذكاء الاصطناعي
- `POST /api/gemini/recommendations` - التوصيات
- `POST /api/gemini/report` - توليد تقارير ذكية

### Policy Engine (Port 8000)
- `POST /policy/decision` - قرارات ذكية مع hysteresis
- `GET /policy/status` - حالة محرك السياسات
- `POST /policy/batch` - معالجة متعددة الأبراج
- `GET /policy/config` - إعدادات السياسات الافتراضية

## 🎥 Demo Video

[رابط الفيديو التوضيحي](https://example.com/demo)

## 📞 الدعم والتواصل

- **البريد الإلكتروني**: support@smartsignal.ai
- **الموقع**: https://smartsignal.ai
- **التوثيق**: [رابط الوثائق](https://docs.smartsignal.ai)

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) قبل البدء.

---

**SmartSignal AI** - مستقبل الشبكات الذكية في الأردن 🇯🇴
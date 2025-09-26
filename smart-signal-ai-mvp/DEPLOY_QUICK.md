# SmartSignal AI - دليل النشر

## النشر السريع

### 1. النشر على Vercel (الأسهل)

#### الخطوات:
1. إذهب إلى [vercel.com](https://vercel.com) وسجل دخول بحساب GitHub
2. إضغط "New Project"
3. إختر هذا المشروع من GitHub
4. Vercel سيتولى الباقي تلقائياً!

#### البيئة المطلوبة:
- Frontend: تلقائي
- Backend: Python 3.9+

### 2. النشر على Railway

#### الخطوات:
1. إذهب إلى [railway.app](https://railway.app)
2. سجل دخول بحساب GitHub
3. "New Project" > "Deploy from GitHub repo"
4. إختر المشروع وسيتم النشر تلقائياً

### 3. النشر اليدوي

#### تجهيز المشروع:
```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd ../backend
pip install -r requirements.txt
python app.py
```

#### الروابط بعد النشر:
- **Frontend**: `https://your-domain.com`
- **API**: `https://your-domain.com/api/`
- **Health Check**: `https://your-domain.com/api/health`

## المتغيرات البيئية المطلوبة

أضف هذه المتغيرات في لوحة التحكم للمنصة:

```env
PORT=5000
FLASK_ENV=production
GOOGLE_CLOUD_PROJECT=your-project-id (اختياري)
```

## التحقق من النشر

بعد النشر، تأكد من:
- ✅ Frontend يعمل ويظهر الصفحة الرئيسية
- ✅ API يرجع استجابة: `/api/health`
- ✅ كل الصفحات تعمل (Analytics, Map, etc.)

---

**ملاحظة**: تم تجهيز المشروع مسبقاً بملفات الإعداد المطلوبة:
- `vercel.json` - إعداد Vercel
- `Procfile` - إعداد Heroku/Railway
- `.gitignore` - تجاهل الملفات غير المطلوبة
# دليل النشر - SmartSignal AI

## إعداد المشروع للنشر على السيرفر

### 1. متطلبات النظام
- **Backend**: Python 3.9+, Flask, WebSocket support
- **Frontend**: Node.js 18+, npm/yarn
- **Database**: Optional (يمكن استخدام الذاكرة)
- **Services**: Google Cloud AI Platform (اختياري)

### 2. بناء المشروع للإنتاج

#### بناء Frontend
```bash
cd frontend
npm install
npm run build
```

#### إعداد Backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. النشر المحلي (Development)
```bash
# بدء Backend
cd backend
python app.py

# بدء Frontend (في terminal آخر)
cd frontend
npm run dev
```

### 4. النشر على السيرفر (Production)

#### استخدام Docker
```bash
# بناء صورة Docker للـ Backend
cd backend
docker build -t smartsignal-backend .
docker run -p 8080:8080 smartsignal-backend

# Frontend سيتم تقديمه من Backend static files
```

#### النشر على Google Cloud Run
```bash
# تحديث PROJECT_ID في deploy.sh
./deploy.sh
```

### 5. متغيرات البيئة المطلوبة

إنشئ ملف `.env` في مجلد Backend:
```env
# Google Cloud AI
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT=your-project-id

# Flask Configuration
SECRET_KEY=your-secret-key
FLASK_ENV=production

# WebSocket
WEBSOCKET_PORT=8765
```

### 6. الميزات المطبقة

#### ✅ نظام الثيمات
- **Light Theme**: ثيم فاتح مع تباين عالي وخلفية بيضاء نظيفة
- **Dark Theme**: ثيم داكن للاستخدام الليلي
- **Theme Toggle**: زر التبديل في شريط التنقل
- **Persistent Storage**: حفظ التفضيل في localStorage

#### ✅ الشات بوت (GeminiChat)
- **Real-time Chat**: محادثة فورية مع Gemini AI
- **Arabic Support**: دعم كامل للغة العربية
- **Network Context**: تحليل خاص بالشبكات الخلوية
- **Download Reports**: إمكانية تحميل التقارير
- **Suggested Questions**: أسئلة مقترحة للبدء

#### ✅ البنية التحتية للنشر
- **Docker Ready**: Dockerfile جاهز للاستخدام
- **Production Build**: بناء محسن للإنتاج
- **CORS Support**: دعم Cross-Origin requests
- **Static Files**: تقديم Frontend من Backend
- **Health Check**: endpoint للتحقق من صحة الخدمة

### 7. اختبار النظام

#### اختبار الشات بوت
```bash
curl -X POST http://localhost:5000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "مرحبا", "context": "network_analysis"}'
```

#### اختبار الثيمات
1. افتح http://localhost:5173
2. اضغط على زر الشمس/القمر في شريط التنقل
3. تأكد من تبديل الثيم بسلاسة
4. أعد تحميل الصفحة للتأكد من حفظ التفضيل

### 8. الأمان والأداء

#### الأمان
- CORS محدود للمجالات المسموحة في الإنتاج
- API keys محمية في متغيرات البيئة
- Rate limiting للشات بوت

#### الأداء
- Static files caching
- CSS/JS minification
- Image optimization
- WebSocket للتحديثات الفورية

### 9. المراقبة والصيانة

#### Logs
```bash
# عرض logs الـ Backend
docker logs smartsignal-backend

# عرض معلومات الأداء
curl http://localhost:5000/api/health
```

#### Updates
```bash
# تحديث Dependencies
cd backend && pip install -r requirements.txt --upgrade
cd frontend && npm update
```

## ملاحظات مهمة

1. **Gemini AI**: يتطلب مفتاح API صالح من Google
2. **WebSocket**: يعمل على port 8765 بشكل افتراضي
3. **Frontend Building**: يجب بناء Frontend قبل النشر على الإنتاج
4. **Arabic RTL**: النظام يدعم الكتابة من اليمين لليسار
5. **Responsive Design**: يعمل على جميع أحجام الشاشات

## الدعم التقني

لأي مشاكل أو استفسارات:
- تحقق من logs السيرفر
- اختبر API endpoints باستخدام curl
- تأكد من إعداد متغيرات البيئة بشكل صحيح
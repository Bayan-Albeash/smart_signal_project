# 🚀 SmartSignal AI - نظام ذكي لإدارة أبراج الاتصالات

## 📋 نظرة عامة

نظام SmartSignal AI هو حل متطور وشامل لإدارة وتحسين أداء شبكات الاتصالات الخلوية. يستخدم النظام تقنيات الذكاء الاصطناعي المتقدمة وخدمات Google Cloud لتوفير:

- **تنبؤات دقيقة** بأحمال الأبراج
- **تحليلات متقدمة** لأداء الشبكة
- **تحديثات فورية** عبر WebSocket
- **نشر سحابي** مُحسن على Google Cloud

## 🌟 الميزات الجديدة

### 1. 🧠 تكامل Vertex AI
- **نشر نماذج XGBoost** على Vertex AI
- **تكامل Gemini AI** للتحليلات الذكية
- **تدريب محسن** للنماذج مع معايرة تلقائية
- **مراقبة أداء** النماذج في الوقت الفعلي

### 2. 📊 تكامل BigQuery
- **تخزين البيانات** في BigQuery
- **تحليلات متقدمة** للشبكة
- **تقارير شاملة** وKPIs محسنة
- **استعلامات سريعة** للبيانات التاريخية

### 3. ☁️ Google Cloud Storage
- **نسخ احتياطية** تلقائية
- **إدارة الملفات** السحابية
- **تخزين آمن** للبيانات والنماذج
- **استعادة سريعة** من النسخ الاحتياطية

### 4. 🐳 نشر Cloud Run
- **حاويات محسنة** للإنتاج
- **تطوير تدريجي** مع CI/CD
- **مقاومة الأخطاء** والإصلاح التلقائي
- **سرعة استجابة** عالية

### 5. ⚡ WebSocket للتحديثات الفورية
- **تحديثات مباشرة** للأبراج والKPIs
- **تنبيهات فورية** للمشاكل
- **اتصالات متعددة** العملاء
- **إدارة ذكية** للجلسات

### 6. 🔧 تحسينات الأداء
- **تخزين مؤقت** ذكي للبيانات
- **ضغط البيانات** لتوفير bandwidth
- **معالجة غير متزامنة** للمهام الثقيلة
- **مراقبة الأداء** المستمرة

## 🛠️ التقنيات المستخدمة

### Backend
- **Flask** - إطار عمل API
- **XGBoost** - نماذج التعلم الآلي
- **WebSocket** - التحديثات الفورية
- **Google Cloud AI Platform** - خدمات الذكاء الاصطناعي

### Google Cloud Services
- **Vertex AI** - نشر النماذج والتنبؤات
- **BigQuery** - تخزين وتحليل البيانات
- **Cloud Storage** - إدارة الملفات والنسخ الاحتياطية
- **Cloud Run** - نشر التطبيقات
- **Gemini AI** - تحليلات ذكية

### Frontend
- **React** - واجهة المستخدم
- **Vite** - أداة التطوير السريع
- **Tailwind CSS** - تصميم واجهة المستخدم

## 🚀 كيفية التشغيل

### 1. إعداد البيئة المحلية

```bash
# استنساخ المشروع
git clone [repository-url]
cd smart-signal-ai-mvp

# تثبيت متطلبات Backend
cd backend
pip install -r requirements.txt

# تثبيت متطلبات Frontend
cd ../frontend
npm install
```

### 2. إعداد Google Cloud

```bash
# تسجيل الدخول لـ Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# إعداد متغيرات البيئة
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_API_KEY=your-gemini-api-key
```

### 3. تشغيل التطبيق محلياً

```bash
# تشغيل Backend
cd backend
python app.py

# تشغيل Frontend (terminal جديد)
cd frontend
npm run dev
```

### 4. النشر على Google Cloud

```bash
# تنفيذ سكريبت النشر
chmod +x deploy.sh
./deploy.sh
```

## 🌐 نقاط النهاية (API Endpoints)

### المراقبة والتحليلات
```
GET /api/health - فحص صحة النظام
GET /api/analytics/kpis - مؤشرات الأداء الرئيسية
GET /api/analytics/bigquery/analytics - تحليلات BigQuery
POST /api/analytics/bigquery/store - حفظ البيانات في BigQuery
```

### إدارة التخزين السحابي
```
POST /api/storage/upload - رفع الملفات
POST /api/storage/backup/create - إنشاء نسخة احتياطية
GET /api/storage/backup/list - قائمة النسخ الاحتياطية
GET /api/storage/stats - إحصائيات التخزين
```

### مقاييس الأداء
```
GET /api/performance/stats - إحصائيات الأداء
POST /api/performance/optimize/memory - تحسين الذاكرة
POST /api/performance/compress - ضغط البيانات
GET /api/performance/health - فحص صحة الأداء
```

### النماذج والتنبؤات
```
POST /api/ml/train - تدريب النموذج
POST /api/ml/predict - التنبؤ بأحمال الأبراج
GET /api/ml/performance - مراقبة أداء النموذج
```

## 📡 WebSocket Endpoints

```
ws://localhost:8765 - خادم WebSocket للتحديثات الفورية
```

### رسائل WebSocket المدعومة:
- `subscribe` - الاشتراك في تحديثات معينة
- `request_tower_data` - طلب بيانات الأبراج
- `ping` - اختبار الاتصال

## 🔧 الإعدادات والتكوين

### متغيرات البيئة المطلوبة

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_API_KEY=your-gemini-api-key

# Flask
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key

# WebSocket
WEBSOCKET_PORT=8765
```

## 📊 مراقبة النظام

### مقاييس الأداء المتاحة:
- **استهلاك الذاكرة** - مراقبة مستمرة
- **سرعة الاستجابة** - قياس زمن الاستجابة
- **معدل نجاح Cache** - كفاءة التخزين المؤقت
- **عدد الاتصالات النشطة** - WebSocket connections

### التنبيهات والإشعارات:
- تنبيهات الأحمال العالية
- تحذيرات استهلاك الذاكرة
- إشعارات فشل النماذج
- تقارير الأداء اليومية

## 🔐 الأمان

- **مصادقة Google Cloud** - OAuth 2.0
- **تشفير البيانات** - HTTPS/WSS
- **إدارة الأذونات** - IAM roles
- **مراجعة الوصول** - Cloud Audit Logs

## 🚀 خطط التطوير المستقبلية

### Phase 2: التحسينات المتقدمة
- [ ] تكامل مع المزيد من مصادر البيانات
- [ ] نماذج ML متقدمة (Deep Learning)
- [ ] واجهة مستخدم محسنة للجوال
- [ ] تقارير متقدمة وliveboards

### Phase 3: التوسع والأتمتة
- [ ] Multi-region deployment
- [ ] أتمتة كاملة للقرارات
- [ ] تكامل مع أنظمة OSS/BSS
- [ ] AI-powered network optimization

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة وإرسال Pull Requests.

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف LICENSE للتفاصيل.

## 📞 الدعم الفني

للدعم الفني والاستفسارات:
- 📧 Email: support@smartsignal-ai.com
- 💬 Discord: [Community Server]
- 📚 Documentation: [Wiki Pages]

---

**تم التطوير بـ ❤️ للمجتمع العربي التقني**

🌟 **لا تنس إعطاء نجمة للمشروع إذا أعجبك!** 🌟
# 🚀 دليل التشغيل الشامل - SmartSignal AI

## 📋 المحتويات
1. [متطلبات النظام](#متطلبات-النظام)
2. [إعداد Google Cloud](#إعداد-google-cloud)
3. [تثبيت المشروع](#تثبيت-المشروع)
4. [التكوين](#التكوين)
5. [اختبار النظام](#اختبار-النظام)
6. [تشغيل المشروع](#تشغيل-المشروع)
7. [النشر السحابي](#النشر-السحابي)
8. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🔧 متطلبات النظام

### البرامج المطلوبة:
- **Python 3.8+** 
- **Node.js 16+** (للفرونت إند)
- **Git**
- **Google Cloud SDK** (gcloud)

### حساب Google Cloud:
- مشروع Google Cloud Platform نشط
- تفعيل APIs المطلوبة
- حساب دفع (للخدمات المتقدمة)

---

## ☁️ إعداد Google Cloud

### 1️⃣ إنشاء مشروع جديد
```bash
# تسجيل الدخول إلى Google Cloud
gcloud auth login

# إنشاء مشروع جديد
gcloud projects create YOUR-PROJECT-ID --name="SmartSignal AI"

# تعيين المشروع الافتراضي
gcloud config set project YOUR-PROJECT-ID
```

### 2️⃣ تفعيل APIs المطلوبة
```bash
# تفعيل جميع APIs المطلوبة
gcloud services enable \
  aiplatform.googleapis.com \
  bigquery.googleapis.com \
  storage.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  generativelanguage.googleapis.com
```

### 3️⃣ إنشاء Service Account
```bash
# إنشاء service account
gcloud iam service-accounts create smartsignal-ai \
  --display-name="SmartSignal AI Service Account"

# إعطاء الصلاحيات المطلوبة
gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
  --member="serviceAccount:smartsignal-ai@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.admin"

gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
  --member="serviceAccount:smartsignal-ai@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.admin"

gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
  --member="serviceAccount:smartsignal-ai@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# تحميل مفتاح JSON
gcloud iam service-accounts keys create credentials.json \
  --iam-account=smartsignal-ai@YOUR-PROJECT-ID.iam.gserviceaccount.com
```

### 4️⃣ إعداد BigQuery
```bash
# إنشاء dataset
bq mk --dataset --location=US YOUR-PROJECT-ID:smart_signal_analytics

# إنشاء الجداول المطلوبة
bq mk --table YOUR-PROJECT-ID:smart_signal_analytics.tower_metrics \
  tower_id:STRING,timestamp:TIMESTAMP,signal_strength:FLOAT,load:FLOAT,status:STRING

bq mk --table YOUR-PROJECT-ID:smart_signal_analytics.performance_metrics \
  timestamp:TIMESTAMP,cpu_usage:FLOAT,memory_usage:FLOAT,active_connections:INTEGER
```

### 5️⃣ إعداد Cloud Storage
```bash
# إنشاء bucket للتخزين
gsutil mb -l us-central1 gs://YOUR-PROJECT-ID-smart-signal-storage

# إعداد CORS للوصول من المتصفح
echo '[{"origin":["*"],"method":["GET","POST"],"responseHeader":["Content-Type"],"maxAgeSeconds":3600}]' > cors.json
gsutil cors set cors.json gs://YOUR-PROJECT-ID-smart-signal-storage
```

### 6️⃣ الحصول على Gemini API Key
1. اذهب إلى [Google AI Studio](https://aistudio.google.com/)
2. أنشئ API Key جديد
3. احفظ المفتاح لاستخدامه في التكوين

---

## 📦 تثبيت المشروع

### 1️⃣ نسخ المشروع
```bash
git clone https://github.com/YOUR-USERNAME/smart_signal_project.git
cd smart_signal_project/smart-signal-ai-mvp
```

### 2️⃣ إعداد البيئة الافتراضية
```bash
# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة (Windows)
venv\Scripts\activate

# تفعيل البيئة (Linux/Mac)
source venv/bin/activate
```

### 3️⃣ تثبيت Dependencies
```bash
# تثبيت حزم Python
pip install -r backend/requirements.txt

# تثبيت حزم Frontend (اختياري)
cd frontend
npm install
cd ..
```

---

## ⚙️ التكوين

### 1️⃣ إنشاء ملف البيئة
```bash
# نسخ ملف الإعدادات
cp config.env.example .env
```

### 2️⃣ تحرير ملف .env
افتح ملف `.env` وملأ المعلومات التالية:

```env
# إعدادات Google Cloud الأساسية
GOOGLE_CLOUD_PROJECT=YOUR-PROJECT-ID
GEMINI_API_KEY=YOUR-GEMINI-API-KEY
GOOGLE_API_KEY=YOUR-GEMINI-API-KEY
GOOGLE_CLOUD_LOCATION=us-central1

# إعدادات BigQuery
BQ_PROJECT=YOUR-PROJECT-ID
BQ_DATASET=smart_signal_analytics
BQ_TABLE=tower_metrics

# إعدادات Cloud Storage
STORAGE_BUCKET_NAME=YOUR-PROJECT-ID-smart-signal-storage

# إعدادات WebSocket
WEBSOCKET_PORT=8765
WEBSOCKET_HOST=0.0.0.0

# إعدادات الخادم
API_PORT=5000
DEBUG=True
```

### 3️⃣ إعداد المصادقة
```bash
# تعيين متغير بيئة للمصادقة
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"

# أو في Windows
set GOOGLE_APPLICATION_CREDENTIALS=path\to\credentials.json
```

---

## 🧪 اختبار النظام

### 1️⃣ اختبار Google Cloud Services
```bash
# تشغيل اختبار Google Cloud
python test_google_cloud.py
```

### 2️⃣ اختبار النظام الكامل
```bash
# تشغيل الاختبار الشامل
python test_complete_system.py
```

### 3️⃣ اختبار WebSocket
```bash
# اختبار WebSocket (في terminal منفصل)
python test_websocket.py
```

---

## 🏃 تشغيل المشروع

### 1️⃣ تشغيل التطوير المحلي
```bash
# تشغيل الخادم الرئيسي (مع WebSocket مدمج)
python backend/app.py
```

الخادم سيعمل على:
- **API**: http://localhost:5000
- **WebSocket**: ws://localhost:8765

### 2️⃣ تشغيل Frontend (اختياري)
```bash
cd frontend
npm run dev
```

Frontend سيعمل على: http://localhost:5173

### 3️⃣ تشغيل WebSocket منفصل (اختياري)
```bash
# إذا كنت تريد WebSocket منفصل
python backend/websocket_server.py
```

---

## 🌍 النشر السحابي

### 1️⃣ تحضير النشر
```bash
# جعل سكريپت النشر قابل للتنفيذ
chmod +x deploy.sh
```

### 2️⃣ تحديث إعدادات النشر
افتح `deploy.sh` وحدث المتغيرات:
```bash
PROJECT_ID="YOUR-PROJECT-ID"
REGION="us-central1"
SERVICE_NAME="smartsignal-ai"
```

### 3️⃣ النشر التلقائي
```bash
# تشغيل النشر
./deploy.sh
```

### 4️⃣ النشر اليدوي
```bash
# بناء Docker image
docker build -t gcr.io/YOUR-PROJECT-ID/smartsignal-ai .

# رفع الصورة
docker push gcr.io/YOUR-PROJECT-ID/smartsignal-ai

# النشر على Cloud Run
gcloud run deploy smartsignal-ai \
  --image gcr.io/YOUR-PROJECT-ID/smartsignal-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000
```

---

## 🔍 استكشاف الأخطاء

### ❌ مشاكل شائعة وحلولها

#### 1️⃣ خطأ المصادقة مع Google Cloud
```
ERROR: Authentication failed
```

**الحل:**
```bash
# تأكد من تسجيل الدخول
gcloud auth application-default login

# أو تعيين متغير البيئة
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
```

#### 2️⃣ خطأ في BigQuery
```
ERROR: Table not found
```

**الحل:**
```bash
# إنشاء الجداول المطلوبة
bq mk --table YOUR-PROJECT-ID:smart_signal_analytics.tower_metrics \
  tower_id:STRING,timestamp:TIMESTAMP,signal_strength:FLOAT
```

#### 3️⃣ خطأ في WebSocket
```
ERROR: Connection refused on port 8765
```

**الحل:**
```bash
# تأكد من عدم استخدام المنفذ
netstat -an | grep 8765

# غيّر المنفذ في .env إذا لزم الأمر
WEBSOCKET_PORT=8766
```

#### 4️⃣ خطأ في Dependencies
```
ERROR: Module not found
```

**الحل:**
```bash
# إعادة تثبيت الحزم
pip install -r backend/requirements.txt --upgrade
```

#### 5️⃣ خطأ Gemini API
```
ERROR: API key invalid
```

**الحل:**
1. تأكد من صحة Gemini API Key
2. تأكد من تفعيل Generative Language API
3. تحقق من حدود الاستخدام

### 🔧 أدوات التشخيص

#### فحص حالة الخدمات
```bash
# فحص Google Cloud APIs
gcloud services list --enabled

# فحص BigQuery
bq ls YOUR-PROJECT-ID:smart_signal_analytics

# فحص Cloud Storage
gsutil ls gs://YOUR-PROJECT-ID-smart-signal-storage
```

#### مراقبة السجلات
```bash
# سجلات التطبيق
tail -f app.log

# سجلات Cloud Run
gcloud logs tail --service=smartsignal-ai
```

---

## 📊 مراقبة الأداء

### 1️⃣ Dashboard محلي
- **صحة النظام**: http://localhost:5000/api/health
- **إحصائيات الأداء**: http://localhost:5000/api/performance/system-stats
- **حالة WebSocket**: WebSocket على المنفذ 8765

### 2️⃣ مراقبة Google Cloud
- **Cloud Run Metrics**: في Google Cloud Console
- **BigQuery Jobs**: لمراقبة الاستعلامات
- **Cloud Storage Usage**: لمراقبة التخزين

---

## 🎯 الخطوات التالية

### ✅ للتأكد من عمل كل شيء:

1. **تشغيل الاختبارات**:
   ```bash
   python test_google_cloud.py
   python test_complete_system.py
   ```

2. **فحص الواجهات**:
   - API: http://localhost:5000/api/health
   - WebSocket: اختبار الاتصال بـ `test_websocket.py`

3. **التحقق من Google Cloud**:
   - BigQuery: تشغيل استعلام تجريبي
   - Cloud Storage: رفع ملف تجريبي
   - Vertex AI: فحص النماذج المتاحة

4. **مراقبة السجلات**:
   - فحص رسائل النجاح/الخطأ
   - متابعة أداء WebSocket

---

## 🌟 معلومات إضافية

### 📚 الموارد المفيدة:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Vertex AI Guide](https://cloud.google.com/vertex-ai/docs)
- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)

### 📞 الدعم:
- **المشاكل التقنية**: راجع قسم استكشاف الأخطاء
- **تطوير الميزات**: راجع `DEVELOPMENT_REPORT.md`
- **WebSocket**: راجع `README_WEBSOCKET.md`

---

## 🎉 الخلاصة

بعد اتباع هذا الدليل، ستحصل على:

- ✅ **نظام SmartSignal AI كامل** للعمل محلياً
- ✅ **تكامل Google Cloud** مع جميع الخدمات
- ✅ **WebSocket Server** للتحديثات الفورية
- ✅ **نماذج ML محسنة** مع Vertex AI
- ✅ **تحليلات متقدمة** مع BigQuery
- ✅ **نشر سحابي** جاهز للإنتاج

**الآن SmartSignal AI جاهز للاستخدام! 🚀**
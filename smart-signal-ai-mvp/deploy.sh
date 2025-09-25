# سكريبت النشر على Google Cloud Run

#!/bin/bash

# متغيرات المشروع
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME="smartsignal-backend"
POLICY_ENGINE_SERVICE="smartsignal-policy-engine"

echo "🚀 بدء نشر SmartSignal AI على Google Cloud Run..."

# التحقق من تسجيل الدخول لـ Google Cloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 > /dev/null; then
    echo "❌ يرجى تسجيل الدخول أولاً: gcloud auth login"
    exit 1
fi

# تعيين المشروع
echo "📋 تعيين مشروع Google Cloud: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# تفعيل الخدمات المطلوبة
echo "🔧 تفعيل خدمات Google Cloud..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable bigquery.googleapis.com
gcloud services enable storage.googleapis.com

# بناء ونشر Backend الرئيسي
echo "🔨 بناء Backend الرئيسي..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/smartsignal-backend .

echo "📦 نشر Backend على Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/smartsignal-backend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --port 8080 \
    --max-instances 10 \
    --min-instances 1 \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=$PROJECT_ID,DEBUG=false,FLASK_ENV=production"

# بناء ونشر Policy Engine
echo "🔨 بناء Policy Engine..."
cd policy_engine
gcloud builds submit --tag gcr.io/$PROJECT_ID/smartsignal-policy-engine .

echo "📦 نشر Policy Engine على Cloud Run..."
gcloud run deploy $POLICY_ENGINE_SERVICE \
    --image gcr.io/$PROJECT_ID/smartsignal-policy-engine \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --port 8081 \
    --max-instances 5 \
    --min-instances 1 \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

# الحصول على URLs الخدمات
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")
POLICY_ENGINE_URL=$(gcloud run services describe $POLICY_ENGINE_SERVICE --region $REGION --format="value(status.url)")

echo "✅ تم النشر بنجاح!"
echo "🌐 Backend URL: $BACKEND_URL"
echo "🔧 Policy Engine URL: $POLICY_ENGINE_URL"
echo ""
echo "📝 ملاحظات مهمة:"
echo "1. تأكد من تعيين متغيرات البيئة المناسبة"
echo "2. قم بإعداد قاعدة البيانات BigQuery"
echo "3. تأكد من إعداد Cloud Storage bucket"
echo "4. اختبر الخدمات باستخدام: curl $BACKEND_URL/api/health"
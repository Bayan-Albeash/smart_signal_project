# Dockerfile للـ Policy Engine
FROM python:3.9-slim

# تعيين متغيرات البيئة
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8081

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملف المتطلبات
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ كود Policy Engine
COPY . .

# فتح المنفذ
EXPOSE 8081

# تشغيل Policy Engine
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
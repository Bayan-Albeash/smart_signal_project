# استخدام Python 3.9 slim كصورة أساسية
FROM python:3.9-slim

# تعيين متغيرات البيئة
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8080

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملف المتطلبات وتثبيتها
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ كود التطبيق
COPY . .

# إنشاء مجلد للملفات المؤقتة
RUN mkdir -p /tmp

# تعيين الأذونات
RUN chmod +x /app

# فتح المنفذ
EXPOSE 8080

# تشغيل التطبيق
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
# إنشاء البيئة الافتراضية للباك إند
python -m venv backend\venv

# تفعيل البيئة الافتراضية
backend\venv\Scripts\activate

# تثبيت المكتبات من الملف الأصلي
pip install -r backend\requirements.txt

echo "✅ Backend environment ready!"
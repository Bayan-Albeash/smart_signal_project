#!/usr/bin/env python3
"""
اختبار سريع للتأكد من أن SmartSignal AI يعمل بشكل صحيح
Quick verification script for SmartSignal AI functionality
"""

import os
import sys
import asyncio
import logging
from datetime import datetime

# إعداد السجلات
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class QuickVerifier:
    """فئة التحقق السريع"""
    
    def __init__(self):
        """تهيئة المحقق"""
        self.checks_passed = 0
        self.checks_total = 0
        
        print("🔍 التحقق السريع من SmartSignal AI")
        print("=" * 50)
    
    def check_files(self):
        """فحص الملفات الأساسية"""
        print("\n📁 فحص الملفات الأساسية...")
        
        essential_files = [
            'backend/app.py',
            'backend/websocket_server.py', 
            'backend/requirements.txt',
            'config.env.example',
            'SETUP_GUIDE.md'
        ]
        
        self.checks_total += len(essential_files)
        
        for file_path in essential_files:
            if os.path.exists(file_path):
                print(f"  ✅ {file_path}")
                self.checks_passed += 1
            else:
                print(f"  ❌ {file_path} - مفقود!")
    
    def check_environment(self):
        """فحص متغيرات البيئة"""
        print("\n⚙️ فحص متغيرات البيئة...")
        
        # محاولة تحميل .env
        env_file_exists = os.path.exists('.env')
        example_exists = os.path.exists('config.env.example')
        
        self.checks_total += 2
        
        if example_exists:
            print("  ✅ config.env.example موجود")
            self.checks_passed += 1
        else:
            print("  ❌ config.env.example مفقود!")
        
        if env_file_exists:
            print("  ✅ .env موجود")
            self.checks_passed += 1
        else:
            print("  ⚠️  .env غير موجود - انسخ من config.env.example")
        
        # فحص متغيرات مهمة
        important_vars = [
            'GOOGLE_CLOUD_PROJECT',
            'GEMINI_API_KEY'
        ]
        
        self.checks_total += len(important_vars)
        
        for var in important_vars:
            if os.getenv(var):
                print(f"  ✅ {var} محدد")
                self.checks_passed += 1
            else:
                print(f"  ⚠️  {var} غير محدد")
    
    def check_python_packages(self):
        """فحص حزم Python الأساسية"""
        print("\n📦 فحص حزم Python الأساسية...")
        
        essential_packages = [
            ('flask', 'Flask'),
            ('google.cloud.bigquery', 'BigQuery'),
            ('google.cloud.aiplatform', 'Vertex AI'),
            ('google.cloud.storage', 'Cloud Storage'),
            ('websockets', 'WebSocket'),
            ('xgboost', 'XGBoost')
        ]
        
        self.checks_total += len(essential_packages)
        
        for package, name in essential_packages:
            try:
                __import__(package)
                print(f"  ✅ {name}")
                self.checks_passed += 1
            except ImportError:
                print(f"  ❌ {name} - غير مثبت!")
    
    def check_app_startup(self):
        """فحص إمكانية تشغيل التطبيق"""
        print("\n🔥 فحص إمكانية تشغيل التطبيق...")
        
        self.checks_total += 1
        
        try:
            # محاولة استيراد التطبيق الرئيسي
            sys.path.append('backend')
            import app
            
            print("  ✅ التطبيق الرئيسي يمكن تحميله")
            self.checks_passed += 1
            
        except Exception as e:
            print(f"  ❌ مشكلة في التطبيق الرئيسي: {str(e)[:100]}")
    
    def check_websocket_server(self):
        """فحص خادم WebSocket"""
        print("\n📡 فحص خادم WebSocket...")
        
        self.checks_total += 1
        
        try:
            sys.path.append('backend')
            from websocket_server import WebSocketManager
            
            manager = WebSocketManager()
            
            if hasattr(manager, 'active_connections'):
                print("  ✅ خادم WebSocket جاهز")
                self.checks_passed += 1
            else:
                print("  ❌ خادم WebSocket: مشكلة في التهيئة")
                
        except Exception as e:
            print(f"  ❌ مشكلة في WebSocket: {str(e)[:100]}")
    
    def generate_summary(self):
        """توليد ملخص النتائج"""
        print("\n" + "=" * 50)
        print("📊 ملخص النتائج:")
        
        percentage = (self.checks_passed / self.checks_total) * 100 if self.checks_total > 0 else 0
        
        print(f"✅ نجح: {self.checks_passed}/{self.checks_total} ({percentage:.1f}%)")
        print(f"❌ فشل: {self.checks_total - self.checks_passed}/{self.checks_total}")
        
        if percentage >= 90:
            print("\n🎉 ممتاز! المشروع جاهز للتشغيل")
            return True
        elif percentage >= 70:
            print("\n⚠️ جيد - هناك بعض المشاكل البسيطة")
            return False
        else:
            print("\n❌ يحتاج إلى إصلاحات قبل التشغيل")
            return False
    
    def show_next_steps(self):
        """عرض الخطوات التالية"""
        print("\n🎯 الخطوات التالية:")
        
        if not os.path.exists('.env'):
            print("1. انسخ config.env.example إلى .env:")
            print("   cp config.env.example .env")
        
        if not os.getenv('GOOGLE_CLOUD_PROJECT'):
            print("2. حدد Google Cloud Project في .env:")
            print("   GOOGLE_CLOUD_PROJECT=your-project-id")
        
        print("\n3. لتثبيت المكتبات المفقودة:")
        print("   pip install -r backend/requirements.txt")
        
        print("\n4. لاختبار شامل:")
        print("   python test_complete_system.py")
        
        print("\n5. لاختبار Google Cloud:")
        print("   python test_google_cloud.py")
        
        print("\n6. لتشغيل المشروع:")
        print("   python backend/app.py")
        
        print("\n📖 للمزيد من التفاصيل، راجع SETUP_GUIDE.md")

def main():
    """الدالة الرئيسية"""
    verifier = QuickVerifier()
    
    # تشغيل الفحوصات
    verifier.check_files()
    verifier.check_environment()
    verifier.check_python_packages() 
    verifier.check_app_startup()
    verifier.check_websocket_server()
    
    # توليد الملخص
    success = verifier.generate_summary()
    
    # عرض الخطوات التالية
    verifier.show_next_steps()
    
    return success

if __name__ == "__main__":
    success = main()
    print(f"\n⏰ انتهى الفحص في: {datetime.now().strftime('%H:%M:%S')}")
    sys.exit(0 if success else 1)
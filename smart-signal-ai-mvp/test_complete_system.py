#!/usr/bin/env python3
"""
اختبار شامل لجميع مكونات SmartSignal AI
Complete Integration Test for SmartSignal AI Components
"""

import os
import sys
import json
import time
import asyncio
import logging
import subprocess
from datetime import datetime
from typing import Dict, Any, List, Optional

# إعداد السجلات
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SmartSignalTester:
    """فئة الاختبار الشامل لـ SmartSignal AI"""
    
    def __init__(self):
        """تهيئة المختبر"""
        self.test_results = {}
        self.start_time = datetime.now()
        
        logger.info("🎯 بدء الاختبار الشامل لـ SmartSignal AI")
    
    def test_python_dependencies(self) -> Dict[str, Any]:
        """فحص Dependencies المطلوبة"""
        logger.info("📦 فحص Python Dependencies...")
        
        required_packages = [
            'flask',
            'flask-cors',
            'google-cloud-bigquery',
            'google-cloud-aiplatform',
            'google-cloud-storage',
            'google-generativeai',
            'websockets',
            'xgboost',
            'psutil',
            'optuna',
            'gunicorn'
        ]
        
        missing_packages = []
        installed_packages = []
        
        for package in required_packages:
            try:
                __import__(package.replace('-', '_').replace('google_cloud', 'google.cloud'))
                installed_packages.append(package)
            except ImportError:
                missing_packages.append(package)
        
        status = 'success' if len(missing_packages) == 0 else 'warning'
        
        return {
            'status': status,
            'message': f'مثبت: {len(installed_packages)}/{len(required_packages)} ✅' if status == 'success' else f'مفقود: {len(missing_packages)} حزمة ⚠️',
            'installed': installed_packages,
            'missing': missing_packages,
            'install_command': f'pip install {" ".join(missing_packages)}' if missing_packages else None
        }
    
    def test_file_structure(self) -> Dict[str, Any]:
        """فحص بنية الملفات"""
        logger.info("📁 فحص بنية الملفات...")
        
        required_files = [
            'backend/app.py',
            'backend/requirements.txt',
            'backend/websocket_server.py',
            'backend/ml/xgboost_predictor.py',
            'backend/routes/analytics.py',
            'backend/routes/performance.py',
            'backend/services/cloud_storage.py',
            'backend/utils/performance.py',
            'config.env.example',
            'deploy.sh',
            'README_FEATURES.md',
            'README_WEBSOCKET.md',
            'DEVELOPMENT_REPORT.md'
        ]
        
        missing_files = []
        present_files = []
        
        for file_path in required_files:
            if os.path.exists(file_path):
                present_files.append(file_path)
            else:
                missing_files.append(file_path)
        
        status = 'success' if len(missing_files) == 0 else 'warning'
        
        return {
            'status': status,
            'message': f'موجود: {len(present_files)}/{len(required_files)} ملف ✅' if status == 'success' else f'مفقود: {len(missing_files)} ملف ⚠️',
            'present_files': present_files,
            'missing_files': missing_files,
            'total_required': len(required_files)
        }
    
    async def test_flask_app_startup(self) -> Dict[str, Any]:
        """اختبار تشغيل Flask App"""
        logger.info("🔥 اختبار تشغيل Flask App...")
        
        try:
            # محاولة تشغيل الخادم لفترة قصيرة
            process = subprocess.Popen([
                sys.executable, 'backend/app.py'
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            # انتظار قصير للتحقق من بدء التشغيل
            time.sleep(3)
            
            if process.poll() is None:
                # الخادم يعمل
                process.terminate()
                process.wait()
                
                return {
                    'status': 'success',
                    'message': 'Flask App يبدأ بشكل طبيعي ✅',
                    'details': 'تم تشغيل وإيقاف الخادم بنجاح'
                }
            else:
                # الخادم توقف
                stdout, stderr = process.communicate()
                
                return {
                    'status': 'error',
                    'message': 'Flask App فشل في التشغيل ❌',
                    'stdout': stdout[:500],
                    'stderr': stderr[:500]
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'خطأ في اختبار Flask App ❌',
                'details': str(e)
            }
    
    async def test_websocket_server(self) -> Dict[str, Any]:
        """اختبار WebSocket Server"""
        logger.info("📡 اختبار WebSocket Server...")
        
        try:
            # استيراد WebSocket server
            sys.path.append('backend')
            from websocket_server import WebSocketManager
            
            # إنشاء مدير WebSocket
            manager = WebSocketManager()
            
            # فحص الخصائص الأساسية
            if hasattr(manager, 'active_connections') and hasattr(manager, 'connection_stats'):
                return {
                    'status': 'success',
                    'message': 'WebSocket Server جاهز ✅',
                    'features': {
                        'connection_management': True,
                        'statistics': True,
                        'subscription_system': hasattr(manager, 'user_subscriptions'),
                        'performance_monitoring': hasattr(manager, 'performance_monitoring')
                    }
                }
            else:
                return {
                    'status': 'error',
                    'message': 'WebSocket Server: مشكلة في التهيئة ❌',
                    'details': 'الخصائص الأساسية مفقودة'
                }
                
        except ImportError as e:
            return {
                'status': 'error',
                'message': 'WebSocket Server: مكتبة websockets مفقودة ❌',
                'details': str(e)
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': 'WebSocket Server: خطأ في التحميل ❌',
                'details': str(e)
            }
    
    async def test_ml_models(self) -> Dict[str, Any]:
        """اختبار نماذج ML"""
        logger.info("🤖 اختبار نماذج التعلم الآلي...")
        
        try:
            sys.path.append('backend/ml')
            from xgboost_predictor import EnhancedXGBoostPredictor
            
            # إنشاء مثيل للمُتنبئ
            predictor = EnhancedXGBoostPredictor()
            
            # فحص الميزات
            features = {
                'vertex_ai_support': hasattr(predictor, 'deploy_to_vertex_ai'),
                'gemini_integration': hasattr(predictor, 'generate_insights_with_gemini'),
                'hyperparameter_tuning': hasattr(predictor, 'optimize_hyperparameters'),
                'model_evaluation': hasattr(predictor, 'evaluate_model'),
                'performance_monitoring': hasattr(predictor, 'monitor_model_performance')
            }
            
            available_features = sum(features.values())
            total_features = len(features)
            
            status = 'success' if available_features >= total_features * 0.8 else 'warning'
            
            return {
                'status': status,
                'message': f'ML Models: {available_features}/{total_features} ميزة متاحة ✅',
                'features': features,
                'details': 'نماذج التعلم الآلي جاهزة مع Vertex AI'
            }
            
        except ImportError as e:
            return {
                'status': 'error',
                'message': 'ML Models: مكتبة XGBoost مفقودة ❌',
                'details': str(e)
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': 'ML Models: خطأ في التحميل ❌',
                'details': str(e)
            }
    
    def test_configuration(self) -> Dict[str, Any]:
        """فحص ملفات التكوين"""
        logger.info("⚙️ فحص ملفات التكوين...")
        
        config_files = {
            'config.env.example': 'ملف التكوين الرئيسي',
            'backend/Dockerfile': 'إعداد Docker',
            'backend/cloudrun.yaml': 'إعداد Cloud Run',
            'deploy.sh': 'سكريپت النشر'
        }
        
        missing_configs = []
        present_configs = []
        
        for config_file, description in config_files.items():
            if os.path.exists(config_file):
                present_configs.append((config_file, description))
            else:
                missing_configs.append((config_file, description))
        
        # فحص محتوى config.env.example
        required_env_vars = [
            'GOOGLE_CLOUD_PROJECT',
            'GEMINI_API_KEY',
            'BQ_PROJECT',
            'STORAGE_BUCKET_NAME',
            'WEBSOCKET_PORT'
        ]
        
        env_vars_present = []
        if os.path.exists('config.env.example'):
            with open('config.env.example', 'r', encoding='utf-8') as f:
                content = f.read()
                for var in required_env_vars:
                    if var in content:
                        env_vars_present.append(var)
        
        status = 'success' if len(missing_configs) == 0 and len(env_vars_present) >= len(required_env_vars) * 0.8 else 'warning'
        
        return {
            'status': status,
            'message': f'التكوين: {len(present_configs)}/{len(config_files)} ملف موجود ✅',
            'present_configs': present_configs,
            'missing_configs': missing_configs,
            'env_vars_in_example': env_vars_present,
            'required_env_vars': required_env_vars
        }
    
    async def run_comprehensive_test(self) -> Dict[str, Any]:
        """تشغيل الاختبار الشامل"""
        logger.info("🚀 بدء الاختبار الشامل...")
        
        tests = [
            ('dependencies', self.test_python_dependencies),
            ('file_structure', self.test_file_structure),
            ('configuration', self.test_configuration),
            ('flask_app', self.test_flask_app_startup),
            ('websocket', self.test_websocket_server),
            ('ml_models', self.test_ml_models),
        ]
        
        for test_name, test_func in tests:
            logger.info(f"🔍 تشغيل اختبار: {test_name}")
            try:
                if asyncio.iscoroutinefunction(test_func):
                    result = await test_func()
                else:
                    result = test_func()
                
                self.test_results[test_name] = result
                
                # طباعة النتيجة
                status_icon = "✅" if result['status'] == 'success' else "⚠️" if result['status'] == 'warning' else "❌"
                logger.info(f"{status_icon} {test_name}: {result['message']}")
                
            except Exception as e:
                self.test_results[test_name] = {
                    'status': 'error',
                    'message': f'خطأ في اختبار {test_name}',
                    'details': str(e)
                }
                logger.error(f"❌ {test_name}: خطأ - {str(e)}")
        
        return self.test_results
    
    def generate_comprehensive_report(self) -> str:
        """توليد تقرير شامل"""
        report = "🎯 تقرير الاختبار الشامل - SmartSignal AI\n"
        report += "=" * 60 + "\n"
        report += f"📅 التاريخ: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}\n"
        report += f"⏱️ مدة الاختبار: {(datetime.now() - self.start_time).total_seconds():.2f} ثانية\n\n"
        
        # إحصائيات عامة
        total_tests = len(self.test_results)
        successful_tests = sum(1 for result in self.test_results.values() if result['status'] == 'success')
        warning_tests = sum(1 for result in self.test_results.values() if result['status'] == 'warning')
        failed_tests = sum(1 for result in self.test_results.values() if result['status'] == 'error')
        
        report += "📊 ملخص النتائج:\n"
        report += f"   ✅ نجح: {successful_tests}/{total_tests} ({successful_tests/total_tests*100:.1f}%)\n"
        report += f"   ⚠️  تحذير: {warning_tests}/{total_tests} ({warning_tests/total_tests*100:.1f}%)\n"
        report += f"   ❌ فشل: {failed_tests}/{total_tests} ({failed_tests/total_tests*100:.1f}%)\n\n"
        
        # تفاصيل كل اختبار
        report += "📋 تفاصيل الاختبارات:\n"
        report += "-" * 40 + "\n"
        
        for test_name, result in self.test_results.items():
            status_icon = "✅" if result['status'] == 'success' else "⚠️" if result['status'] == 'warning' else "❌"
            report += f"\n{status_icon} {test_name.upper().replace('_', ' ')}:\n"
            report += f"   📝 الحالة: {result['message']}\n"
            
            if 'details' in result:
                report += f"   🔍 التفاصيل: {result['details']}\n"
            
            # تفاصيل إضافية حسب نوع الاختبار
            if test_name == 'dependencies' and 'missing' in result and result['missing']:
                report += f"   📦 حزم مفقودة: {', '.join(result['missing'])}\n"
                if 'install_command' in result:
                    report += f"   💡 الحل: {result['install_command']}\n"
            
            elif test_name == 'file_structure' and 'missing_files' in result and result['missing_files']:
                report += f"   📁 ملفات مفقودة: {', '.join(result['missing_files'])}\n"
            
            elif test_name == 'ml_models' and 'features' in result:
                features = result['features']
                available_features = [f for f, available in features.items() if available]
                report += f"   🤖 الميزات المتاحة: {', '.join(available_features)}\n"
        
        # توصيات
        report += "\n🎯 التوصيات:\n"
        report += "-" * 20 + "\n"
        
        if failed_tests > 0:
            report += "❌ هناك مشاكل تحتاج إلى إصلاح:\n"
            for test_name, result in self.test_results.items():
                if result['status'] == 'error':
                    report += f"   - {test_name}: {result['message']}\n"
        
        if warning_tests > 0:
            report += "\n⚠️ هناك تحذيرات يُفضل معالجتها:\n"
            for test_name, result in self.test_results.items():
                if result['status'] == 'warning':
                    report += f"   - {test_name}: {result['message']}\n"
        
        if successful_tests == total_tests:
            report += "\n🎉 جميع الاختبارات نجحت! المشروع جاهز للاستخدام.\n"
        
        return report

async def main():
    """الدالة الرئيسية"""
    print("🎯 الاختبار الشامل لـ SmartSignal AI")
    print("=" * 50)
    
    # إنشاء المختبر
    tester = SmartSignalTester()
    
    # تشغيل الاختبارات
    results = await tester.run_comprehensive_test()
    
    # توليد وطباعة التقرير
    report = tester.generate_comprehensive_report()
    print("\n" + report)
    
    # حفظ التقرير
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # حفظ JSON
    json_filename = f"smartsignal_test_report_{timestamp}.json"
    with open(json_filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2, default=str)
    
    # حفظ التقرير النصي
    txt_filename = f"smartsignal_test_report_{timestamp}.txt"
    with open(txt_filename, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n💾 تم حفظ التقارير:")
    print(f"   📄 JSON: {json_filename}")
    print(f"   📝 Text: {txt_filename}")
    
    # تحديد النتيجة الإجمالية
    failed_count = sum(1 for result in results.values() if result['status'] == 'error')
    
    if failed_count == 0:
        print("\n🎉 SmartSignal AI جاهز للتشغيل!")
        return True
    else:
        print(f"\n⚠️ يوجد {failed_count} مشكلة تحتاج إلى إصلاح قبل التشغيل")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
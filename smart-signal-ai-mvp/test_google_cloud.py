#!/usr/bin/env python3
"""
اختبار شامل لخدمات Google Cloud - SmartSignal AI
Google Cloud Services Integration Test
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import asyncio

# إعداد السجلات
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GoogleCloudTester:
    """فئة اختبار خدمات Google Cloud"""
    
    def __init__(self):
        """تهيئة المختبر"""
        self.test_results = {}
        self.project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
        self.location = os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')
        
        logger.info("🧪 بدء اختبار خدمات Google Cloud")
        logger.info(f"📋 معرف المشروع: {self.project_id}")
        logger.info(f"📍 الموقع: {self.location}")
    
    async def test_bigquery_connection(self) -> Dict[str, Any]:
        """اختبار اتصال BigQuery"""
        logger.info("📊 اختبار BigQuery...")
        
        try:
            from google.cloud import bigquery
            from google.cloud.exceptions import NotFound
            
            # إنشاء عميل BigQuery
            client = bigquery.Client(project=self.project_id)
            
            # اختبار الاستعلام البسيط
            query = """
                SELECT 
                    CURRENT_TIMESTAMP() as test_time,
                    'SmartSignal AI BigQuery Test' as message,
                    @@project_id as project_id
            """
            
            job = client.query(query)
            results = list(job.result())
            
            if results:
                result = results[0]
                return {
                    'status': 'success',
                    'message': 'BigQuery يعمل بشكل طبيعي ✅',
                    'test_time': str(result.test_time),
                    'project_id': result.project_id,
                    'details': 'تم تنفيذ الاستعلام بنجاح'
                }
            else:
                return {
                    'status': 'error',
                    'message': 'BigQuery: لا توجد نتائج ❌',
                    'details': 'الاستعلام لم يرجع بيانات'
                }
                
        except ImportError:
            return {
                'status': 'error',
                'message': 'BigQuery: مكتبة غير مثبتة ❌',
                'details': 'pip install google-cloud-bigquery'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'BigQuery: خطأ في الاتصال ❌',
                'details': str(e)
            }
    
    async def test_vertex_ai_connection(self) -> Dict[str, Any]:
        """اختبار اتصال Vertex AI"""
        logger.info("🤖 اختبار Vertex AI...")
        
        try:
            from google.cloud import aiplatform
            
            # تهيئة Vertex AI
            aiplatform.init(
                project=self.project_id,
                location=self.location
            )
            
            # اختبار قائمة النماذج
            models = aiplatform.Model.list()
            model_count = len(list(models))
            
            return {
                'status': 'success',
                'message': 'Vertex AI يعمل بشكل طبيعي ✅',
                'model_count': model_count,
                'project_id': self.project_id,
                'location': self.location,
                'details': f'تم العثور على {model_count} نموذج'
            }
            
        except ImportError:
            return {
                'status': 'error',
                'message': 'Vertex AI: مكتبة غير مثبتة ❌',
                'details': 'pip install google-cloud-aiplatform'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Vertex AI: خطأ في الاتصال ❌',
                'details': str(e)
            }
    
    async def test_cloud_storage_connection(self) -> Dict[str, Any]:
        """اختبار اتصال Cloud Storage"""
        logger.info("☁️ اختبار Cloud Storage...")
        
        try:
            from google.cloud import storage
            
            # إنشاء عميل Storage
            client = storage.Client(project=self.project_id)
            
            # اختبار قائمة buckets
            buckets = list(client.list_buckets())
            bucket_count = len(buckets)
            
            bucket_names = [bucket.name for bucket in buckets[:5]]  # أول 5 فقط
            
            return {
                'status': 'success',
                'message': 'Cloud Storage يعمل بشكل طبيعي ✅',
                'bucket_count': bucket_count,
                'sample_buckets': bucket_names,
                'project_id': self.project_id,
                'details': f'تم العثور على {bucket_count} bucket'
            }
            
        except ImportError:
            return {
                'status': 'error',
                'message': 'Cloud Storage: مكتبة غير مثبتة ❌',
                'details': 'pip install google-cloud-storage'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Cloud Storage: خطأ في الاتصال ❌',
                'details': str(e)
            }
    
    async def test_gemini_ai_connection(self) -> Dict[str, Any]:
        """اختبار اتصال Gemini AI"""
        logger.info("🧠 اختبار Gemini AI...")
        
        try:
            import google.generativeai as genai
            
            api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
            if not api_key:
                return {
                    'status': 'error',
                    'message': 'Gemini AI: مفتاح API مفقود ❌',
                    'details': 'يرجى تعيين GEMINI_API_KEY في ملف .env'
                }
            
            # تكوين Gemini
            genai.configure(api_key=api_key)
            
            # اختبار النماذج المتاحة
            models = genai.list_models()
            model_names = [model.name for model in models if 'generateContent' in model.supported_generation_methods]
            
            if model_names:
                # اختبار بسيط
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content("اختبار بسيط: ما هو 2+2؟")
                
                return {
                    'status': 'success',
                    'message': 'Gemini AI يعمل بشكل طبيعي ✅',
                    'available_models': len(model_names),
                    'sample_models': model_names[:3],
                    'test_response': response.text[:100] + '...' if len(response.text) > 100 else response.text,
                    'details': 'تم تشغيل استعلام تجريبي بنجاح'
                }
            else:
                return {
                    'status': 'error',
                    'message': 'Gemini AI: لا توجد نماذج متاحة ❌',
                    'details': 'لم يتم العثور على نماذج تدعم generateContent'
                }
                
        except ImportError:
            return {
                'status': 'error',
                'message': 'Gemini AI: مكتبة غير مثبتة ❌',
                'details': 'pip install google-generativeai'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Gemini AI: خطأ في الاتصال ❌',
                'details': str(e)
            }
    
    async def test_environment_variables(self) -> Dict[str, Any]:
        """فحص متغيرات البيئة المطلوبة"""
        logger.info("🔧 فحص متغيرات البيئة...")
        
        required_vars = {
            'GOOGLE_CLOUD_PROJECT': os.getenv('GOOGLE_CLOUD_PROJECT'),
            'GEMINI_API_KEY': os.getenv('GEMINI_API_KEY'),
            'GOOGLE_API_KEY': os.getenv('GOOGLE_API_KEY'),
            'BQ_PROJECT': os.getenv('BQ_PROJECT'),
            'STORAGE_BUCKET_NAME': os.getenv('STORAGE_BUCKET_NAME'),
        }
        
        missing_vars = []
        present_vars = []
        
        for var_name, var_value in required_vars.items():
            if var_value:
                present_vars.append(var_name)
            else:
                missing_vars.append(var_name)
        
        status = 'success' if len(missing_vars) == 0 else 'warning'
        message = 'جميع متغيرات البيئة موجودة ✅' if status == 'success' else f'بعض متغيرات البيئة مفقودة ⚠️'
        
        return {
            'status': status,
            'message': message,
            'present_vars': present_vars,
            'missing_vars': missing_vars,
            'total_required': len(required_vars),
            'present_count': len(present_vars),
            'details': f'موجود: {len(present_vars)}/{len(required_vars)}'
        }
    
    async def run_all_tests(self) -> Dict[str, Any]:
        """تشغيل جميع الاختبارات"""
        logger.info("🚀 بدء الاختبار الشامل...")
        
        # فحص متغيرات البيئة أولاً
        env_result = await self.test_environment_variables()
        self.test_results['environment'] = env_result
        
        # اختبار الخدمات
        tests = [
            ('bigquery', self.test_bigquery_connection),
            ('vertex_ai', self.test_vertex_ai_connection),
            ('cloud_storage', self.test_cloud_storage_connection),
            ('gemini_ai', self.test_gemini_ai_connection),
        ]
        
        for test_name, test_func in tests:
            try:
                result = await test_func()
                self.test_results[test_name] = result
                
                # طباعة النتيجة
                status_icon = "✅" if result['status'] == 'success' else "⚠️" if result['status'] == 'warning' else "❌"
                logger.info(f"{status_icon} {test_name}: {result['message']}")
                
            except Exception as e:
                self.test_results[test_name] = {
                    'status': 'error',
                    'message': f'خطأ في تشغيل اختبار {test_name}',
                    'details': str(e)
                }
                logger.error(f"❌ {test_name}: خطأ في الاختبار - {str(e)}")
        
        return self.test_results
    
    def generate_report(self) -> str:
        """توليد تقرير شامل"""
        report = "📋 تقرير اختبار خدمات Google Cloud\n"
        report += "=" * 50 + "\n\n"
        
        total_tests = len(self.test_results)
        successful_tests = sum(1 for result in self.test_results.values() if result['status'] == 'success')
        warning_tests = sum(1 for result in self.test_results.values() if result['status'] == 'warning')
        failed_tests = sum(1 for result in self.test_results.values() if result['status'] == 'error')
        
        report += f"📊 ملخص النتائج:\n"
        report += f"   ✅ ناجح: {successful_tests}/{total_tests}\n"
        report += f"   ⚠️  تحذير: {warning_tests}/{total_tests}\n"
        report += f"   ❌ فاشل: {failed_tests}/{total_tests}\n\n"
        
        for test_name, result in self.test_results.items():
            status_icon = "✅" if result['status'] == 'success' else "⚠️" if result['status'] == 'warning' else "❌"
            report += f"{status_icon} {test_name.upper()}:\n"
            report += f"   الرسالة: {result['message']}\n"
            if 'details' in result:
                report += f"   التفاصيل: {result['details']}\n"
            report += "\n"
        
        return report

async def main():
    """الدالة الرئيسية"""
    print("🧪 اختبار خدمات Google Cloud - SmartSignal AI")
    print("=" * 60)
    
    # تحميل متغيرات البيئة
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ تم تحميل متغيرات البيئة من .env")
    except ImportError:
        print("⚠️ مكتبة dotenv غير متوفرة - سيتم استخدام متغيرات البيئة الافتراضية")
    
    # إنشاء المختبر
    tester = GoogleCloudTester()
    
    # تشغيل الاختبارات
    results = await tester.run_all_tests()
    
    # طباعة التقرير
    print("\n" + tester.generate_report())
    
    # حفظ النتائج في ملف
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"google_cloud_test_report_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2, default=str)
    
    print(f"💾 تم حفظ التقرير التفصيلي في: {filename}")
    
    # تحديد النتيجة الإجمالية
    failed_count = sum(1 for result in results.values() if result['status'] == 'error')
    
    if failed_count == 0:
        print("\n🎉 جميع خدمات Google Cloud تعمل بشكل طبيعي!")
        return True
    else:
        print(f"\n⚠️ يوجد {failed_count} خدمة تحتاج إلى إعداد أو إصلاح")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
"""
Performance Routes - مراقبة الأداء وتحسين النظام
"""

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import time
import logging
from datetime import datetime

# استيراد أدوات الأداء
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

try:
    from utils.performance import (
        performance_cache, performance_metrics, get_performance_report,
        CompressionUtils, MemoryOptimizer, NetworkOptimizer
    )
except ImportError:
    # Fallback في حالة عدم توفر الملف
    performance_cache = None
    performance_metrics = None
    
    def get_performance_report():
        return {"error": "Performance utilities not available"}

logger = logging.getLogger(__name__)
performance_bp = Blueprint('performance', __name__)
network_optimizer = NetworkOptimizer() if 'NetworkOptimizer' in locals() else None

@performance_bp.route('/stats', methods=['GET'])
@cross_origin()
def get_performance_stats():
    """الحصول على إحصائيات الأداء"""
    try:
        start_time = time.time()
        
        # الحصول على تقرير الأداء
        report = get_performance_report()
        
        # إضافة معلومات إضافية
        report.update({
            'request_timestamp': datetime.utcnow().isoformat(),
            'response_generation_time': round(time.time() - start_time, 4),
            'system_status': 'optimal' if report.get('system_metrics', {}).get('performance_score', 0) > 80 else 'degraded'
        })
        
        # تسجيل استدعاء API
        if performance_metrics:
            performance_metrics.record_api_call(time.time() - start_time)
        
        return jsonify({
            'success': True,
            'data': report
        })
        
    except Exception as e:
        logger.error(f"❌ فشل في الحصول على إحصائيات الأداء: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@performance_bp.route('/optimize/memory', methods=['POST'])
@cross_origin()
def optimize_memory():
    """تحسين استهلاك الذاكرة"""
    try:
        start_time = time.time()
        
        # مسح الكاش القديم
        if performance_cache:
            cache_stats_before = performance_cache.stats()
            performance_cache.clear()
            cache_stats_after = performance_cache.stats()
        else:
            cache_stats_before = cache_stats_after = {"size": 0}
        
        # محاكاة تحسين الذاكرة
        import gc
        collected = gc.collect()
        
        optimization_result = {
            'cache_cleared': cache_stats_before['size'],
            'garbage_collected': collected,
            'execution_time': round(time.time() - start_time, 4),
            'status': 'completed',
            'recommendations': [
                'تم تنظيف الكاش المؤقت',
                'تم تشغيل garbage collector',
                'يُنصح بإعادة تشغيل النظام كل 24 ساعة'
            ]
        }
        
        return jsonify({
            'success': True,
            'optimization': optimization_result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ فشل في تحسين الذاكرة: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@performance_bp.route('/compress', methods=['POST'])
@cross_origin()
def compress_data():
    """ضغط البيانات لتوفير bandwidth"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'لا توجد بيانات للضغط'
            }), 400
        
        # تقدير نسبة الضغط
        if 'CompressionUtils' in locals():
            compression_stats = CompressionUtils.estimate_compression_ratio(data)
            compressed_data = CompressionUtils.compress_json(data)
            
            return jsonify({
                'success': True,
                'compression_stats': compression_stats,
                'compressed_size_kb': round(len(compressed_data) / 1024, 2),
                'recommendation': 'يُنصح باستخدام الضغط للبيانات الكبيرة' if compression_stats['space_saved_percent'] > 20 else 'الضغط قد لا يكون مفيداً لهذه البيانات'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'أدوات الضغط غير متوفرة'
            }), 500
        
    except Exception as e:
        logger.error(f"❌ فشل في ضغط البيانات: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@performance_bp.route('/network/optimize', methods=['GET'])
@cross_origin()
def optimize_network_response():
    """تحسين استجابة الشبكة"""
    try:
        start_time = time.time()
        
        # الحصول على بيانات محسنة
        if network_optimizer:
            optimized_data = network_optimizer.get_optimized_tower_updates()
        else:
            # بيانات تجريبية محسنة
            optimized_data = {
                'timestamp': int(time.time()),
                'towers': [
                    {
                        'i': i,  # استخدام أحرف قصيرة
                        'l': round(70 + i * 2.5, 1),  # load
                        'u': round(60 + i * 3, 1),    # utilization
                        's': round(90 + i, 1),        # signal
                        'st': 1                       # status
                    }
                    for i in range(1, 11)
                ]
            }
        
        response_time = time.time() - start_time
        
        # حساب توفير البيانات
        original_keys = ['id', 'current_load', 'utilization', 'signal_quality', 'status']
        optimized_keys = ['i', 'l', 'u', 's', 'st']
        
        savings_estimate = {
            'original_format_size_estimate': len(str(original_keys)) * len(optimized_data['towers']),
            'optimized_format_size': len(str(optimized_keys)) * len(optimized_data['towers']),
            'bandwidth_saved_percent': round((1 - len(''.join(optimized_keys)) / len(''.join(original_keys))) * 100, 1)
        }
        
        return jsonify({
            'success': True,
            'data': optimized_data,
            'performance': {
                'response_time_ms': round(response_time * 1000, 2),
                'data_size_kb': round(len(str(optimized_data)) / 1024, 2),
                'savings_estimate': savings_estimate
            },
            'format_guide': {
                'i': 'tower_id',
                'l': 'current_load',
                'u': 'utilization_percent',
                's': 'signal_quality',
                'st': 'status (1=active, 0=inactive)'
            }
        })
        
    except Exception as e:
        logger.error(f"❌ فشل في تحسين الشبكة: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@performance_bp.route('/benchmark', methods=['POST'])
@cross_origin()
def run_performance_benchmark():
    """تشغيل اختبار الأداء"""
    try:
        data = request.get_json()
        test_duration = data.get('duration_seconds', 10)
        test_type = data.get('type', 'general')
        
        start_time = time.time()
        benchmark_results = {
            'test_type': test_type,
            'duration_seconds': test_duration,
            'start_time': datetime.utcnow().isoformat()
        }
        
        if test_type == 'memory':
            # اختبار الذاكرة
            import random
            test_data = []
            for i in range(1000):
                test_data.append({
                    'id': i,
                    'data': [random.random() for _ in range(100)]
                })
            
            if 'MemoryOptimizer' in locals():
                optimized_data = MemoryOptimizer.batch_process_data(
                    test_data, 
                    batch_size=100
                )
                benchmark_results['memory_test'] = {
                    'original_items': len(test_data),
                    'processed_items': len(optimized_data),
                    'processing_successful': True
                }
            else:
                benchmark_results['memory_test'] = {
                    'status': 'Memory optimizer not available'
                }
        
        elif test_type == 'cache':
            # اختبار الكاش
            if performance_cache:
                # إضافة واختبار عناصر الكاش
                test_keys = [f"test_key_{i}" for i in range(100)]
                
                # تخزين البيانات
                for key in test_keys:
                    performance_cache.set(key, {'test_data': time.time()})
                
                # اختبار الاسترجاع
                cache_hits = 0
                for key in test_keys:
                    if performance_cache.get(key) is not None:
                        cache_hits += 1
                
                benchmark_results['cache_test'] = {
                    'items_stored': len(test_keys),
                    'cache_hits': cache_hits,
                    'hit_rate_percent': round(cache_hits / len(test_keys) * 100, 2),
                    'cache_stats': performance_cache.stats()
                }
            else:
                benchmark_results['cache_test'] = {
                    'status': 'Cache not available'
                }
        
        # قياس الوقت الإجمالي
        total_time = time.time() - start_time
        benchmark_results.update({
            'execution_time_seconds': round(total_time, 4),
            'end_time': datetime.utcnow().isoformat(),
            'performance_score': min(100, max(0, 100 - (total_time * 10))),  # نقاط أقل للتنفيذ البطيء
            'status': 'completed'
        })
        
        return jsonify({
            'success': True,
            'benchmark': benchmark_results
        })
        
    except Exception as e:
        logger.error(f"❌ فشل في اختبار الأداء: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@performance_bp.route('/health', methods=['GET'])
@cross_origin()
def performance_health_check():
    """فحص صحة نظام الأداء"""
    try:
        health_status = {
            'system_status': 'healthy',
            'components': {},
            'recommendations': [],
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # فحص مكونات الأداء
        health_status['components'] = {
            'cache_system': performance_cache is not None,
            'metrics_system': performance_metrics is not None,
            'compression_utils': 'CompressionUtils' in locals(),
            'memory_optimizer': 'MemoryOptimizer' in locals(),
            'network_optimizer': network_optimizer is not None
        }
        
        # تقييم الحالة العامة
        active_components = sum(health_status['components'].values())
        total_components = len(health_status['components'])
        
        if active_components == total_components:
            health_status['system_status'] = 'excellent'
            health_status['performance_level'] = 100
        elif active_components >= total_components * 0.8:
            health_status['system_status'] = 'good'
            health_status['performance_level'] = 80
        elif active_components >= total_components * 0.6:
            health_status['system_status'] = 'acceptable'
            health_status['performance_level'] = 60
            health_status['recommendations'].append('بعض مكونات الأداء غير نشطة')
        else:
            health_status['system_status'] = 'degraded'
            health_status['performance_level'] = 40
            health_status['recommendations'].extend([
                'معظم مكونات الأداء غير نشطة',
                'يُنصح بإعادة تشغيل النظام'
            ])
        
        # إضافة إحصائيات الذاكرة
        try:
            import psutil
            memory_info = psutil.virtual_memory()
            health_status['memory_status'] = {
                'total_gb': round(memory_info.total / (1024**3), 2),
                'available_gb': round(memory_info.available / (1024**3), 2),
                'used_percent': memory_info.percent,
                'status': 'good' if memory_info.percent < 80 else 'warning'
            }
        except ImportError:
            health_status['memory_status'] = 'monitoring_unavailable'
        
        return jsonify({
            'success': True,
            'health': health_status
        })
        
    except Exception as e:
        logger.error(f"❌ فشل في فحص صحة الأداء: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'system_status': 'error'
        }), 500
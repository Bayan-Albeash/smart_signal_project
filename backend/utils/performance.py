"""
تحسينات الأداء لمشروع SmartSignal AI
Performance optimizations for loading speed, memory usage, and network performance
"""

import asyncio
import gzip
import json
import logging
import time
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from functools import wraps, lru_cache
from typing import Dict, List, Any, Optional
import threading
import queue

logger = logging.getLogger(__name__)

# Cache للبيانات المستخدمة بكثرة
class PerformanceCache:
    """نظام تخزين مؤقت ذكي لتحسين الأداء"""
    
    def __init__(self, max_size: int = 1000, ttl_seconds: int = 300):
        self.cache = {}
        self.timestamps = {}
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self.lock = threading.Lock()
        
    def get(self, key: str) -> Optional[Any]:
        """الحصول على قيمة من الكاش"""
        with self.lock:
            if key not in self.cache:
                return None
                
            # التحقق من انتهاء الصلاحية
            if time.time() - self.timestamps[key] > self.ttl_seconds:
                del self.cache[key]
                del self.timestamps[key]
                return None
                
            return self.cache[key]
    
    def set(self, key: str, value: Any):
        """تخزين قيمة في الكاش"""
        with self.lock:
            # إزالة العناصر القديمة إذا تم الوصول للحد الأقصى
            if len(self.cache) >= self.max_size:
                oldest_key = min(self.timestamps.keys(), key=self.timestamps.get)
                del self.cache[oldest_key]
                del self.timestamps[oldest_key]
            
            self.cache[key] = value
            self.timestamps[key] = time.time()
    
    def clear(self):
        """مسح جميع البيانات المخزنة"""
        with self.lock:
            self.cache.clear()
            self.timestamps.clear()
    
    def stats(self) -> Dict[str, int]:
        """إحصائيات الكاش"""
        with self.lock:
            return {
                'size': len(self.cache),
                'max_size': self.max_size,
                'hit_rate': getattr(self, '_hit_count', 0) / max(getattr(self, '_access_count', 1), 1)
            }

# إنشاء كاش عام
performance_cache = PerformanceCache()

def cache_result(ttl_seconds: int = 300, key_func=None):
    """ديكوريتر لتخزين نتائج الدوال مؤقتاً"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # إنشاء مفتاح فريد للكاش
            if key_func:
                cache_key = key_func(*args, **kwargs)
            else:
                cache_key = f"{func.__name__}_{hash(str(args) + str(sorted(kwargs.items())))}"
            
            # محاولة الحصول على النتيجة من الكاش
            cached_result = performance_cache.get(cache_key)
            if cached_result is not None:
                performance_cache._hit_count = getattr(performance_cache, '_hit_count', 0) + 1
                return cached_result
            
            # تنفيذ الدالة وتخزين النتيجة
            result = func(*args, **kwargs)
            performance_cache.set(cache_key, result)
            performance_cache._access_count = getattr(performance_cache, '_access_count', 0) + 1
            
            return result
        return wrapper
    return decorator

class AsyncTaskManager:
    """مدير المهام غير المتزامنة لتحسين الأداء"""
    
    def __init__(self, max_workers: int = 10):
        self.task_queue = queue.Queue()
        self.result_cache = {}
        self.workers = []
        self.max_workers = max_workers
        self.is_running = False
    
    def start(self):
        """بدء تشغيل العمال"""
        if self.is_running:
            return
            
        self.is_running = True
        for i in range(self.max_workers):
            worker = threading.Thread(target=self._worker, daemon=True)
            worker.start()
            self.workers.append(worker)
        
        logger.info(f"✅ تم بدء {self.max_workers} worker threads لمعالجة المهام")
    
    def _worker(self):
        """عامل معالجة المهام"""
        while self.is_running:
            try:
                task_id, func, args, kwargs = self.task_queue.get(timeout=1)
                
                start_time = time.time()
                result = func(*args, **kwargs)
                execution_time = time.time() - start_time
                
                self.result_cache[task_id] = {
                    'result': result,
                    'execution_time': execution_time,
                    'completed_at': time.time()
                }
                
                self.task_queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"❌ خطأ في معالجة المهمة: {e}")
    
    def submit_task(self, func, *args, **kwargs) -> str:
        """إرسال مهمة للمعالجة"""
        task_id = f"task_{int(time.time() * 1000)}_{hash(str(args) + str(kwargs))}"
        self.task_queue.put((task_id, func, args, kwargs))
        return task_id
    
    def get_result(self, task_id: str) -> Optional[Dict[str, Any]]:
        """الحصول على نتيجة مهمة"""
        return self.result_cache.get(task_id)
    
    def stop(self):
        """إيقاف العمال"""
        self.is_running = False
        logger.info("⏹️ تم إيقاف task manager")

# إنشاء مدير المهام
task_manager = AsyncTaskManager()
task_manager.start()

class CompressionUtils:
    """أدوات ضغط البيانات لتوفير bandwidth"""
    
    @staticmethod
    def compress_json(data: Dict[str, Any]) -> bytes:
        """ضغط JSON باستخدام gzip"""
        json_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
        return gzip.compress(json_str.encode('utf-8'))
    
    @staticmethod
    def decompress_json(compressed_data: bytes) -> Dict[str, Any]:
        """إلغاء ضغط JSON"""
        json_str = gzip.decompress(compressed_data).decode('utf-8')
        return json.loads(json_str)
    
    @staticmethod
    def estimate_compression_ratio(data: Dict[str, Any]) -> Dict[str, Any]:
        """تقدير نسبة الضغط"""
        original = json.dumps(data, ensure_ascii=False).encode('utf-8')
        compressed = CompressionUtils.compress_json(data)
        
        return {
            'original_size_bytes': len(original),
            'compressed_size_bytes': len(compressed),
            'compression_ratio': round(len(compressed) / len(original), 3),
            'space_saved_percent': round((1 - len(compressed) / len(original)) * 100, 1)
        }

class MemoryOptimizer:
    """مُحسن الذاكرة لتقليل استهلاك RAM"""
    
    @staticmethod
    def optimize_tower_data(towers_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """تحسين بيانات الأبراج لتوفير الذاكرة"""
        optimized_data = []
        
        for tower in towers_data:
            # إبقاء الحقول المهمة فقط
            optimized_tower = {
                'id': tower.get('id'),
                'current_load': round(tower.get('current_load', 0), 2),
                'capacity': tower.get('capacity'),
                'utilization': round(tower.get('current_load', 0) / tower.get('capacity', 1) * 100, 1),
                'location': {
                    'lat': round(tower.get('location', {}).get('lat', 0), 6),
                    'lng': round(tower.get('location', {}).get('lng', 0), 6)
                },
                'status': tower.get('status', 'active')
            }
            
            # إضافة الحقول الاختيارية فقط إذا كانت موجودة
            if 'signal_quality' in tower:
                optimized_tower['signal_quality'] = round(tower['signal_quality'], 1)
            
            if 'user_count' in tower:
                optimized_tower['user_count'] = tower['user_count']
            
            optimized_data.append(optimized_tower)
        
        return optimized_data
    
    @staticmethod
    def batch_process_data(data_list: List[Any], batch_size: int = 100, processor_func=None):
        """معالجة البيانات على دفعات لتوفير الذاكرة"""
        results = []
        
        for i in range(0, len(data_list), batch_size):
            batch = data_list[i:i + batch_size]
            
            if processor_func:
                batch_result = processor_func(batch)
                results.extend(batch_result if isinstance(batch_result, list) else [batch_result])
            else:
                results.extend(batch)
        
        return results

class NetworkOptimizer:
    """مُحسن الشبكة لتقليل زمن الاستجابة"""
    
    def __init__(self):
        self.response_cache = PerformanceCache(max_size=500, ttl_seconds=60)
    
    @cache_result(ttl_seconds=30)
    def get_optimized_tower_updates(self, tower_ids: List[int] = None) -> Dict[str, Any]:
        """الحصول على تحديثات محسنة للأبراج"""
        # محاكاة البيانات المحسنة
        if tower_ids is None:
            tower_ids = list(range(1, 11))
        
        optimized_updates = {
            'timestamp': int(time.time()),
            'towers': []
        }
        
        for tower_id in tower_ids:
            tower_update = {
                'i': tower_id,  # استخدام أحرف قصيرة لتوفير bandwidth
                'l': round(random.uniform(20, 95), 1),  # load
                'u': round(random.uniform(15, 90), 1),  # utilization
                's': round(random.uniform(85, 100), 1),  # signal quality
                'st': 1 if random.random() > 0.1 else 0  # status (1=active, 0=inactive)
            }
            optimized_updates['towers'].append(tower_update)
        
        return optimized_updates
    
    def create_delta_update(self, previous_data: Dict[str, Any], current_data: Dict[str, Any]) -> Dict[str, Any]:
        """إنشاء تحديث تدريجي يحتوي على التغييرات فقط"""
        delta = {
            'type': 'delta_update',
            'timestamp': int(time.time()),
            'changes': []
        }
        
        prev_towers = {t['i']: t for t in previous_data.get('towers', [])}
        
        for tower in current_data.get('towers', []):
            tower_id = tower['i']
            prev_tower = prev_towers.get(tower_id, {})
            
            changes = {}
            for key, value in tower.items():
                if key != 'i' and prev_tower.get(key) != value:
                    changes[key] = value
            
            if changes:
                changes['i'] = tower_id
                delta['changes'].append(changes)
        
        return delta
    
    async def stream_data_async(self, data_generator, chunk_size: int = 10):
        """بث البيانات بشكل غير متزامن"""
        chunk = []
        
        async for item in data_generator:
            chunk.append(item)
            
            if len(chunk) >= chunk_size:
                yield chunk
                chunk = []
        
        if chunk:  # إرسال الجزء الأخير
            yield chunk

def performance_monitor(func):
    """ديكوريتر لمراقبة أداء الدوال"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = get_memory_usage()
        
        try:
            result = func(*args, **kwargs)
            success = True
            error = None
        except Exception as e:
            result = None
            success = False
            error = str(e)
            raise
        finally:
            end_time = time.time()
            end_memory = get_memory_usage()
            
            performance_data = {
                'function': func.__name__,
                'execution_time': round(end_time - start_time, 4),
                'memory_delta': end_memory - start_memory,
                'success': success,
                'error': error,
                'timestamp': time.time()
            }
            
            # تسجيل الأداء للدوال البطيئة
            if performance_data['execution_time'] > 1.0:
                logger.warning(f"⚠️ الدالة {func.__name__} استغرقت {performance_data['execution_time']} ثانية")
        
        return result
    return wrapper

def get_memory_usage() -> float:
    """الحصول على استهلاك الذاكرة الحالي"""
    try:
        import psutil
        process = psutil.Process()
        return process.memory_info().rss / 1024 / 1024  # MB
    except ImportError:
        return 0.0

class PerformanceMetrics:
    """مجمع مقاييس الأداء"""
    
    def __init__(self):
        self.metrics = {
            'api_calls': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'total_response_time': 0.0,
            'memory_peak': 0.0,
            'active_connections': 0
        }
        self.start_time = time.time()
    
    def record_api_call(self, response_time: float):
        """تسجيل استدعاء API"""
        self.metrics['api_calls'] += 1
        self.metrics['total_response_time'] += response_time
    
    def record_cache_hit(self):
        """تسجيل إصابة cache"""
        self.metrics['cache_hits'] += 1
    
    def record_cache_miss(self):
        """تسجيل عدم إصابة cache"""
        self.metrics['cache_misses'] += 1
    
    def update_memory_peak(self, current_memory: float):
        """تحديث ذروة استهلاك الذاكرة"""
        if current_memory > self.metrics['memory_peak']:
            self.metrics['memory_peak'] = current_memory
    
    def get_summary(self) -> Dict[str, Any]:
        """الحصول على ملخص مقاييس الأداء"""
        uptime = time.time() - self.start_time
        
        return {
            'uptime_seconds': round(uptime, 2),
            'uptime_hours': round(uptime / 3600, 2),
            'api_calls_total': self.metrics['api_calls'],
            'api_calls_per_minute': round(self.metrics['api_calls'] / (uptime / 60), 2),
            'average_response_time': round(
                self.metrics['total_response_time'] / max(self.metrics['api_calls'], 1), 4
            ),
            'cache_hit_rate': round(
                self.metrics['cache_hits'] / max(self.metrics['cache_hits'] + self.metrics['cache_misses'], 1) * 100, 2
            ),
            'memory_peak_mb': round(self.metrics['memory_peak'], 2),
            'current_memory_mb': round(get_memory_usage(), 2),
            'active_connections': self.metrics['active_connections'],
            'performance_score': self._calculate_performance_score()
        }
    
    def _calculate_performance_score(self) -> int:
        """حساب درجة الأداء العامة (من 100)"""
        score = 100
        
        # خصم نقاط للاستجابة البطيئة
        avg_response = self.metrics['total_response_time'] / max(self.metrics['api_calls'], 1)
        if avg_response > 1.0:
            score -= 20
        elif avg_response > 0.5:
            score -= 10
        
        # خصم نقاط للذاكرة المرتفعة
        if self.metrics['memory_peak'] > 500:  # أكثر من 500 MB
            score -= 15
        elif self.metrics['memory_peak'] > 200:  # أكثر من 200 MB
            score -= 5
        
        # مكافأة للcache hit rate عالي
        cache_rate = self.metrics['cache_hits'] / max(self.metrics['cache_hits'] + self.metrics['cache_misses'], 1)
        if cache_rate > 0.8:
            score += 5
        
        return max(0, min(100, score))

# إنشاء مثيل مقاييس الأداء
performance_metrics = PerformanceMetrics()

def get_performance_report() -> Dict[str, Any]:
    """الحصول على تقرير الأداء الشامل"""
    return {
        'system_metrics': performance_metrics.get_summary(),
        'cache_stats': performance_cache.stats(),
        'compression_available': True,
        'async_processing': task_manager.is_running,
        'optimization_features': {
            'data_compression': True,
            'response_caching': True,
            'memory_optimization': True,
            'async_processing': True,
            'delta_updates': True,
            'batch_processing': True
        }
    }
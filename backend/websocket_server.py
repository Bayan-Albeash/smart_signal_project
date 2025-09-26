"""
خادم WebSocket للتحديثات الفورية والاتصالات المباشرة
Real-time WebSocket server for live updates and communications
"""

import asyncio
import json
import logging
import websockets
import time
from datetime import datetime
from typing import Dict, Set, Any
from threading import Thread
import random

logger = logging.getLogger(__name__)

class WebSocketManager:
    """مدير اتصالات WebSocket"""
    
    def __init__(self):
        self.active_connections: Set[websockets.WebSocketServerProtocol] = set()
        self.user_subscriptions: Dict[str, Set[str]] = {}
        self.tower_data_cache = {}
        self.is_running = False
        # إضافة ميزات جديدة للأداء
        self.connection_stats = {
            'total_connections': 0,
            'active_connections': 0,
            'messages_sent': 0,
            'errors_count': 0
        }
        self.performance_monitoring = True
        
    async def connect(self, websocket: websockets.WebSocketServerProtocol):
        """إضافة اتصال جديد مع تحسينات الأداء"""
        self.active_connections.add(websocket)
        self.connection_stats['total_connections'] += 1
        self.connection_stats['active_connections'] = len(self.active_connections)
        
        logger.info(f"✅ اتصال WebSocket جديد. العدد الإجمالي: {len(self.active_connections)}")
        
        # إرسال رسالة ترحيب محسنة
        await self.send_to_client(websocket, {
            "type": "connection_established",
            "message": "مرحباً! تم الاتصال بخادم SmartSignal AI المحسن",
            "timestamp": datetime.now().isoformat(),
            "client_id": id(websocket),
            "features": {
                "real_time_updates": True,
                "performance_monitoring": self.performance_monitoring,
                "arabic_support": True,
                "compression": True
            },
            "server_stats": {
                "active_connections": len(self.active_connections),
                "uptime": time.time()
            }
        })
    
    async def disconnect(self, websocket: websockets.WebSocketServerProtocol):
        """إزالة اتصال مع تحديث الإحصائيات"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.connection_stats['active_connections'] = len(self.active_connections)
            
            # إزالة اشتراكات العميل
            client_id = str(id(websocket))
            if client_id in self.user_subscriptions:
                del self.user_subscriptions[client_id]
            
            logger.info(f"❌ تم قطع اتصال WebSocket. العدد الإجمالي: {len(self.active_connections)}")
            
            # إشعار باقي العملاء بالقطع (اختياري)
            if len(self.active_connections) > 0:
                await self.broadcast({
                    "type": "client_disconnected", 
                    "active_connections": len(self.active_connections)
                })
    
    async def send_to_client(self, websocket: websockets.WebSocketServerProtocol, data: Dict[str, Any]):
        """إرسال بيانات لعميل محدد"""
        try:
            await websocket.send(json.dumps(data, ensure_ascii=False, default=str))
        except websockets.exceptions.ConnectionClosed:
            await self.disconnect(websocket)
        except Exception as e:
            logger.error(f"❌ خطأ في إرسال البيانات: {e}")
    
    async def broadcast(self, data: Dict[str, Any], subscription_type: str = None):
        """بث البيانات لجميع العملاء المتصلين مع معالجة متقدمة"""
        if not self.active_connections:
            logger.warning("📭 لا توجد اتصالات نشطة للبث")
            return 0
            
        # إضافة معلومات إضافية للرسالة
        data.update({
            "broadcast_time": datetime.now().isoformat(),
            "active_connections": len(self.active_connections),
            "server_id": self.server_id if hasattr(self, 'server_id') else "main"
        })
        
        # فلترة العملاء حسب نوع الاشتراك
        target_connections = []
        if subscription_type:
            for websocket in self.active_connections:
                client_id = str(id(websocket))
                if (client_id in self.user_subscriptions and 
                    subscription_type in self.user_subscriptions[client_id]):
                    target_connections.append(websocket)
        else:
            target_connections = self.active_connections.copy()
        
        if not target_connections:
            logger.info(f"📭 لا توجد عملاء مشتركين في {subscription_type}")
            return 0
        
        # قائمة للاتصالات المقطوعة
        disconnected_connections = []
        sent_count = 0
        
        message_json = json.dumps(data, ensure_ascii=False, indent=2)
        
        for websocket in target_connections:
            try:
                await websocket.send(message_json)
                sent_count += 1
            except websockets.exceptions.ConnectionClosedError:
                logger.warning("⚠️ اتصال مقطوع أثناء البث - سيتم إزالته")
                disconnected_connections.append(websocket)
            except Exception as e:
                logger.error(f"❌ خطأ في إرسال رسالة WebSocket: {str(e)}")
                disconnected_connections.append(websocket)
        
        # إزالة الاتصالات المقطوعة
        for websocket in disconnected_connections:
            await self.disconnect(websocket)
        
        # تحديث إحصائيات البث
        self.connection_stats['messages_sent'] += sent_count
        
        logger.info(f"📡 تم بث رسالة لـ {sent_count} عميل. النوع: {data.get('type', 'غير محدد')}")
        
        return sent_count
    
    async def handle_client_message(self, websocket: websockets.WebSocketServerProtocol, message: str):
        """معالجة رسائل العملاء مع دعم الأوامر المتقدمة"""
        try:
            data = json.loads(message)
            message_type = data.get("type", "unknown")
            client_id = str(id(websocket))
            
            logger.info(f"📨 تم استلام رسالة من العميل: {message_type}")
            
            if message_type == "subscribe":
                # الاشتراك في نوع معين من التحديثات
                subscription = data.get("subscription", "all")
                
                if client_id not in self.user_subscriptions:
                    self.user_subscriptions[client_id] = set()
                
                self.user_subscriptions[client_id].add(subscription)
                
                await self.send_to_client(websocket, {
                    "type": "subscription_confirmed",
                    "subscription": subscription,
                    "message": f"تم الاشتراك في {subscription} بنجاح",
                    "client_id": client_id
                })
                
            elif message_type == "unsubscribe":
                # إلغاء الاشتراك
                subscription = data.get("subscription")
                
                if client_id in self.user_subscriptions:
                    self.user_subscriptions[client_id].discard(subscription)
                    
                await self.send_to_client(websocket, {
                    "type": "unsubscribe_confirmed", 
                    "subscription": subscription,
                    "message": f"تم إلغاء الاشتراك في {subscription}"
                })
                
            elif message_type == "get_server_stats":
                # طلب إحصائيات الخادم
                await self.send_to_client(websocket, {
                    "type": "server_stats",
                    "stats": self.connection_stats.copy(),
                    "performance": await self.get_server_performance()
                })
                
            elif message_type == "ping":
                # فحص الاتصال
                await self.send_to_client(websocket, {
                    "type": "pong",
                    "timestamp": datetime.now().isoformat(),
                    "message": "الخادم يعمل بشكل طبيعي"
                })
                
            elif message_type == "request_data":
                # طلب بيانات معينة
                data_type = data.get("data_type", "simulation")
                await self.handle_data_request(websocket, data_type, data.get("params", {}))
                
            else:
                # رسالة غير مدعومة
                await self.send_to_client(websocket, {
                    "type": "error",
                    "message": f"نوع الرسالة غير مدعوم: {message_type}",
                    "supported_types": ["subscribe", "unsubscribe", "get_server_stats", "ping", "request_data"]
                })
            
            # تحديث إحصائية الرسائل المستلمة
            self.connection_stats['messages_received'] = self.connection_stats.get('messages_received', 0) + 1
            
        except json.JSONDecodeError:
            logger.error("❌ خطأ في تحليل JSON من العميل")
            await self.send_to_client(websocket, {
                "type": "error",
                "message": "تنسيق JSON غير صحيح"
            })
        except Exception as e:
            logger.error(f"❌ خطأ في معالجة رسالة العميل: {str(e)}")
            await self.send_to_client(websocket, {
                "type": "error", 
                "message": f"خطأ في الخادم: {str(e)}"
            })
    
    async def handle_data_request(self, websocket: websockets.WebSocketServerProtocol, data_type: str, params: dict):
        """معالجة طلبات البيانات المحددة"""
        try:
            if data_type == "simulation":
                # إرسال بيانات المحاكاة الحالية
                await self.send_simulation_update(websocket)
                
            elif data_type == "tower_data":
                # إرسال بيانات الأبراج
                await self.send_tower_data_update(websocket)
                
            elif data_type == "analytics":
                # إرسال بيانات التحليلات
                await self.send_analytics_update(websocket)
                
            else:
                await self.send_to_client(websocket, {
                    "type": "error",
                    "message": f"نوع البيانات غير مدعوم: {data_type}"
                })
                
        except Exception as e:
            logger.error(f"❌ خطأ في معالجة طلب البيانات: {str(e)}")
            await self.send_to_client(websocket, {
                "type": "error",
                "message": f"خطأ في جلب البيانات: {str(e)}"
            })
    
    async def get_server_performance(self):
        """الحصول على أداء الخادم"""
        try:
            import psutil
            return {
                "cpu_percent": psutil.cpu_percent(),
                "memory_percent": psutil.virtual_memory().percent,
                "active_connections": len(self.active_connections),
                "total_messages": self.connection_stats.get('messages_sent', 0) + self.connection_stats.get('messages_received', 0)
            }
        except ImportError:
            return {
                "active_connections": len(self.active_connections),
                "total_messages": self.connection_stats.get('messages_sent', 0) + self.connection_stats.get('messages_received', 0)
            }
    
    async def send_tower_data_update(self, websocket: websockets.WebSocketServerProtocol = None):
        """إرسال تحديث بيانات الأبراج"""
        # توليد بيانات أبراج محدثة (يمكن استبدالها ببيانات حقيقية)
        tower_data = self.generate_mock_tower_data()
        
        update_message = {
            "type": "tower_data_update",
            "data": tower_data,
            "timestamp": datetime.now().isoformat(),
            "message": "تحديث بيانات الأبراج"
        }
        
        if websocket:
            await self.send_to_client(websocket, update_message)
        else:
            await self.broadcast(update_message, "tower_updates")
    
    def generate_mock_tower_data(self):
        """توليد بيانات أبراج تجريبية"""
        towers = []
        for i in range(1, 11):
            tower = {
                "id": i,
                "name": f"برج عمان {i}",
                "location": {
                    "lat": 31.9565 + random.uniform(-0.1, 0.1),
                    "lng": 35.9239 + random.uniform(-0.1, 0.1)
                },
                "current_load": random.uniform(20, 95),
                "capacity": 200,
                "utilization": random.uniform(15, 90),
                "signal_quality": random.uniform(85, 100),
                "user_count": random.randint(50, 180),
                "status": random.choice(["active", "active", "active", "maintenance"]),
                "last_updated": datetime.now().isoformat()
            }
            towers.append(tower)
        
        return towers
    
    async def start_periodic_updates(self):
        """بدء التحديثات الدورية"""
        self.is_running = True
        logger.info("🔄 بدء التحديثات الدورية للـ WebSocket")
        
        while self.is_running:
            try:
                # إرسال تحديثات بيانات الأبراج كل 30 ثانية
                await self.send_tower_data_update()
                
                # إرسال تحديث KPIs كل دقيقة
                if int(time.time()) % 60 == 0:
                    await self.send_kpi_update()
                
                # إرسال تنبيهات عشوائية
                if random.random() < 0.1:  # 10% احتمال كل تحديث
                    await self.send_alert()
                
                await asyncio.sleep(30)  # تحديث كل 30 ثانية
                
            except Exception as e:
                logger.error(f"❌ خطأ في التحديثات الدورية: {e}")
                await asyncio.sleep(30)
    
    async def send_kpi_update(self):
        """إرسال تحديث KPIs"""
        kpi_data = {
            "network_efficiency": random.randint(85, 95),
            "tower_utilization": random.randint(70, 85),
            "signal_quality": random.uniform(90, 98),
            "active_users": random.randint(1000, 2500)
        }
        
        await self.broadcast({
            "type": "kpi_update",
            "data": kpi_data,
            "message": "تحديث مؤشرات الأداء",
            "timestamp": datetime.now().isoformat()
        }, "kpi_updates")
    
    async def send_alert(self):
        """إرسال تنبيه"""
        alerts = [
            {"level": "warning", "message": "معدل استخدام مرتفع في برج عمان 3", "tower_id": 3},
            {"level": "info", "message": "تم تحسين توزيع الأحمال بنجاح", "tower_id": None},
            {"level": "critical", "message": "انقطاع مؤقت في برج الزرقاء 2", "tower_id": 7},
        ]
        
        alert = random.choice(alerts)
        
        await self.broadcast({
            "type": "alert",
            "data": alert,
            "message": "تنبيه جديد",
            "timestamp": datetime.now().isoformat()
        }, "alerts")
    
    def stop_periodic_updates(self):
        """إيقاف التحديثات الدورية"""
        self.is_running = False
        logger.info("⏹️ تم إيقاف التحديثات الدورية")
    
    async def handle_client(self, websocket: websockets.WebSocketServerProtocol, path):
        """معالجة اتصال عميل WebSocket مع دعم شامل"""
        client_id = str(id(websocket))
        logger.info(f"🔗 عميل جديد متصل: {client_id}")
        
        # إضافة العميل للاتصالات النشطة
        await self.connect(websocket)
        
        try:
            # إرسال رسالة ترحيب
            await self.send_to_client(websocket, {
                "type": "welcome",
                "message": "مرحباً بك في SmartSignal AI! 🌟",
                "client_id": client_id,
                "server_time": datetime.now().isoformat(),
                "available_subscriptions": ["simulation", "tower_data", "analytics", "kpi", "alerts"],
                "commands": ["subscribe", "unsubscribe", "get_server_stats", "ping", "request_data"]
            })
            
            # استقبال ومعالجة الرسائل
            async for message in websocket:
                await self.handle_client_message(websocket, message)
                
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"🔌 تم إغلاق الاتصال بشكل طبيعي: {client_id}")
        except websockets.exceptions.ConnectionClosedError:
            logger.warning(f"⚠️ انقطاع اتصال مفاجئ: {client_id}")
        except Exception as e:
            logger.error(f"❌ خطأ في معالجة العميل {client_id}: {str(e)}")
        finally:
            # إزالة العميل من الاتصالات النشطة
            await self.disconnect(websocket)

# إنشاء مثيل مدير WebSocket
websocket_manager = WebSocketManager()

async def websocket_handler(websocket, path):
    """معالج اتصالات WebSocket الرئيسي"""
    await websocket_manager.handle_client(websocket, path)

def start_websocket_server(host="0.0.0.0", port=8765):
    """بدء خادم WebSocket مع إعدادات محسنة"""
    logger.info(f"🚀 بدء خادم WebSocket على {host}:{port}")
    
    async def run_server():
        try:
            # بدء الخادم مع إعدادات محسنة
            server = await websockets.serve(
                websocket_handler, 
                host, 
                port,
                ping_interval=30,  # فحص الاتصال كل 30 ثانية
                ping_timeout=10,   # مهلة فحص الاتصال 10 ثوان
                close_timeout=10   # مهلة إغلاق الاتصال 10 ثوان
            )
            
            logger.info("✅ خادم WebSocket يعمل بنجاح!")
            
            # بدء التحديثات الدورية
            asyncio.create_task(websocket_manager.start_periodic_updates())
            
            # انتظار الخادم
            await server.wait_closed()
            
        except Exception as e:
            logger.error(f"❌ خطأ في بدء خادم WebSocket: {str(e)}")
            raise
    
    # إنشاء حلقة الأحداث الجديدة
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # تشغيل الخادم
        loop.run_until_complete(run_server())
    except KeyboardInterrupt:
        logger.info("🛑 تم إيقاف خادم WebSocket بواسطة المستخدم")
    finally:
        # إيقاف التحديثات الدورية
        websocket_manager.stop_periodic_updates()
        loop.close()

def start_websocket_thread():
    """بدء WebSocket في thread منفصل"""
    websocket_thread = Thread(target=start_websocket_server, daemon=True)
    websocket_thread.start()
    logger.info("✅ تم بدء WebSocket server في thread منفصل")
    return websocket_thread

if __name__ == "__main__":
    # تشغيل مباشر للاختبار
    start_websocket_server()
#!/usr/bin/env python3
"""
اختبار WebSocket لـ SmartSignal AI
Simple WebSocket test client for SmartSignal AI
"""

import asyncio
import websockets
import json
import logging

# إعداد السجلات
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_websocket():
    """اختبار الاتصال بـ WebSocket"""
    uri = "ws://localhost:8765"
    
    try:
        logger.info(f"🔗 محاولة الاتصال بـ {uri}")
        
        async with websockets.connect(uri) as websocket:
            logger.info("✅ تم الاتصال بنجاح!")
            
            # اختبار ping
            await websocket.send(json.dumps({
                "type": "ping"
            }))
            
            # الاشتراك في تحديثات المحاكاة
            await websocket.send(json.dumps({
                "type": "subscribe",
                "subscription": "simulation"
            }))
            
            # طلب إحصائيات الخادم
            await websocket.send(json.dumps({
                "type": "get_server_stats"
            }))
            
            # استقبال الرسائل لمدة 30 ثانية
            logger.info("📨 استقبال الرسائل لمدة 30 ثانية...")
            
            timeout = 30
            start_time = asyncio.get_event_loop().time()
            
            while (asyncio.get_event_loop().time() - start_time) < timeout:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=5)
                    data = json.loads(message)
                    
                    print(f"📩 {data.get('type', 'unknown')}: {data.get('message', '')}")
                    
                    if data.get('type') == 'server_stats':
                        stats = data.get('stats', {})
                        print(f"   📊 اتصالات نشطة: {stats.get('active_connections', 0)}")
                        print(f"   📧 رسائل مرسلة: {stats.get('messages_sent', 0)}")
                        
                except asyncio.TimeoutError:
                    print("⏰ انتظار رسالة...")
                    continue
                except json.JSONDecodeError as e:
                    logger.error(f"❌ خطأ في تحليل JSON: {e}")
                
            logger.info("✅ انتهى الاختبار بنجاح!")
            
    except websockets.exceptions.ConnectionRefused:
        logger.error("❌ فشل الاتصال - تأكد من تشغيل خادم WebSocket")
    except Exception as e:
        logger.error(f"❌ خطأ في الاختبار: {e}")

if __name__ == "__main__":
    print("🧪 اختبار WebSocket لـ SmartSignal AI")
    print("=" * 50)
    print("تأكد من تشغيل الخادم أولاً:")
    print("python backend/websocket_server.py")
    print("=" * 50)
    
    asyncio.run(test_websocket())
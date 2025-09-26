# 🌐 WebSocket Server - دليل التشغيل والاستخدام

## 📋 نظرة عامة

خادم WebSocket محسن للتواصل الفوري مع دعم اللغة العربية والميزات المتقدمة لـ SmartSignal AI.

## 🚀 الميزات الرئيسية

### 🔄 التحديثات الفورية
- **بيانات المحاكاة**: تحديث كل 15 ثانية
- **بيانات الأبراج**: تحديث كل 20 ثانية  
- **مؤشرات الأداء**: تحديث كل 25 ثانية
- **التحليلات**: تحديث كل 35 ثانية
- **التنبيهات**: عند الحاجة

### 📊 مراقبة الأداء
- **معدل استخدام CPU والذاكرة**
- **عدد الاتصالات النشطة**
- **إحصائيات الرسائل المرسلة/المستلمة**
- **سجل مفصل للأحداث**

### 🎯 نظام الاشتراكات
- **simulation**: تحديثات المحاكاة
- **tower_data**: بيانات الأبراج
- **analytics**: تحليلات متقدمة
- **kpi**: مؤشرات الأداء
- **alerts**: التنبيهات

## 🛠️ الاستخدام

### 1️⃣ تشغيل الخادم

```python
from websocket_server import start_websocket_server, start_websocket_thread

# تشغيل مباشر
start_websocket_server()

# تشغيل في thread منفصل (مع Flask)
websocket_thread = start_websocket_thread()
```

### 2️⃣ الاتصال من العميل

```javascript
const ws = new WebSocket('ws://localhost:8765');

ws.onopen = function() {
    console.log('🔗 متصل بـ WebSocket');
    
    // الاشتراك في التحديثات
    ws.send(JSON.stringify({
        type: 'subscribe',
        subscription: 'simulation'
    }));
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('📨 رسالة جديدة:', data);
};
```

### 3️⃣ الأوامر المتاحة

#### 🔔 الاشتراك في التحديثات
```json
{
    "type": "subscribe",
    "subscription": "simulation"
}
```

#### ❌ إلغاء الاشتراك
```json
{
    "type": "unsubscribe", 
    "subscription": "kpi"
}
```

#### 📈 طلب إحصائيات الخادم
```json
{
    "type": "get_server_stats"
}
```

#### 🏓 فحص الاتصال
```json
{
    "type": "ping"
}
```

#### 📊 طلب بيانات محددة
```json
{
    "type": "request_data",
    "data_type": "tower_data",
    "params": {}
}
```

## 🔧 الإعدادات

### ⚙️ إعدادات الخادم
```python
websockets.serve(
    websocket_handler,
    host="0.0.0.0",
    port=8765,
    ping_interval=30,    # فحص الاتصال كل 30 ثانية
    ping_timeout=10,     # مهلة فحص الاتصال
    close_timeout=10     # مهلة إغلاق الاتصال
)
```

### 📝 سجلات النشاط
```
🚀 بدء خادم WebSocket على 0.0.0.0:8765
✅ خادم WebSocket يعمل بنجاح!
🔗 عميل جديد متصل: 140234567890123
📨 تم استلام رسالة من العميل: subscribe
📡 تم بث رسالة لـ 3 عميل. النوع: simulation_update
⚠️ انقطاع اتصال مفاجئ: 140234567890124
```

## 📦 رسائل WebSocket

### 🎉 رسالة الترحيب
```json
{
    "type": "welcome",
    "message": "مرحباً بك في SmartSignal AI! 🌟",
    "client_id": "140234567890123",
    "server_time": "2025-01-19T10:30:00",
    "available_subscriptions": ["simulation", "tower_data", "analytics", "kpi", "alerts"],
    "commands": ["subscribe", "unsubscribe", "get_server_stats", "ping", "request_data"]
}
```

### 📊 تحديث المحاكاة
```json
{
    "type": "simulation_update",
    "data": {
        "towers": [...],
        "network_stats": {...},
        "performance_metrics": {...}
    },
    "broadcast_time": "2025-01-19T10:30:15",
    "active_connections": 5
}
```

### 📈 إحصائيات الخادم
```json
{
    "type": "server_stats",
    "stats": {
        "active_connections": 5,
        "messages_sent": 1250,
        "messages_received": 89,
        "uptime_seconds": 3600
    },
    "performance": {
        "cpu_percent": 12.5,
        "memory_percent": 45.2,
        "active_connections": 5,
        "total_messages": 1339
    }
}
```

## 🔍 استكشاف الأخطاء

### ❌ مشاكل شائعة

1. **خطأ في الاتصال**
   ```
   Connection refused على المنفذ 8765
   ```
   **الحل**: تأكد من تشغيل الخادم أولاً

2. **رسائل JSON غير صحيحة**
   ```json
   {
       "type": "error",
       "message": "تنسيق JSON غير صحيح"
   }
   ```
   **الحل**: تحقق من تنسيق الرسالة

3. **اشتراك غير مدعوم**
   ```json
   {
       "type": "error", 
       "message": "نوع الرسالة غير مدعوم: unknown_type"
   }
   ```
   **الحل**: استخدم الأوامر المدعومة فقط

## 🌟 مثال كامل - React

```jsx
import React, { useEffect, useState } from 'react';

function WebSocketDemo() {
    const [ws, setWs] = useState(null);
    const [data, setData] = useState({});
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8765');
        
        websocket.onopen = () => {
            console.log('🔗 متصل بـ WebSocket');
            setConnected(true);
            setWs(websocket);
            
            // اشتراك في التحديثات
            websocket.send(JSON.stringify({
                type: 'subscribe',
                subscription: 'simulation'
            }));
        };
        
        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setData(message);
            console.log('📨 رسالة جديدة:', message);
        };
        
        websocket.onclose = () => {
            console.log('🔌 انقطع الاتصال');
            setConnected(false);
        };
        
        websocket.onerror = (error) => {
            console.error('❌ خطأ WebSocket:', error);
        };
        
        return () => {
            websocket.close();
        };
    }, []);

    const sendPing = () => {
        if (ws && connected) {
            ws.send(JSON.stringify({ type: 'ping' }));
        }
    };

    return (
        <div>
            <h2>🌐 WebSocket Status</h2>
            <p>Status: {connected ? '✅ متصل' : '❌ غير متصل'}</p>
            
            <button onClick={sendPing} disabled={!connected}>
                🏓 Ping Server
            </button>
            
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default WebSocketDemo;
```

## 🎯 الخلاصة

تم تطوير خادم WebSocket شامل يدعم:
- ✅ التحديثات الفورية باللغة العربية
- ✅ نظام اشتراكات متقدم
- ✅ مراقبة الأداء
- ✅ معالجة أخطاء شاملة
- ✅ سجلات نشاط مفصلة
- ✅ دعم العملاء المتعددين
- ✅ إدارة الاتصالات الذكية

🌟 **الآن SmartSignal AI يدعم التحديثات الفورية مع أفضل الممارسات!**
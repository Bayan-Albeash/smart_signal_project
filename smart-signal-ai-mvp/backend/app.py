"""
SmartSignal AI - Main Backend Application
Flask API server with CORS support for frontend communication
Integrated with WebSocket for real-time updates
"""

import os
import sys
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__, static_folder='../frontend/dist')
app.config['SECRET_KEY'] = 'smartsignal-ai-secret-key-2025'

# Enable CORS for all routes
CORS(app)

# Add current directory to Python path
sys.path.append(os.path.dirname(__file__))

# Import routes
from routes.simulation import simulation_bp
from routes.analytics import analytics_bp
from routes.gemini import gemini_bp
from routes.gemini_chat import gemini_chat_bp
from routes.reports import reports_bp
from routes.trc_data import trc_data_bp
from routes.cloud_storage import storage_bp
from routes.performance import performance_bp

# Register blueprints
app.register_blueprint(simulation_bp, url_prefix='/api/simulation')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(gemini_bp, url_prefix='/api/gemini')
app.register_blueprint(gemini_chat_bp, url_prefix='/api/gemini')
app.register_blueprint(reports_bp, url_prefix='/api/reports')
app.register_blueprint(trc_data_bp, url_prefix='/api/trc')
app.register_blueprint(storage_bp, url_prefix='/api/storage')
app.register_blueprint(performance_bp, url_prefix='/api/performance')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'SmartSignal AI Backend',
        'version': '1.0.0'
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve the React frontend"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "Frontend not built. Please run 'npm run build' in the frontend directory.", 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = False  # تعطيل debug mode للاستقرار
    
    # بدء WebSocket server في thread منفصل
    try:
        from websocket_server import start_websocket_thread
        websocket_thread = start_websocket_thread()
        logger.info("✅ تم بدء WebSocket server للتحديثات الفورية")
    except Exception as e:
        logger.warning(f"⚠️ فشل في بدء WebSocket server: {e}")
    
    logger.info(f"🚀 بدء خادم SmartSignal AI على المنفذ {port}")
    logger.info("📡 الخدمات المتاحة:")
    logger.info("   - REST API: http://localhost:5000/api/")
    logger.info("   - WebSocket: ws://localhost:8765")
    logger.info("   - التحديثات الفورية: مفعلة")
    logger.info("   - Google Cloud: مدمج")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
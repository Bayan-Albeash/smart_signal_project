from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime, timedelta
import random

trc_data_bp = Blueprint('trc_data', __name__)

# Load TRC data
def load_trc_data():
    """Load TRC data from JSON file"""
    try:
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'trc_data.json')
        with open(data_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading TRC data: {e}")
        return None

@trc_data_bp.route('/api/trc/towers', methods=['GET'])
def get_trc_towers():
    """Get TRC towers data"""
    try:
        trc_data = load_trc_data()
        if not trc_data:
            return jsonify({'error': 'TRC data not available'}), 500
        
        towers = trc_data.get('towers', [])
        
        return jsonify({
            'success': True,
            'towers': towers,
            'total_count': len(towers),
            'source': 'TRC Jordan Q1 2025',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@trc_data_bp.route('/api/trc/metrics', methods=['GET'])
def get_trc_metrics():
    """Get TRC network metrics"""
    try:
        trc_data = load_trc_data()
        if not trc_data:
            return jsonify({'error': 'TRC data not available'}), 500
        
        metrics = trc_data.get('network_metrics', {})
        
        return jsonify({
            'success': True,
            'metrics': metrics,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@trc_data_bp.route('/api/trc/recommendations', methods=['GET'])
def get_trc_recommendations():
    """Get TRC recommendations"""
    try:
        trc_data = load_trc_data()
        if not trc_data:
            return jsonify({'error': 'TRC data not available'}), 500
        
        recommendations = trc_data.get('recommendations', [])
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'total_count': len(recommendations),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@trc_data_bp.route('/api/trc/sample-data', methods=['GET'])
def get_trc_sample_data():
    """Get TRC sample data with optional filtering"""
    try:
        trc_data = load_trc_data()
        if not trc_data:
            return jsonify({'error': 'TRC data not available'}), 500
        
        sample_data = trc_data.get('sample_data', [])
        
        # Get query parameters
        cell_id = request.args.get('cell_id')
        start_time = request.args.get('start_time')
        end_time = request.args.get('end_time')
        limit = int(request.args.get('limit', 100))
        
        # Filter data
        filtered_data = sample_data
        
        if cell_id:
            filtered_data = [d for d in filtered_data if d.get('cell_id') == cell_id]
        
        if start_time:
            filtered_data = [d for d in filtered_data if d.get('timestamp') >= start_time]
        
        if end_time:
            filtered_data = [d for d in filtered_data if d.get('timestamp') <= end_time]
        
        # Limit results
        filtered_data = filtered_data[:limit]
        
        return jsonify({
            'success': True,
            'data': filtered_data,
            'total_count': len(filtered_data),
            'filters': {
                'cell_id': cell_id,
                'start_time': start_time,
                'end_time': end_time,
                'limit': limit
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@trc_data_bp.route('/api/trc/generate-realtime', methods=['POST'])
def generate_realtime_data():
    """Generate real-time TRC data for simulation"""
    try:
        data = request.get_json()
        duration_minutes = data.get('duration_minutes', 10)
        towers = data.get('towers', [])
        
        if not towers:
            return jsonify({'error': 'No towers provided'}), 400
        
        # Generate real-time data
        realtime_data = []
        current_time = datetime.now()
        
        for minute in range(duration_minutes):
            for tower in towers:
                # Simulate realistic data variations
                base_load = random.uniform(60, 95)
                time_factor = 1.0
                
                # Peak hours simulation (8-10 AM, 5-7 PM)
                hour = current_time.hour
                if 8 <= hour <= 10 or 17 <= hour <= 19:
                    time_factor = 1.3
                elif 22 <= hour <= 6:  # Night hours
                    time_factor = 0.7
                
                load_percentage = min(100, base_load * time_factor)
                active_users = int((load_percentage / 100) * tower.get('max_capacity', 200))
                
                # Calculate derived metrics
                rsrp = -70 - (load_percentage * 0.2) + random.uniform(-5, 5)
                sinr = 25 - (load_percentage * 0.15) + random.uniform(-3, 3)
                throughput = 60 - (load_percentage * 0.3) + random.uniform(-10, 10)
                latency = 20 + (load_percentage * 0.2) + random.uniform(-5, 5)
                
                # Handover attempts based on load
                handover_attempts = int(load_percentage / 10) + random.randint(0, 5)
                handover_failures = max(0, int(handover_attempts * (load_percentage / 100) * 0.1))
                
                realtime_data.append({
                    'cell_id': tower.get('cell_id', f"TRC_{tower.get('city', 'UNK')}_{tower.get('id', '000')}"),
                    'timestamp': (current_time + timedelta(minutes=minute)).isoformat(),
                    'load_percentage': round(load_percentage, 1),
                    'active_users': active_users,
                    'rsrp': round(rsrp, 1),
                    'sinr': round(sinr, 1),
                    'handover_attempts': handover_attempts,
                    'handover_failures': handover_failures,
                    'throughput_mbps': round(throughput, 1),
                    'latency_ms': round(latency, 1),
                    'energy_consumption': round(load_percentage * 0.9, 1)
                })
        
        return jsonify({
            'success': True,
            'data': realtime_data,
            'total_records': len(realtime_data),
            'duration_minutes': duration_minutes,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@trc_data_bp.route('/api/trc/analytics', methods=['GET'])
def get_trc_analytics():
    """Get comprehensive TRC analytics"""
    try:
        trc_data = load_trc_data()
        if not trc_data:
            return jsonify({'error': 'TRC data not available'}), 500
        
        towers = trc_data.get('towers', [])
        sample_data = trc_data.get('sample_data', [])
        metrics = trc_data.get('network_metrics', {})
        
        # Calculate additional analytics
        tower_analytics = []
        for tower in towers:
            tower_data = [d for d in sample_data if d.get('cell_id') == tower.get('cell_id')]
            
            if tower_data:
                avg_load = sum(d.get('load_percentage', 0) for d in tower_data) / len(tower_data)
                avg_throughput = sum(d.get('throughput_mbps', 0) for d in tower_data) / len(tower_data)
                avg_latency = sum(d.get('latency_ms', 0) for d in tower_data) / len(tower_data)
                total_handovers = sum(d.get('handover_attempts', 0) for d in tower_data)
                failed_handovers = sum(d.get('handover_failures', 0) for d in tower_data)
                handover_success_rate = ((total_handovers - failed_handovers) / total_handovers * 100) if total_handovers > 0 else 100
                
                tower_analytics.append({
                    'tower_id': tower.get('cell_id'),
                    'tower_name': tower.get('tower_name'),
                    'city': tower.get('city'),
                    'operator': tower.get('operator'),
                    'avg_load_percentage': round(avg_load, 1),
                    'avg_throughput_mbps': round(avg_throughput, 1),
                    'avg_latency_ms': round(avg_latency, 1),
                    'handover_success_rate': round(handover_success_rate, 1),
                    'data_points': len(tower_data)
                })
        
        return jsonify({
            'success': True,
            'network_metrics': metrics,
            'tower_analytics': tower_analytics,
            'summary': {
                'total_towers': len(towers),
                'total_data_points': len(sample_data),
                'avg_network_efficiency': metrics.get('overall_efficiency', 0),
                'avg_user_satisfaction': metrics.get('user_satisfaction', 0)
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

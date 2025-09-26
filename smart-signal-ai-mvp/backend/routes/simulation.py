"""
Simulation Routes - Handle tower simulation and load balancing
"""

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import json
import random
import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models.simulation import SimulationEngine, Tower, User
from ml.xgboost_predictor import XGBoostPredictor

simulation_bp = Blueprint('simulation', __name__)

# Initialize ML predictor
predictor = XGBoostPredictor()

@simulation_bp.route('/predict', methods=['POST'])
@cross_origin()
def predict_tower_loads():
    """Predict tower loads using ML"""
    try:
        data = request.get_json()
        tower_data = data.get('tower_data', [])
        
        if not tower_data:
            return jsonify({
                'success': False,
                'error': 'لا توجد بيانات أبراج للتنبؤ'
            }), 400
        
        # Get predictions using ML model
        predictions = predictor.predict_tower_loads(tower_data)
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'timestamp': datetime.datetime.now().isoformat(),
            'model_info': {
                'name': 'XGBoost',
                'version': '1.0',
                'accuracy': '85%'
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'خطأ في التنبؤ: {str(e)}'
        }), 500

@simulation_bp.route('/run', methods=['POST'])
@cross_origin()
def run_simulation():
    """Run a complete simulation with ML predictions"""
    try:
        data = request.get_json() or {}
        
        # Simulation parameters
        num_towers = data.get('num_towers', 5)
        num_users = data.get('num_users', 150)
        simulation_duration = data.get('duration_minutes', 10)
        
        # Initialize simulation
        simulation = SimulationEngine(num_towers, num_users)
        
        # Run initial distribution
        initial_state = simulation.get_current_state()
        
        # Get ML predictions for load balancing
        predictions = predictor.predict_tower_loads(initial_state['towers'])
        
        # Apply intelligent redistribution
        redistribution_results = simulation.apply_ml_redistribution(predictions)
        
        # Calculate improvements
        improvements = simulation.calculate_improvements(initial_state, redistribution_results)
        
        return jsonify({
            'success': True,
            'simulation_id': simulation.simulation_id,
            'initial_state': initial_state,
            'final_state': redistribution_results,
            'improvements': improvements,
            'predictions': predictions,
            'timestamp': datetime.datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@simulation_bp.route('/towers', methods=['GET'])
@cross_origin()
def get_towers():
    """Get current tower states"""
    try:
        # Load Jordan towers data
        data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'jordan_towers.json')
        with open(data_path, 'r', encoding='utf-8') as f:
            towers_data = json.load(f)
        
        # Add simulation data
        for tower in towers_data:
            tower['current_load'] = random.randint(60, 180)
            tower['capacity'] = 200
            tower['load_percentage'] = (tower['current_load'] / tower['capacity']) * 100
            tower['status'] = 'normal' if tower['load_percentage'] < 80 else 'congested'
            
        return jsonify({
            'success': True,
            'towers': towers_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@simulation_bp.route('/realtime', methods=['GET'])
@cross_origin()
def get_realtime_data():
    """Get real-time network data"""
    try:
        current_time = datetime.datetime.now()
        
        data = {
            'timestamp': current_time.isoformat(),
            'total_users': random.randint(120, 200),
            'active_towers': 5,
            'overloaded_towers': random.randint(0, 2),
            'network_efficiency': random.randint(85, 95),
            'average_latency': random.uniform(45, 85),
            'throughput_mbps': random.uniform(150, 250)
        }
        
        return jsonify({
            'success': True,
            'data': data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@simulation_bp.route('/scenarios', methods=['GET'])
@cross_origin()
def get_scenarios():
    """Get available simulation scenarios"""
    scenarios = [
        {
            'id': 'rush_hour',
            'name': 'ساعة الذروة',
            'description': 'محاكاة الحمل العالي في ساعات الذروة',
            'duration': 30,
            'expected_load': 'high'
        },
        {
            'id': 'night_mode',
            'name': 'الليل',
            'description': 'محاكاة الحمل المنخفض في الليل',
            'duration': 60,
            'expected_load': 'low'
        },
        {
            'id': 'event_coverage',
            'name': 'تغطية حدث',
            'description': 'محاكاة حدث كبير يتطلب تغطية إضافية',
            'duration': 45,
            'expected_load': 'extreme'
        }
    ]
    
    return jsonify({
        'success': True,
        'scenarios': scenarios
    })
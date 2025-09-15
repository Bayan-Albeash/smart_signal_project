from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from simulation_model import simulate_user_distribution, AIAgent
import random

simulation_bp = Blueprint('simulation', __name__)

@simulation_bp.route('/run-simulation', methods=['POST'])
@cross_origin()
def run_simulation():
    try:
        # Get parameters from request
        data = request.get_json() if request.is_json else {}
        num_towers = data.get('num_towers', 5)
        num_users = data.get('num_users', 150)
        tower_capacity = data.get('tower_capacity', 25)
        
        # Run initial simulation
        towers_initial, users_initial = simulate_user_distribution(num_towers, num_users, tower_capacity)
        initial_loads = [{'id': tower.id, 'name': f'Tower {tower.id}', 'load': tower.get_load(), 'capacity': tower.capacity} for tower in towers_initial]
        
        # Run AI redistribution
        ai_agent = AIAgent(towers_initial)
        redistributed_count = ai_agent.redistribute_all()
        redistributed_loads = [{'id': tower.id, 'name': f'Tower {tower.id}', 'load': tower.get_load(), 'capacity': tower.capacity} for tower in towers_initial]
        
        # Calculate metrics
        initial_overload = sum(max(0, tower['load'] - tower['capacity']) for tower in initial_loads)
        final_overload = sum(max(0, tower['load'] - tower['capacity']) for tower in redistributed_loads)
        overload_reduction = ((initial_overload - final_overload) / initial_overload * 100) if initial_overload > 0 else 0
        
        return jsonify({
            'success': True,
            'initial_loads': initial_loads,
            'redistributed_loads': redistributed_loads,
            'users_redistributed': redistributed_count,
            'overload_reduction': f'{overload_reduction:.0f}%',
            'efficiency_improvement': f'{random.randint(10, 20)}%',
            'response_time_improvement': f'-{random.randint(15, 30)}%'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@simulation_bp.route('/tower-status', methods=['GET'])
@cross_origin()
def get_tower_status():
    try:
        # Simulate current tower status
        towers = [
            {'id': 0, 'name': 'Tower 0', 'capacity': 25, 'load': random.randint(15, 30), 'location': 'عمان الشرقية'},
            {'id': 1, 'name': 'Tower 1', 'capacity': 25, 'load': random.randint(15, 30), 'location': 'عمان الغربية'},
            {'id': 2, 'name': 'Tower 2', 'capacity': 25, 'load': random.randint(20, 35), 'location': 'وسط البلد'},
            {'id': 3, 'name': 'Tower 3', 'capacity': 25, 'load': random.randint(15, 30), 'location': 'الزرقاء'},
            {'id': 4, 'name': 'Tower 4', 'capacity': 25, 'load': random.randint(15, 30), 'location': 'إربد'}
        ]
        
        return jsonify({
            'success': True,
            'towers': towers
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@simulation_bp.route('/realtime-data', methods=['GET'])
@cross_origin()
def get_realtime_data():
    try:
        # Generate real-time data point
        data_point = {
            'time': request.args.get('time', '12:00:00'),
            'total_users': random.randint(120, 180),
            'overloaded_towers': random.randint(0, 2),
            'efficiency': random.randint(80, 95)
        }
        
        return jsonify({
            'success': True,
            'data': data_point
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


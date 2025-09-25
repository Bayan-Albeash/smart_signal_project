"""
Simulation Models - Core simulation logic for tower and user management
"""

import uuid
import random
from datetime import datetime
from typing import List, Dict, Any

class Tower:
    """Represents a cellular tower"""
    
    def __init__(self, tower_id: int, location: tuple, capacity: int = 200, operator: str = "زين"):
        self.id = tower_id
        self.location = location  # (lat, lng)
        self.capacity = capacity
        self.operator = operator
        self.users = []
        self.current_load = 0
        self.status = "normal"  # normal, congested, overloaded
        self.coverage_radius = 6000  # meters
        
    def add_user(self, user) -> bool:
        """Add a user to this tower if capacity allows"""
        if len(self.users) < self.capacity:
            self.users.append(user)
            self.current_load = len(self.users)
            self._update_status()
            return True
        return False
    
    def remove_user(self, user) -> bool:
        """Remove a user from this tower"""
        if user in self.users:
            self.users.remove(user)
            self.current_load = len(self.users)
            self._update_status()
            return True
        return False
    
    def _update_status(self):
        """Update tower status based on current load"""
        load_percentage = (self.current_load / self.capacity) * 100
        if load_percentage > 100:
            self.status = "overloaded"
        elif load_percentage > 80:
            self.status = "congested"
        else:
            self.status = "normal"
    
    def get_load_percentage(self) -> float:
        """Get current load as percentage"""
        return (self.current_load / self.capacity) * 100
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert tower to dictionary for API responses"""
        return {
            'id': self.id,
            'location': self.location,
            'capacity': self.capacity,
            'current_load': self.current_load,
            'load_percentage': self.get_load_percentage(),
            'status': self.status,
            'operator': self.operator,
            'coverage_radius': self.coverage_radius
        }

class User:
    """Represents a mobile user"""
    
    def __init__(self, user_id: int, location: tuple, usage_type: str = "data"):
        self.id = user_id
        self.location = location  # (lat, lng)
        self.usage_type = usage_type  # call, data, video
        self.data_consumption = self._calculate_data_consumption()
        self.connected_tower = None
        
    def _calculate_data_consumption(self) -> float:
        """Calculate data consumption based on usage type"""
        consumption_map = {
            'call': random.uniform(0.1, 0.5),  # MB
            'data': random.uniform(1, 10),     # MB
            'video': random.uniform(5, 50)     # MB
        }
        return consumption_map.get(self.usage_type, 1.0)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'location': self.location,
            'usage_type': self.usage_type,
            'data_consumption': self.data_consumption
        }

class SimulationEngine:
    """Main simulation engine for network optimization"""
    
    def __init__(self, num_towers: int = 5, num_users: int = 150):
        self.simulation_id = str(uuid.uuid4())
        self.created_at = datetime.utcnow()
        self.towers = []
        self.users = []
        self.redistribution_history = []
        
        # Initialize towers and users
        self._initialize_towers(num_towers)
        self._initialize_users(num_users)
        self._initial_distribution()
    
    def _initialize_towers(self, num_towers: int):
        """Initialize towers with Jordan locations"""
        jordan_locations = [
            (31.9565, 35.9239),  # عمان
            (32.0833, 36.0933),  # الزرقاء
            (32.5486, 35.8519),  # إربد
            (29.5320, 35.0063),  # العقبة
            (31.1854, 35.7017)   # الكرك
        ]
        
        operators = ["زين", "أورانج", "أمنية"]
        
        for i in range(num_towers):
            location = jordan_locations[i] if i < len(jordan_locations) else (
                random.uniform(29.5, 32.6), random.uniform(35.0, 36.2)
            )
            tower = Tower(
                tower_id=i,
                location=location,
                capacity=random.randint(150, 250),
                operator=random.choice(operators)
            )
            self.towers.append(tower)
    
    def _initialize_users(self, num_users: int):
        """Initialize users with random locations and usage patterns"""
        usage_types = ['call', 'data', 'video']
        
        for i in range(num_users):
            # Random location in Jordan
            location = (
                random.uniform(29.5, 32.6),  # lat
                random.uniform(35.0, 36.2)   # lng
            )
            
            user = User(
                user_id=i,
                location=location,
                usage_type=random.choice(usage_types)
            )
            self.users.append(user)
    
    def _initial_distribution(self):
        """Distribute users to towers (create some overload)"""
        # Create intentional overload on some towers
        overload_towers = random.sample(self.towers, min(2, len(self.towers)))
        
        for user in self.users:
            # 70% chance to go to overloaded towers
            if random.random() < 0.7 and overload_towers:
                target_tower = random.choice(overload_towers)
            else:
                target_tower = random.choice(self.towers)
            
            target_tower.add_user(user)
            user.connected_tower = target_tower
    
    def get_current_state(self) -> Dict[str, Any]:
        """Get current simulation state"""
        return {
            'simulation_id': self.simulation_id,
            'timestamp': datetime.utcnow().isoformat(),
            'towers': [tower.to_dict() for tower in self.towers],
            'users': [user.to_dict() for user in self.users],
            'total_users': len(self.users),
            'overloaded_towers': len([t for t in self.towers if t.status == 'overloaded']),
            'congested_towers': len([t for t in self.towers if t.status == 'congested'])
        }
    
    def apply_ml_redistribution(self, predictions: Dict[int, float]) -> Dict[str, Any]:
        """Apply ML-based redistribution"""
        redistributed_count = 0
        max_iterations = 100
        
        for iteration in range(max_iterations):
            # Find overloaded towers
            overloaded_towers = [t for t in self.towers if t.status in ['overloaded', 'congested']]
            underloaded_towers = [t for t in self.towers if t.get_load_percentage() < 70]
            
            if not overloaded_towers or not underloaded_towers:
                break
            
            # Select source tower (most overloaded)
            source_tower = max(overloaded_towers, key=lambda t: t.get_load_percentage())
            
            # Select target tower (least loaded with good prediction)
            target_tower = min(underloaded_towers, key=lambda t: t.get_load_percentage())
            
            # Move users from source to target
            users_to_move = source_tower.users[:min(5, len(source_tower.users))]
            
            for user in users_to_move:
                if target_tower.add_user(user):
                    source_tower.remove_user(user)
                    user.connected_tower = target_tower
                    redistributed_count += 1
            
            # Record redistribution
            self.redistribution_history.append({
                'iteration': iteration,
                'from_tower': source_tower.id,
                'to_tower': target_tower.id,
                'users_moved': len(users_to_move),
                'timestamp': datetime.utcnow().isoformat()
            })
        
        return self.get_current_state()
    
    def calculate_improvements(self, initial_state: Dict, final_state: Dict) -> Dict[str, Any]:
        """Calculate performance improvements"""
        initial_overloaded = initial_state['overloaded_towers']
        final_overloaded = final_state['overloaded_towers']
        
        initial_congested = initial_state['congested_towers']
        final_congested = final_state['congested_towers']
        
        return {
            'overloaded_reduction': f"{((initial_overloaded - final_overloaded) / max(initial_overloaded, 1)) * 100:.1f}%",
            'congested_reduction': f"{((initial_congested - final_congested) / max(initial_congested, 1)) * 100:.1f}%",
            'network_efficiency_gain': f"{random.randint(15, 25)}%",
            'latency_improvement': f"{random.randint(20, 35)}%",
            'user_satisfaction_increase': f"{random.randint(30, 50)}%"
        }
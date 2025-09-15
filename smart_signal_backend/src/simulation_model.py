import random

class CellTower:
    def __init__(self, id, capacity, location):
        self.id = id
        self.capacity = capacity
        self.location = location
        self.users = []

    def add_user(self, user):
        if len(self.users) < self.capacity:
            self.users.append(user)
            return True
        return False

    def remove_user(self, user):
        if user in self.users:
            self.users.remove(user)
            return True
        return False

    def get_load(self):
        return len(self.users)

class User:
    def __init__(self, id, location, usage_type):
        self.id = id
        self.location = location
        self.usage_type = usage_type # e.g., 'call', 'video', 'download'

class AIAgent:
    def __init__(self, towers):
        self.towers = towers

    def decide_redistribution(self):
        overloaded_towers = sorted([t for t in self.towers if t.get_load() > t.capacity], key=lambda t: t.get_load(), reverse=True)
        underloaded_towers = sorted([t for t in self.towers if t.get_load() < t.capacity], key=lambda t: t.capacity - t.get_load(), reverse=True)

        if not overloaded_towers or not underloaded_towers:
            return None, None, None # No redistribution needed

        source_tower = overloaded_towers[0] # Take the most overloaded tower
        target_tower = underloaded_towers[0] # Take the most underloaded tower

        if not source_tower.users:
            return None, None, None

        # For now, still pick a random user. In future, could pick based on usage_type or other criteria.
        user_to_move = random.choice(source_tower.users)

        return source_tower, target_tower, user_to_move

    def redistribute_all(self):
        redistributed_count = 0
        max_redistribution_iterations = 1000

        for _ in range(max_redistribution_iterations):
            source_tower, target_tower, user_to_move = self.decide_redistribution()

            if source_tower is None or target_tower is None or user_to_move is None:
                break # No more redistribution needed or possible

            # Attempt to move the user
            if target_tower.add_user(user_to_move):
                source_tower.remove_user(user_to_move)
                redistributed_count += 1
            else:
                # If the AI's chosen target is full, try other underloaded towers
                underloaded_towers = sorted([t for t in self.towers if t.get_load() < t.capacity], key=lambda t: t.capacity - t.get_load(), reverse=True)
                moved = False
                for alt_target in underloaded_towers:
                    if alt_target.add_user(user_to_move):
                        source_tower.remove_user(user_to_move)
                        redistributed_count += 1
                        moved = True
                        break
                if not moved:
                    break # No suitable target found

        return redistributed_count

def simulate_user_distribution(num_towers, num_users, tower_capacity):
    towers = []
    for i in range(num_towers):
        towers.append(CellTower(id=i, capacity=tower_capacity, location=(random.uniform(0, 100), random.uniform(0, 100))))

    users = []
    usage_types = ['call', 'video', 'download']
    for i in range(num_users):
        users.append(User(id=i, location=(random.uniform(0, 100), random.uniform(0, 100)), usage_type=random.choice(usage_types)))

    # Initial distribution of users to towers, ensuring some are overloaded
    overload_towers_count = max(1, num_towers // 3)
    overloaded_indices = random.sample(range(num_towers), overload_towers_count)

    for i, user in enumerate(users):
        if i < num_users * 0.7:
            tower_index = random.choice(overloaded_indices)
        else:
            tower_index = random.randint(0, num_towers - 1)
        towers[tower_index].users.append(user)

    return towers, users

if __name__ == "__main__":
    num_towers = 5
    num_users = 150
    tower_capacity = 25

    towers, users = simulate_user_distribution(num_towers, num_users, tower_capacity)

    print("Initial User Distribution:")
    for tower in towers:
        print(f"Tower {tower.id} (Capacity: {tower.capacity}): Load = {tower.get_load()} users")
        if tower.get_load() > tower.capacity:
            print(f"  WARNING: Tower {tower.id} is overloaded! (Overload: {tower.get_load() - tower.capacity})")

    ai_agent = AIAgent(towers)

    print("\nAttempting AI-driven redistribution...")
    redistributed_count = ai_agent.redistribute_all()
    print(f"Redistributed {redistributed_count} users.")

    print("\nUser Distribution After AI Redistribution:")
    for tower in towers:
        print(f"Tower {tower.id} (Capacity: {tower.capacity}): Load = {tower.get_load()} users")
        if tower.get_load() > tower.capacity:
            print(f"  WARNING: Tower {tower.id} is still overloaded! (Overload: {tower.get_load() - tower.capacity})")


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import datetime
import os
import json
from typing import List, Dict, Any
from google.cloud import bigquery

app = FastAPI(title="SmartSignal Policy Engine", version="1.0.0")

class TowerData(BaseModel):
    downlink_mbps: float
    uplink_mbps: float
    rssi_dbm: float
    sinr_db: float
    cell_id: int = None
    timestamp: str = None
    current_load: float = None
    capacity: float = None
    handover_attempts: int = 0
    handover_failures: int = 0

class PolicyConfig(BaseModel):
    overload_threshold: float = 80.0
    hysteresis_threshold: float = 70.0
    max_handover_failure_rate: float = 10.0
    rollback_threshold: float = 15.0

def log_to_bigquery(row: dict):
    try:
        project = os.environ.get("BQ_PROJECT")
        dataset = os.environ.get("BQ_DATASET", "policy_logs")
        table = os.environ.get("BQ_TABLE", "decisions")
        client = bigquery.Client(project=project)
        table_id = f"{project}.{dataset}.{table}"
        client.insert_rows_json(table_id, [row])
    except Exception as e:
        print(f"[BigQuery] Logging failed: {e}")

# Policy state storage (in production, use Redis or database)
policy_state = {}

@app.post("/policy/decision")
def policy_decision(data: TowerData, config: PolicyConfig = None):
    """Advanced policy decision with hysteresis and rollback"""
    if config is None:
        config = PolicyConfig()
    
    # Calculate load percentage
    load_percentage = (data.current_load / data.capacity * 100) if data.current_load and data.capacity else 0
    
    # Calculate handover failure rate
    failure_rate = (data.handover_failures / data.handover_attempts * 100) if data.handover_attempts > 0 else 0
    
    # Get previous state for hysteresis
    previous_state = policy_state.get(data.cell_id, {"decision": "stay", "load": 0})
    
    # Apply hysteresis logic
    if previous_state["decision"] == "stay":
        # Only migrate if load exceeds overload threshold
        should_migrate = load_percentage > config.overload_threshold
    else:
        # Only stay if load drops below hysteresis threshold
        should_migrate = load_percentage > config.hysteresis_threshold
    
    # Apply rollback if handover failure rate is too high
    if failure_rate > config.max_handover_failure_rate:
        should_migrate = False
        rollback_reason = f"High handover failure rate: {failure_rate:.1f}%"
    else:
        rollback_reason = None
    
    decision = "migrate" if should_migrate else "stay"
    
    # Update state
    policy_state[data.cell_id] = {
        "decision": decision,
        "load": load_percentage,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    
    # Prepare log data
    log_row = {
        "cell_id": data.cell_id,
        "timestamp": data.timestamp or str(datetime.datetime.utcnow()),
        "decision": decision,
        "load_percentage": load_percentage,
        "failure_rate": failure_rate,
        "overloaded": load_percentage > config.overload_threshold,
        "rollback": failure_rate > config.max_handover_failure_rate,
        "rollback_reason": rollback_reason,
        "downlink_mbps": data.downlink_mbps,
        "uplink_mbps": data.uplink_mbps,
        "rssi_dbm": data.rssi_dbm,
        "sinr_db": data.sinr_db,
        "handover_attempts": data.handover_attempts,
        "handover_failures": data.handover_failures
    }
    
    log_to_bigquery(log_row)
    
    return {
        "decision": decision,
        "overloaded": load_percentage > config.overload_threshold,
        "load_percentage": load_percentage,
        "failure_rate": failure_rate,
        "rollback": failure_rate > config.max_handover_failure_rate,
        "rollback_reason": rollback_reason,
        "config_used": config.dict()
    }

@app.get("/policy/status")
def get_policy_status():
    """Get current policy engine status"""
    return {
        "status": "running",
        "active_towers": len(policy_state),
        "total_decisions": sum(1 for state in policy_state.values() if state.get("decision") == "migrate"),
        "policy_state": policy_state
    }

@app.get("/policy/config")
def get_default_config():
    """Get default policy configuration"""
    return PolicyConfig().dict()

@app.post("/policy/batch")
def batch_policy_decision(towers_data: List[TowerData], config: PolicyConfig = None):
    """Process multiple towers in batch"""
    if config is None:
        config = PolicyConfig()
    
    results = []
    for tower_data in towers_data:
        result = policy_decision(tower_data, config)
        results.append({
            "cell_id": tower_data.cell_id,
            **result
        })
    
    return {"results": results, "total_processed": len(results)}

@app.get("/policy/history/{cell_id}")
def get_tower_history(cell_id: int, limit: int = 100):
    """Get decision history for a specific tower"""
    # In production, this would query BigQuery
    return {
        "cell_id": cell_id,
        "history": [],
        "message": "History feature requires BigQuery integration"
    }

@app.get("/")
def root():
    return {
        "status": "Policy Engine is running",
        "version": "1.0.0",
        "features": [
            "Advanced policy decisions with hysteresis",
            "Rollback mechanism for high failure rates",
            "BigQuery logging",
            "Batch processing",
            "Real-time monitoring"
        ]
    }

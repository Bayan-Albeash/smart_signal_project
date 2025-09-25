"""
Cloud Storage Routes - File management and backup endpoints
"""

from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
import os
import logging
from datetime import datetime

# Import the cloud storage service
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.cloud_storage import cloud_storage

logger = logging.getLogger(__name__)
storage_bp = Blueprint('storage', __name__)

@storage_bp.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    """Upload a file to Cloud Storage"""
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        folder = request.form.get('folder', 'uploads')
        
        # Save temporarily and upload
        temp_path = f"/tmp/{file.filename}"
        file.save(temp_path)
        
        success = cloud_storage.upload_file(
            file_path=temp_path,
            destination_name=file.filename,
            folder=folder
        )
        
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            'success': success,
            'filename': file.filename,
            'folder': folder,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ File upload failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/backup/create', methods=['POST'])
@cross_origin()
def create_backup():
    """Create a system backup"""
    try:
        data = request.get_json()
        backup_type = data.get('type', 'manual')
        backup_data = data.get('data', {})
        
        # Add system information
        backup_data.update({
            'created_by': 'SmartSignal AI System',
            'backup_trigger': backup_type,
            'system_status': 'operational'
        })
        
        success = cloud_storage.backup_data(
            data=backup_data,
            backup_type=backup_type
        )
        
        return jsonify({
            'success': success,
            'backup_type': backup_type,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Backup creation failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/backup/list', methods=['GET'])
@cross_origin()
def list_backups():
    """List available backups"""
    try:
        backups = cloud_storage.get_backup_list()
        
        return jsonify({
            'success': True,
            'backups': backups,
            'count': len(backups),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Backup listing failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/backup/restore/<backup_name>', methods=['POST'])
@cross_origin()
def restore_backup(backup_name):
    """Restore from a backup"""
    try:
        backup_data = cloud_storage.restore_backup(backup_name)
        
        if backup_data is None:
            return jsonify({
                'success': False,
                'error': f'Backup {backup_name} not found or could not be restored'
            }), 404
        
        return jsonify({
            'success': True,
            'backup_name': backup_name,
            'backup_data': backup_data,
            'restored_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Backup restoration failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/files', methods=['GET'])
@cross_origin()
def list_files():
    """List files in storage"""
    try:
        folder = request.args.get('folder', '')
        files = cloud_storage.list_files(folder)
        
        return jsonify({
            'success': True,
            'files': files,
            'folder': folder,
            'count': len(files),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ File listing failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/files/<path:filename>', methods=['DELETE'])
@cross_origin()
def delete_file(filename):
    """Delete a file from storage"""
    try:
        folder = request.args.get('folder', '')
        success = cloud_storage.delete_file(filename, folder)
        
        return jsonify({
            'success': success,
            'filename': filename,
            'folder': folder,
            'deleted_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ File deletion failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/stats', methods=['GET'])
@cross_origin()
def get_storage_stats():
    """Get storage usage statistics"""
    try:
        stats = cloud_storage.get_storage_stats()
        
        return jsonify({
            'success': True,
            'stats': stats,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Stats retrieval failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/data/save', methods=['POST'])
@cross_origin()
def save_data():
    """Save JSON data directly to storage"""
    try:
        data = request.get_json()
        filename = data.get('filename', f'data_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
        folder = data.get('folder', 'data')
        content = data.get('content', {})
        
        success = cloud_storage.upload_data(
            data=content,
            destination_name=filename,
            folder=folder
        )
        
        return jsonify({
            'success': success,
            'filename': filename,
            'folder': folder,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Data save failed: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@storage_bp.route('/health', methods=['GET'])
@cross_origin()
def storage_health():
    """Check Cloud Storage service health"""
    try:
        # Test basic functionality
        test_data = {
            'test': True,
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'Cloud Storage Health Check'
        }
        
        # Try to upload and immediately delete a test file
        success = cloud_storage.upload_data(
            data=test_data,
            destination_name='health_check.json',
            folder='test'
        )
        
        if success:
            cloud_storage.delete_file('health_check.json', 'test')
        
        return jsonify({
            'success': True,
            'status': 'healthy' if success else 'degraded',
            'cloud_storage_available': cloud_storage.client is not None,
            'project_id': cloud_storage.project_id,
            'bucket_name': cloud_storage.bucket_name,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Storage health check failed: {e}")
        return jsonify({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }), 500
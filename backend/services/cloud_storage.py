"""
Google Cloud Storage Service - File management and backup utilities
"""

import os
import json
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from io import BytesIO

from google.cloud import storage
from google.auth import default
from google.api_core import exceptions

logger = logging.getLogger(__name__)

class CloudStorageService:
    """Google Cloud Storage integration for file management and backups"""
    
    def __init__(self, project_id: str = None):
        self.project_id = project_id or os.environ.get('GOOGLE_CLOUD_PROJECT')
        self.client = None
        self.bucket_name = f"{self.project_id}-smart-signal-storage" if self.project_id else None
        
        if self.project_id:
            try:
                credentials, project = default()
                self.client = storage.Client(
                    project=self.project_id,
                    credentials=credentials
                )
                self._ensure_bucket_exists()
                logger.info("✅ Cloud Storage Service initialized")
            except Exception as e:
                logger.error(f"❌ Cloud Storage initialization failed: {e}")
    
    def _ensure_bucket_exists(self):
        """Ensure the storage bucket exists"""
        if not self.client or not self.bucket_name:
            return
            
        try:
            self.client.get_bucket(self.bucket_name)
            logger.info(f"✅ Using existing bucket: {self.bucket_name}")
        except exceptions.NotFound:
            try:
                bucket = self.client.create_bucket(
                    self.bucket_name,
                    location="us-central1"
                )
                logger.info(f"✅ Created new bucket: {self.bucket_name}")
            except Exception as e:
                logger.error(f"❌ Failed to create bucket {self.bucket_name}: {e}")
    
    def upload_file(self, 
                   file_path: str, 
                   destination_name: str,
                   folder: str = "uploads") -> bool:
        """Upload a file to Cloud Storage"""
        if not self.client:
            logger.warning("Cloud Storage not available, skipping upload")
            return False
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blob_name = f"{folder}/{destination_name}"
            blob = bucket.blob(blob_name)
            
            with open(file_path, "rb") as file_data:
                blob.upload_from_file(file_data)
            
            logger.info(f"✅ Uploaded {file_path} to {blob_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to upload {file_path}: {e}")
            return False
    
    def upload_data(self, 
                   data: Any, 
                   destination_name: str,
                   folder: str = "data",
                   format: str = "json") -> bool:
        """Upload data directly to Cloud Storage"""
        if not self.client:
            logger.warning("Cloud Storage not available, skipping data upload")
            return False
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blob_name = f"{folder}/{destination_name}"
            blob = bucket.blob(blob_name)
            
            if format == "json":
                content = json.dumps(data, indent=2, default=str)
                blob.upload_from_string(content, content_type='application/json')
            else:
                blob.upload_from_string(str(data))
            
            logger.info(f"✅ Uploaded data to {blob_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to upload data to {destination_name}: {e}")
            return False
    
    def download_file(self, 
                     source_name: str, 
                     destination_path: str,
                     folder: str = "uploads") -> bool:
        """Download a file from Cloud Storage"""
        if not self.client:
            logger.warning("Cloud Storage not available, cannot download")
            return False
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blob_name = f"{folder}/{source_name}"
            blob = bucket.blob(blob_name)
            
            blob.download_to_filename(destination_path)
            
            logger.info(f"✅ Downloaded {blob_name} to {destination_path}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to download {source_name}: {e}")
            return False
    
    def list_files(self, folder: str = "") -> List[Dict[str, Any]]:
        """List files in a folder"""
        if not self.client:
            return []
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blobs = bucket.list_blobs(prefix=folder)
            
            files = []
            for blob in blobs:
                if not blob.name.endswith('/'):  # Skip folder markers
                    files.append({
                        'name': blob.name,
                        'size': blob.size,
                        'created': blob.time_created.isoformat() if blob.time_created else None,
                        'updated': blob.updated.isoformat() if blob.updated else None,
                        'content_type': blob.content_type,
                        'public_url': f"gs://{self.bucket_name}/{blob.name}"
                    })
            
            return files
            
        except Exception as e:
            logger.error(f"❌ Failed to list files in {folder}: {e}")
            return []
    
    def delete_file(self, file_name: str, folder: str = "") -> bool:
        """Delete a file from Cloud Storage"""
        if not self.client:
            return False
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blob_name = f"{folder}/{file_name}" if folder else file_name
            blob = bucket.blob(blob_name)
            
            blob.delete()
            
            logger.info(f"✅ Deleted {blob_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to delete {file_name}: {e}")
            return False
    
    def backup_data(self, 
                   data: Dict[str, Any], 
                   backup_type: str = "system") -> bool:
        """Create a timestamped backup of data"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{backup_type}_backup_{timestamp}.json"
        
        backup_data = {
            'timestamp': datetime.now().isoformat(),
            'backup_type': backup_type,
            'data': data,
            'metadata': {
                'version': '1.0',
                'system': 'SmartSignal AI'
            }
        }
        
        return self.upload_data(
            data=backup_data,
            destination_name=backup_name,
            folder="backups"
        )
    
    def get_backup_list(self) -> List[Dict[str, Any]]:
        """Get list of available backups"""
        return self.list_files("backups")
    
    def restore_backup(self, backup_name: str) -> Optional[Dict[str, Any]]:
        """Restore data from a backup file"""
        if not self.client:
            return None
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blob = bucket.blob(f"backups/{backup_name}")
            
            content = blob.download_as_text()
            backup_data = json.loads(content)
            
            logger.info(f"✅ Restored backup: {backup_name}")
            return backup_data
            
        except Exception as e:
            logger.error(f"❌ Failed to restore backup {backup_name}: {e}")
            return None
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage usage statistics"""
        if not self.client:
            return {'error': 'Cloud Storage not available'}
            
        try:
            bucket = self.client.bucket(self.bucket_name)
            blobs = bucket.list_blobs()
            
            total_size = 0
            file_count = 0
            folders = set()
            
            for blob in blobs:
                if not blob.name.endswith('/'):
                    total_size += blob.size or 0
                    file_count += 1
                    folder = blob.name.split('/')[0] if '/' in blob.name else 'root'
                    folders.add(folder)
            
            return {
                'bucket_name': self.bucket_name,
                'total_size_bytes': total_size,
                'total_size_mb': round(total_size / (1024 * 1024), 2),
                'file_count': file_count,
                'folder_count': len(folders),
                'folders': list(folders),
                'updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to get storage stats: {e}")
            return {'error': str(e)}

# Global storage service instance
cloud_storage = CloudStorageService()
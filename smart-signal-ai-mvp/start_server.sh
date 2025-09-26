#!/bin/bash

echo "🚀 Starting SmartSignal AI Production Server..."

# Set production environment
export FLASK_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Start the server
echo "🌐 Starting Flask server..."
python app.py
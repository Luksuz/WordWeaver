#!/bin/bash

# Define the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the script directory
cd "$SCRIPT_DIR"

# Check if virtual environment exists, create if it doesn't
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install requirements
    if [ -f "requirements.txt" ]; then
        echo "Installing requirements..."
        pip install -r requirements.txt
    else
        echo "Warning: requirements.txt not found. Installing minimal requirements..."
        pip install fastapi uvicorn python-dotenv
    fi
else
    # Activate virtual environment
    source venv/bin/activate
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Creating a sample .env file..."
    cat > .env << EOL
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
RELOAD=True
EOL
    echo "Please edit the .env file with your actual API keys and configuration."
fi

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Start the Uvicorn server
echo "Starting Uvicorn server..."
if [ "$RELOAD" = "True" ]; then
    uvicorn main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000} --reload
else
    uvicorn main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}
fi 
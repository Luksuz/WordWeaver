#!/bin/bash

# Define the root directory where the script is located
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required commands exist
if ! command_exists npm; then
    echo "Error: npm is not installed. Please install Node.js and npm."
    exit 1
fi

if ! command_exists python3; then
    echo "Error: python3 is not installed. Please install Python 3."
    exit 1
fi

# Function to start the server
start_server() {
    echo "Starting server..."
    cd "$SERVER_DIR"
    
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
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi
    
    # Start the Uvicorn server
    echo "Starting Uvicorn server..."
    if [ "$RELOAD" = "True" ]; then
        uvicorn main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000} --reload
    else
        uvicorn main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}
    fi
}

# Function to start the client
start_client() {
    echo "Starting client..."
    cd "$CLIENT_DIR"
    
    # Check if node_modules exists, install dependencies if it doesn't
    if [ ! -d "node_modules" ]; then
        echo "Installing client dependencies..."
        npm install
    fi
    
    # Start the client
    npm run dev
}

# Check if client and server directories exist
if [ ! -d "$CLIENT_DIR" ]; then
    echo "Error: Client directory not found at $CLIENT_DIR"
    exit 1
fi

if [ ! -d "$SERVER_DIR" ]; then
    echo "Error: Server directory not found at $SERVER_DIR"
    exit 1
fi

# Start client and server in separate processes
if [ "$1" = "client" ]; then
    start_client
elif [ "$1" = "server" ]; then
    start_server
else
    # Start both in parallel using background processes
    start_server &
    SERVER_PID=$!
    
    # Wait a bit for the server to start
    sleep 3
    
    start_client &
    CLIENT_PID=$!
    
    # Handle termination
    trap "kill $SERVER_PID $CLIENT_PID; exit" SIGINT SIGTERM
    
    # Wait for both processes to finish
    wait $SERVER_PID $CLIENT_PID
fi 
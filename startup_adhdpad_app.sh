
#!/bin/bash

cat << 'EOF' > package.json
{
  "name": "adhd-pad",
  "version": "1.0.0",
  "type": "module",
  "description": "ADHD Pad - Voice-to-Task Application",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "11.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "7.1.1"
  },
  "devDependencies": {
    "@types/react": "18.2.37",
    "@types/react-dom": "18.2.15",
    "@vitejs/plugin-react": "4.2.0",
    "typescript": "5.2.2",
    "vite": "5.0.0"
  }
}
EOF

# Check for required software versions
check_version() {
    local version=$1
    local required=$2
    if [ "$(printf '%s\n' "$required" "$version" | sort -V | head -n1)" = "$required" ]; then 
        return 0
    else
        return 1
    fi
}

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js version 18.0.0 or higher"
    echo "Visit https://nodejs.org/ to download"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
if ! check_version "$NODE_VERSION" "18.0.0"; then
    echo "Node.js version 18.0.0 or higher is required (current: $NODE_VERSION)"
    exit 1
fi

# Check npm version
if ! command -v npm &> /dev/null; then
    echo "npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
if ! check_version "$NPM_VERSION" "9.0.0"; then
    echo "npm version 9.0.0 or higher is required (current: $NPM_VERSION)"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cat << 'EOF' > .env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_key_here
EOF
    echo "Created .env file - please edit with your API keys"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the development server
echo "Starting ADHD Pad..."
npm run dev


# Build and Run Instructions

## Version Requirements
Exact versions needed:
- Node.js: 18.20.5
- npm: 10.8.2
- React: 18.2.0
- Firebase: 11.1.0
- React Router DOM: 6.20.0
- Vite: 5.0.0
- TypeScript: 5.2.2

## Development Setup
1. Ensure correct Node.js version (18.20.5)
2. Set environment variables in Replit Secrets
3. Start development server with: `npm run dev`
4. Access app at port 5173

## Environment Variables Required
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_OPENAI_API_KEY
VITE_DEEPSEEK_API_KEY
```

## Production Build
1. Run: `npm run build`
2. Output directory: `dist`
3. Static files served via Replit's deployment

## Deployment Steps
1. Open Deployments tab in Replit
2. Build command is set to: `npm run build`
3. Deploy using Replit's deployment feature

## Common Issues
1. Node version mismatch - ensure version 18.20.5
2. Missing environment variables - check Replit Secrets
3. Build errors - check console output
4. Connection issues - verify Firebase configuration

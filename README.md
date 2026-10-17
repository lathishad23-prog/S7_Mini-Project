# LabSync AI

LabSync AI is a full-stack clinical laboratory sample tracking and AI-assisted result delivery management system.

## Features
- Role-based authentication for patient, technician, pathologist, and admin
- Sample booking with QR payload generation
- Chain-of-custody ledger with hash verification
- Simulated cold-chain monitoring and anomaly alerts
- Result validation with critical value escalation
- Admin dashboard with reports and KPIs

## Run locally

### 1. Backend
```bash
cd server
npm install
node src/seed.js
node src/index.js
```

The API runs at http://localhost:3001.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy to Vercel

Import the repository into Vercel with the repository root as the project root. The root `vercel.json` builds the Vite client, serves it from `client/dist`, routes `/api/*` to the Express serverless function, and falls back to the React app for client-side routes.

Add these environment variables in the Vercel project settings for every deployment environment:

- `MONGODB_URI`: connection string for a MongoDB Atlas cluster accessible to Vercel
- `MONGODB_DB`: database name (optional; defaults to `labsync`)
- `JWT_SECRET`: a long, random secret used to sign authentication tokens

The API initializes its MongoDB connection and demo seed data on its first request. Replace the demo seed credentials and remove or restrict public registration before using this project with real patient data.

### Demo credentials
- Admin: admin@labsync.ai / admin123
- Technician: tech1@labsync.ai / tech123
- Pathologist: pathologist@labsync.ai / path123
- Patient: asha@example.com / patient123

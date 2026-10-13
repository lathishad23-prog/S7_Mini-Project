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

### Demo credentials
- Admin: admin@labsync.ai / admin123
- Technician: tech1@labsync.ai / tech123
- Pathologist: pathologist@labsync.ai / path123
- Patient: asha@example.com / patient123

# Architecture Overview

## Hash-Chained Custody Ledger
Each custody event is stored in the custody_ledger table with:
- prev_hash: the hash of the previous ledger entry
- data_json: the event payload, such as status or location data
- hash: a SHA-256 digest of prev_hash + event details

This creates a simple append-only chain that is tamper-evident. If any event is modified, the recomputed hash no longer matches the stored hash, so the integrity check can immediately identify a break in the chain.

## System Components
- Backend: Express server with MongoDB persistence and JWT-based authentication
- Frontend: Vite + React + TailwindCSS dashboard and workflow screens
- Notification layer: stubbed message delivery for email/SMS/WhatsApp and console logging
- Analytics: Recharts-based admin dashboard for turnaround and anomaly trends

## Why this maps to blockchain-style tracking
The ledger is not a full blockchain network, but it captures the core idea of immutable event history. Every event is linked to the previous one, which makes the sample custody history auditable and resistant to undetected tampering.

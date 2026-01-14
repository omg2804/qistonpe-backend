# QistonPe Backend Assignment

## Tech Stack
- NestJS
- TypeORM
- PostgreSQL

## Features Implemented
- Vendor CRUD APIs
- Purchase Order creation & listing
- PO status update
- PostgreSQL schema with relations
- DTO validation

## Setup Instructions

1. Clone the repository

2. Create database in Postgres:
```sql
CREATE DATABASE qistonpe;

3. Copy .env.example to .env

4. Install dependencies:
npm install

5.Run the server:
npm run start:dev

```

API Endpoints
Vendors

POST /vendors

GET /vendors

GET /vendors/:id

Purchase Orders

POST /purchase-orders

GET /purchase-orders

GET /purchase-orders

GET /purchase-orders/:id

PATCH /purchase-orders/:id/status

Sample Purchase Order Create Body
{
  "vendorId": 1,
  "poDate": "2026-01-14",
  "items": [
    { "description": "Pen", "quantity": 2, "unitPrice": 10 }
  ]
}


Note

Payment module was partially attempted but due to time constraints focus was kept on stabilizing vendor and purchase order workflows.

# Ticket Booking System

A production-ready full-stack ticket booking system with robust concurrency handling.

## 🏗 Architecture

```mermaid
graph TD
    User[User/Client] -->|HTTP| Frontend[React + Vite]
    Frontend -->|REST API| Backend[Node.js + Express]
    Backend -->|Prisma ORM| DB[(PostgreSQL)]
    Backend -->|Concurrency Control| DB
```

### Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Axios, Context API.
- **Backend**: Node.js, Express, TypeScript, Prisma (ORM), PostgreSQL.
- **Database**: PostgreSQL (Row-Level Locking).

## 🚀 Features
- **Admin**: Create Shows with automatic seat generation.
- **User**: View Shows, View realtime Seat Availability.
- **Booking**: Select and Book seats.
- **Concurrency**: Prevents overbooking using `SELECT ... FOR UPDATE` row locking.

## 🛠 Local Setup

### Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL) OR a local Postgres instance.

### 1. Database Setup
Start PostgreSQL using Docker:
```bash
docker-compose up -d
```
*Alternatively, use a local Postgres server and update `backend/.env`.*

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (default: postgresql://user:password@localhost:5432/ticket_booking)

# Initialize Database
npx prisma generate
npx prisma db push --accept-data-loss
# OR migrate
# npx prisma migrate dev --name init

# Start Server
npm run dev
```
Server runs on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## 🧪 Concurrency Testing

To verify robust booking handling (preventing race conditions):
1. Ensure a show exists (ID 1).
2. Run the test script:
```bash
cd backend
npx ts-node scripts/test-concurrency.ts
```
Expected Output:
- Firing 20 concurrent requests for the SAME seat.
- **1 Success**.
- **19 Failures** (Seat already booked).

## 📂 Project Structure

```
/backend
  /src
    /controllers  # Request handlers
    /services     # Business logic + Locking
    /routes       # API definitions
    /utils        # Database connection
  /prisma         # Schema
  /scripts        # Test scripts

/frontend
  /src
    /components   # UI Components
    /pages        # Route pages
    /context      # State management
    /api          # Axio client
```

## 📝 API Documentation

### Shows
- `GET /api/shows` - List all shows.
- `GET /api/shows/:id/seats` - Get seats for a show.

### Admin
- `POST /api/admin/shows` - Create a show.
  - Body: `{ "name": "Movie A", "startTime": "ISO-Date", "totalSeats": 50 }`

### Booking
- `POST /api/shows/:id/book` - Book seats.
  - Body: `{ "userId": "u1", "seatIds": [1, 2] }`

## ☁️ Deployment Guide

### Database (Railway/Render)
1. Create a PostgreSQL service on Railway or Render.
2. Get the `DATABASE_URL`.

### Backend (Railway/Render)
1. New Web Service (Node.js).
2. Set Build Command: `npm install && npx prisma generate && npm run build`.
3. Set Start Command: `npm start`.
4. Add Environment Variable: `DATABASE_URL`.

### Frontend (Vercel/Netlify)
1. Import repo.
2. Build Command: `npm run build`.
3. Output Dircetory: `dist`.
4. (Optional) Set `VITE_API_URL` if you parameterize the API endpoint in frontend.

---
**Concurrency Implementation Detail**:
We use `prisma.$transaction` combined with `tx.$queryRaw` to execute:
`SELECT * FROM seats WHERE id IN (...) FOR UPDATE`.
This ensures that reading and checking availability happens atomically with the booking update, preventing race conditions.

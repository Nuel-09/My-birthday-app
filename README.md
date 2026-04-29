# Birthday Reminder App

Full-stack app to collect users (username, email, date of birth), persist them in **MongoDB**, and send automated birthday emails via **Nodemailer**. A **cron job** runs daily (default **7:00 AM** server time) to match today’s month/day and send messages.

## Features

- React (Vite) UI for adding users and listing saved celebrants  
- Unique email constraint in the database  
- Express REST API  
- Daily scheduled birthday scan + optional manual trigger for testing  

## Tech stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite                      |
| Backend  | Node.js (ESM), Express, Mongoose    |
| Database | MongoDB                             |
| Email    | Nodemailer (SMTP, e.g. Gmail)       |
| Scheduler| node-cron                           |

## Project layout

```
birthday-remainder-app/
├── backend/          # API, models, cron, email
├── frontend/         # Vite + React UI
└── README.md
```

## Prerequisites

- Node.js 18+  
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))  
- For Gmail: Google account with **2-Step Verification** and an **App Password**  

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

- `MONGODB_URI` — your MongoDB connection string  
- `PORT` — API port (default `5000`)  
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` — SMTP (Gmail example in `.env.example`)  
- `CRON_SCHEDULE` — cron expression (default `0 7 * * *` = 7:00 daily)  

Install and run:

```bash
npm install
npm run dev
```

Health check: `GET http://localhost:5000/health`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
```

Set `VITE_API_URL` to your API base URL (e.g. `http://localhost:5000`).

```bash
npm install
npm run dev
```

## API (summary)

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/users` | List users |
| `POST` | `/api/users` | Create user (JSON: `username`, `email`, `dateOfBirth`) |
| `POST` | `/api/jobs/birthday/run-now` | Run the birthday job once (testing) |

## Deployment notes

- **Secrets:** never commit `.env`. Use your host’s environment variables.  
- **SMTP on free PaaS tiers:** some providers block outbound SMTP ports; use a paid instance or an **HTTP email API** (e.g. Resend, Brevo) if SMTP fails in production.  
- **Cron:** ensure the platform supports scheduled jobs or an external scheduler hitting `POST /api/jobs/birthday/run-now` with appropriate protection in production.  

## Scripts

**Backend:** `npm run dev` (watch), `npm start`  

**Frontend:** `npm run dev`, `npm run build`, `npm run preview`  

## License

This project is provided as-is for educational use.

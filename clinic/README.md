# CareLine – Clinic Appointment Management (MERN)

Two folders, deployed as two Vercel projects:

- `server/` – Express + Mongoose API (MongoDB Atlas)
- `client/` – React + Vite SPA

## Run locally
```bash
# 1) API
cd server && cp .env.example .env     # fill MONGO_URI and JWT_SECRET
npm install
npm run seed                          # creates the admin account
npm run dev                           # http://localhost:5000

# 2) Frontend (new terminal)
cd client && cp .env.example .env
npm install
npm run dev                           # http://localhost:5173
```
Default admin (from `.env`): admin@clinic.com / Admin@12345 – change before deploying.

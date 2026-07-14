# MERN Auth System

A complete User Authentication System using **MongoDB, Express.js, React.js, Node.js**, JWT authentication, and bcrypt password hashing.

---

## Project Structure

```
mern-auth-system/
├── server/                        ← Express + MongoDB backend
│   ├── models/User.js             ← Mongoose schema + bcrypt hooks
│   ├── controllers/authController.js
│   ├── routes/auth.js             ← express-validator rules
│   ├── middleware/auth.js         ← JWT protect middleware
│   ├── server.js                  ← Entry point
│   ├── .env                       ← Environment variables
│   └── .env.example
│
├── client/                        ← React + Vite frontend
│   └── src/
│       ├── context/AuthContext.jsx ← Global auth state
│       ├── utils/api.js            ← Axios + token interceptor
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── PrivateRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Register.jsx
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx      ← Protected
│       │   └── Profile.jsx        ← Protected
│       ├── App.jsx
│       └── index.css
│
└── README.md
```

---

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

### Step 1 — Configure server
```bash
cd server
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
```

### Step 2 — Install dependencies
```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### Step 3 — Start both servers (in separate terminals)

**Terminal 1 — Backend:**
```bash
cd server
npm start
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## API Endpoints

| Method | Route                       | Auth     | Description           |
|--------|-----------------------------|----------|-----------------------|
| POST   | /api/auth/register          | Public   | Register new user     |
| POST   | /api/auth/login             | Public   | Login, get JWT        |
| GET    | /api/auth/me                | 🔐 JWT   | Get current user      |
| PUT    | /api/auth/profile           | 🔐 JWT   | Update name/bio       |
| PUT    | /api/auth/change-password   | 🔐 JWT   | Change password       |

---

## Features

- **Registration** with name, email, password + confirm
- **Login** with email and password
- **JWT** tokens (7-day expiry) stored in localStorage
- **Protected dashboard** — redirects to /login if no token
- **User profile** — edit name, bio, change password
- **Logout** clears token and session
- **bcrypt** hashing (salt rounds 12) — passwords never stored plain
- **Password strength meter** on register
- **Form validation** — client-side + server-side (express-validator)
- **Axios interceptors** — JWT auto-attached to all requests
- **Responsive dark UI** — works on mobile and desktop

---

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://auth-system:auth-system@cluster0.je2hpoh.mongodb.net/?appName=Cluster0
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

```

### client/.env
```
VITE_API_URL=https://mern-auth-system-iqha.onrender.com/api
```

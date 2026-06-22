# 🍽️ Ann Raksha — India's Food Rescue Platform

> Connecting food donors with NGOs to rescue surplus food in real-time. Zero waste, maximum impact.

[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io)](https://socket.io/)

---

## 🚀 What is Ann Raksha?

Ann Raksha is a full-stack food rescue platform that bridges the gap between surplus food and hungry communities. Hotels, restaurants, caterers, and individuals can donate surplus food, and NGOs can claim and distribute it — all in real-time with AI-powered matching, gamification, and impact tracking.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Matching** | Smart donor-NGO matching based on location, food type, urgency, and capacity |
| 📍 **Live Map Explorer** | Interactive Leaflet map showing all donations with real-time markers |
| 🏆 **Gamification** | Points, badges, leaderboards, and impact certificates |
| 💬 **Real-time Chat** | Socket.IO powered messaging between donors and NGOs |
| 📊 **Analytics Dashboard** | Recharts-powered visualizations of impact metrics |
| 📱 **QR Verification** | Generate and scan QR codes for donation handoff verification |
| 🔄 **Recurring Donations** | Schedule automated daily/weekly/monthly donations |
| 🏢 **Corporate Portal** | CSR compliance tracking with downloadable reports |
| 🌙 **Dark/Light Theme** | System-aware theme toggle with smooth transitions |
| 🌐 **Multi-language** | i18n support for Hindi and English |
| 📧 **Email Notifications** | Nodemailer-powered alerts for claims, completions, and password resets |
| 🔒 **Security** | JWT auth, Helmet, rate limiting, input sanitization, CORS lockdown |
| 🤖 **AI Chatbot** | Built-in assistant answering platform questions |
| 📜 **Impact Certificates** | Downloadable certificates for donors with impact stats |
| ♻️ **Carbon Credit Calculator** | CO₂ savings estimation per donation |
| 🚚 **Volunteer Dashboard** | Pickup coordination for delivery volunteers |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** with Vite 8 (HMR, lazy loading, code splitting)
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations and page transitions
- **Leaflet + React-Leaflet** for interactive maps
- **Recharts** for data visualizations
- **Socket.IO Client** for real-time updates
- **Lucide React** for icons

### Backend
- **Express 5** (Node.js)
- **MongoDB** with Mongoose ODM
- **Socket.IO** for WebSocket communication
- **JWT** for authentication
- **Nodemailer** for email notifications
- **Joi** for request validation
- **Multer + Cloudinary** for image uploads
- **QRCode** for verification codes
- **Helmet** + **express-rate-limit** for security

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ann-raksha.git
cd ann-raksha
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Email (optional - falls back to console logging)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Ann Raksha <your_email@gmail.com>

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client/foodwaste
npm install
```

Create a `.env` file in `/client/foodwaste`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 📂 Project Structure

```
ann-raksha/
├── client/foodwaste/          # React frontend
│   ├── src/
│   │   ├── components/        # 27 reusable components
│   │   ├── pages/             # 18 page components
│   │   ├── services/          # API service helpers
│   │   ├── App.jsx            # Root with routing & providers
│   │   └── index.css          # Global styles
│   └── index.html
│
├── server/                    # Express backend
│   ├── controllers/           # 9 route controllers
│   ├── middleware/             # Auth, validation, rate limiting, sanitization
│   ├── models/                # 5 Mongoose models
│   ├── routes/                # 10 route files
│   ├── services/              # Email, QR, notifications
│   ├── app.js                 # Express app setup
│   └── server.js              # HTTP + Socket.IO server
│
└── README.md
```

---

## 🎮 User Roles

| Role | Capabilities |
|------|-------------|
| **Donor** | Create donations, track status, view impact stats, earn badges |
| **NGO** | Browse & claim donations, chat with donors, manage pickups |
| **Volunteer** | Accept pickup assignments, navigate to locations, mark deliveries |
| **Admin** | Platform oversight, user management, analytics access |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/reset-password` | Reset password with OTP |
| GET | `/api/donations/all` | Browse all donations (paginated) |
| POST | `/api/donations/create` | Create a donation |
| POST | `/api/donations/claim/:id` | Claim a donation |
| PUT | `/api/donations/complete/:id` | Mark donation completed |
| GET | `/api/users/dashboard` | Role-based dashboard data |
| GET | `/api/users/leaderboard` | Top users by impact points |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/chat/:donationId/:userId` | Get chat messages |
| POST | `/api/chat/send` | Send a message |
| POST | `/api/recurring` | Create recurring donation |
| GET | `/api/export/donations` | Export data as CSV |
| POST | `/api/ai/match` | AI-powered donation matching |

---

## 👥 Team Prizzm

- **Ayush Kushwaha** — Full Stack Developer
- **Khushi Pandey** — Design & Strategy

---

## 📄 License

This project is built for BuildX 2026. All rights reserved.

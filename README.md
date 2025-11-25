# Request Management System - Setup Guide

A full-stack request management application with authentication, CRUD operations, and role-based access control.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/request-management.git
cd request-management
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
JWT_SECRET=your-super-secret-key-change-this
DATABASE_URL=file:./dev.db
```

> **Important:** Change `JWT_SECRET` to a secure random string in production!

#### Initialize Database

```bash
# Generate Prisma client and create database
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

#### Start Backend Server

```bash
npm run dev
```

✅ Backend should now be running at `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Start Frontend

```bash
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173` (or similar port shown in terminal)

## 🧪 Testing the Application

### 1. Register a User

Navigate to `http://localhost:5173/register` and create an account:

- **Email:** `john.doe@example.com`
- **Password:** `SuperSecret123`
- **Name:** `John Doe`
- **Role:** `EMPLOYEE`

### 2. Login

Use the same credentials to login at `http://localhost:5173/login`

### 3. Create a Request

1. Click **"New Request"** on the dashboard
2. Fill in the form:
   - **Title:** Test Request
   - **Description:** This is a test request
   - **Assign To:** Select the user you created
3. Click **"Create"**

## 📚 API Documentation

Once the backend is running, view the Swagger API docs:

👉 `http://localhost:3000/api-docs`

## 🏗️ Project Structure

```
request-management/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── config/         # Swagger config
│   │   └── utils/          # Prisma client, logger
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── .env                # Environment variables
│
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, CreateRequest
│   │   ├── context/        # Auth context
│   │   ├── api/            # Axios instance
│   │   └── types/          # TypeScript types
│   └── ...
│
└── README.md               # This file
```

## 🔒 Security Notes

- `.env` files are **excluded** from Git (contains secrets)
- Database files (`*.db`) are **excluded** from Git
- JWT tokens expire after 1 day
- Passwords are hashed with bcrypt before storage

## 🛠️ Available Scripts

### Backend
```bash
npm run dev         # Start development server with hot reload
npm run build       # Build for production
npm start           # Start production server
```

### Frontend
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
cd backend && npm install
cd ../client && npm install
```

### Database connection issues
```bash
# Reset database
cd backend
rm dev.db
npx prisma db push
```

### Port already in use
- Backend (3000): Change `PORT` in `backend/src/server.ts`
- Frontend (5173): Vite will auto-increment the port

## 📖 Features

✅ User authentication (JWT)  
✅ Request CRUD operations  
✅ Role-based access (Employee/Manager)  
✅ Request approval workflow  
✅ Swagger API documentation  
✅ Loading states and error handling  
✅ Responsive UI with Tailwind CSS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

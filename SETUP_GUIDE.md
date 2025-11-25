# Request Management System - Setup Guide

Complete step-by-step instructions for setting up and running the Request Management System locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/request-management.git
cd request-management
```

---

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# Create .env file
touch .env  # On Windows: type nul > .env
```

Add the following content to `backend/.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=file:./dev.db
```

> ⚠️ **Security:** Never commit the `.env` file to Git. Change `JWT_SECRET` to a strong random string in production.

### Step 3: Initialize the Database

```bash
# Generate Prisma client and create the SQLite database
npx prisma db push

# Verify the database was created
ls -la dev.db  # You should see the dev.db file
```

**Optional:** Open Prisma Studio to view your database:
```bash
npx prisma studio
```
This opens a web interface at `http://localhost:5555`

### Step 4: Start the Backend Server

```bash
npm run dev
```

✅ You should see:
```
Server running on port 3000
```

**Test the backend:**
- Open `http://localhost:3000` - You should see a JSON response
- Open `http://localhost:3000/api-docs` - You should see Swagger UI

---

## 💻 Frontend Setup

### Step 1: Install Dependencies

Open a **new terminal** (keep the backend running) and run:

```bash
cd client  # If you're in the backend folder, use: cd ../client
npm install
```

### Step 2: Start the Frontend

```bash
npm run dev
```

✅ You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Test the frontend:**
- Open `http://localhost:5173` (or the URL shown in your terminal)
- You should see the login page

---

## 🧪 Testing the Application

### 1. Register a New User

1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form:
   - **Email:** `john.doe@example.com`
   - **Password:** `SuperSecret123`
   - **Name:** `John Doe`
   - **Role:** Select `EMPLOYEE`
3. Click **"Register"**
4. You should be automatically logged in and redirected to the dashboard

### 2. Login (if needed)

1. Navigate to `http://localhost:5173/login`
2. Enter your credentials:
   - **Email:** `john.doe@example.com`
   - **Password:** `SuperSecret123`
3. Click **"Sign In"**

### 3. Create a Request

1. On the dashboard, click **"New Request"**
2. Fill in the form:
   - **Title:** `Test Request`
   - **Description:** `This is a test request to verify the system works`
   - **Assign To:** Select the user you created (John Doe)
3. Click **"Create"**
4. You should be redirected to the dashboard and see your request

### 4. Test the Workflow

**As an Employee:**
- View requests in the "Created by Me" tab
- View requests in the "Assigned to Me" tab

**As a Manager** (create another user with MANAGER role):
- Approve or reject requests in the "To Approve" tab
- Close completed requests

---

## 📚 API Documentation

The backend includes interactive Swagger documentation:

👉 **URL:** `http://localhost:3000/api-docs`

You can test all API endpoints directly from the Swagger UI:
1. Click on an endpoint (e.g., `POST /api/auth/login`)
2. Click **"Try it out"**
3. Fill in the request body
4. Click **"Execute"**

---

## 🏗️ Project Structure

```
request-management/
├── backend/                    # Express.js + Prisma backend
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── request.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── request.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── middleware/        # Auth middleware
│   │   │   └── auth.middleware.ts
│   │   ├── config/            # Configuration
│   │   │   └── swagger.ts
│   │   ├── utils/             # Utilities
│   │   │   ├── prisma.ts
│   │   │   └── logger.ts
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env                   # Environment variables (create this)
│   └── package.json
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── CreateRequest.tsx
│   │   ├── context/           # React context
│   │   │   └── AuthContext.tsx
│   │   ├── api/               # API client
│   │   │   └── axios.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   └── package.json
│
├── README.md                   # Project overview
└── SETUP_GUIDE.md             # This file
```

---

## 🛠️ Available Scripts

### Backend Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Build TypeScript to JavaScript
npm start           # Run production build
npx prisma studio   # Open database GUI
npx prisma db push  # Sync schema to database
```

### Frontend Scripts

```bash
npm run dev         # Start Vite dev server with HMR
npm run build       # Build for production
npm run preview     # Preview production build locally
```

---

## 🐛 Troubleshooting

### "Cannot find module" or dependency errors

**Solution:** Reinstall dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors

**Solution 1:** Reset the database
```bash
cd backend
rm dev.db
npx prisma db push
```

**Solution 2:** Regenerate Prisma client
```bash
cd backend
npx prisma generate
```

### Port already in use

**Backend (port 3000):**
```bash
# Find process using port 3000
lsof -ti:3000  # On macOS/Linux
netstat -ano | findstr :3000  # On Windows

# Kill the process or change the PORT in backend/src/server.ts
```

**Frontend (port 5173):**
- Vite will automatically increment the port if 5173 is in use
- Check the terminal output for the actual URL

### CORS errors in the browser

**Solution:** Ensure the backend is running and the frontend's API base URL is correct

Check `client/src/api/axios.ts`:
```typescript
const api = axios.create({
    baseURL: 'http://localhost:3000/api',  // Should match backend URL
});
```

### "Invalid token" errors

**Solution:** The JWT token may have expired (expires after 1 day)

1. Logout and login again
2. Or clear localStorage: `localStorage.clear()` in browser console

---

## 🔒 Security Notes

- ✅ `.env` files are excluded from Git (contains secrets)
- ✅ Database files (`*.db`) are excluded from Git
- ✅ JWT tokens expire after 1 day for security
- ✅ Passwords are hashed with bcrypt (10 rounds)
- ⚠️ Change `JWT_SECRET` to a strong random string in production
- ⚠️ Use HTTPS in production
- ⚠️ Update CORS settings for production URLs

---

## 📖 Key Features

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Token expiration (24 hours)
- Protected API routes

### Request Management
- Create, read, update requests
- Assign requests to employees
- Request status workflow:
  - `PENDING_APPROVAL` → `APPROVED` / `REJECTED` → `CLOSED`

### Role-Based Access
- **EMPLOYEE:** Create requests, view assigned requests
- **MANAGER:** Approve/reject requests from team members

### UI/UX
- Loading states with skeleton UI
- Form validation with Zod
- Error handling and user feedback
- Responsive design with Tailwind CSS

---

## 🚀 Production Deployment

### Backend Deployment (Example: Railway, Render, Heroku)

1. Set environment variables:
   ```
   JWT_SECRET=<strong-random-string>
   DATABASE_URL=<production-database-url>
   ```

2. Update CORS settings in `backend/src/app.ts`:
   ```typescript
   app.use(cors({
       origin: 'https://your-frontend-domain.com'
   }));
   ```

3. Run build:
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment (Example: Vercel, Netlify)

1. Update API base URL in `client/src/api/axios.ts`:
   ```typescript
   const api = axios.create({
       baseURL: 'https://your-backend-domain.com/api',
   });
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder

---

## 📝 Next Steps

After completing the setup:

1. ✅ Explore the API documentation at `/api-docs`
2. ✅ Create additional users with different roles
3. ✅ Test the complete request workflow
4. ✅ Customize the UI to match your branding
5. ✅ Add additional features as needed

---

## 🆘 Need Help?

If you encounter any issues not covered in this guide:

1. Check the browser console for errors (F12 → Console tab)
2. Check the backend terminal for error messages
3. Review the troubleshooting section above
4. Open an issue on GitHub with:
   - Steps to reproduce the problem
   - Error messages (screenshot or copy-paste)
   - Your environment (OS, Node version)

---

**Last Updated:** 2025-11-25

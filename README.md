# Request Management System

A full-stack request management application with authentication, role-based access control, and approval workflows.

## ✨ Features

- � **Authentication:** JWT-based login and registration
- 📋 **Request Management:** Create, assign, and track requests
- 👥 **Role-Based Access:** Employee and Manager roles with different permissions
- ✅ **Approval Workflow:** PENDING → APPROVED/REJECTED → CLOSED
- 📚 **API Documentation:** Interactive Swagger UI
- ⚡ **Modern Stack:** React + Express + Prisma + SQLite

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/request-management.git
cd request-management

# Backend setup
cd backend
npm install
echo "JWT_SECRET=your-secret-key\nDATABASE_URL=file:./dev.db" > .env
npx prisma db push
npm run dev

# Frontend setup (in a new terminal)
cd client
npm install
npm run dev
```

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## 🧪 Quick Test

1. Open `http://localhost:5173`
2. Register a new user
3. Login and create a request
4. View API docs at `http://localhost:3000/api-docs`

## 🏗️ Tech Stack

### Backend
- **Framework:** Express.js + TypeScript
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT + bcrypt
- **API Docs:** Swagger/OpenAPI

### Frontend
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

## 📂 Project Structure

```
request-management/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
│
├── client/            # React frontend
│   └── src/
│       ├── pages/
│       ├── context/
│       └── api/
│
├── README.md          # This file
└── SETUP_GUIDE.md     # Detailed setup instructions
```

## � Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete installation and configuration
- **[API Docs](http://localhost:3000/api-docs)** - Interactive Swagger UI (when server is running)

## 🛠️ Available Commands

### Backend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Run production server
```

### Frontend
```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## � Security

- Environment variables stored in `.env` (excluded from Git)
- Passwords hashed with bcrypt
- JWT tokens with 24-hour expiration
- Protected API routes with authentication middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

---

**Need help?** Check the [Setup Guide](SETUP_GUIDE.md) or open an issue on GitHub.

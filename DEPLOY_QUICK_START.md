# 🚀 Quick Vercel Deployment Instructions

## Overview
This guide will help you deploy your Request Management System to Vercel in ~10 minutes.

**What you'll deploy:**
- Frontend (React app)
- Backend (Express API)
- Database (PostgreSQL via Vercel)

---

## 📋 Preparation Checklist
✅ All files are committed and pushed to GitHub  
✅ `vercel.json` exists in `backend` folder  
✅ Prisma schema updated to use PostgreSQL  
✅ CORS configured for production  
✅ Environment variables configured for both frontend and backend

---

## Part 1: Deploy Backend (5 minutes)

### Step 1: Login to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Backend
1. Click "Add New..." → "Project"
2. Find "request-management" repository
3. Click "Import"
4. **Project Name:** `request-management-backend`
5. **Root Directory:** Click "Edit" → Type `backend` → Continue
6. **Framework Preset:** Other
7. **Build Command:** `npm run build`
8. **Output Directory:** `dist`
9. **Install Command:** `npm install`

### Step 3: Add Environment Variables
Click "Add Environment Variable" for each:

| Name | Value | How to get |
|------|-------|------------|
| `JWT_SECRET` | (generate a random string) | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DATABASE_URL` | (leave empty for now) | Will be auto-filled when you create database |

### Step 4: Create Database
1. Click "Deploy" (it will fail, that's OK!)
2. Go to **Storage** tab
3. Click "Create Database"
4. Select **"Postgres"**
5. Name: `request-management-db`
6. Region: Choose closest to you
7. Click "Create"
8. ✅ DATABASE_URL will be automatically added to environment variables

### Step 5: Deploy Backend
1. Go to **Deployments** tab
2. Click "Redeploy" on the latest deployment
3. Click "Redeploy"
4. ✅ Wait 1-2 minutes for deployment to complete

### Step 6: Copy Backend URL
1. After successful deployment, copy the URL (e.g., `https://request-management-backend-abc123.vercel.app`)
2. **Save this URL** - you'll need it for frontend!

---

## Part 2: Deploy Frontend (3 minutes)

### Step 1: Import Frontend
1. Go back to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Find "request-management" again
4. Click "Import"
5. **Project Name:** `request-management` (or `request-management-frontend`)
6. **Root Directory:** Click "Edit" → Type `client` → Continue
7. **Framework Preset:** Vite
8. **Build Command:** `npm run build`
9. **Output Directory:** `dist`
10. **Install Command:** `npm install`

### Step 2: Add Environment Variable
Click "Add Environment Variable":

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app/api` (use the URL from Step 6 above) |

Example: `https://request-management-backend-abc123.vercel.app/api`

### Step 3: Deploy Frontend
1. Click "Deploy"
2. ✅ Wait 1-2 minutes for deployment

### Step 4: Update Backend CORS
1. Go back to backend project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - **Name:** `FRONTEND_URL`
   - **Value:** Your frontend URL (e.g., `https://request-management.vercel.app`)
4. Click "Add"
5. Go to "Deployments" → Click "Redeploy" on latest

---

## Part 3: Initialize Database (2 minutes)

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your backend project
cd backend
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migration
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma db push
```

### Option B: Manual (if CLI doesn't work)
1. Go to Vercel Dashboard → Backend project
2. Click "Settings" → "Environment Variables"
3. Copy `DATABASE_URL` value
4. On your local machine:
```bash
cd backend
# Add DATABASE_URL to .env temporarily
echo "DATABASE_URL=your-copied-url-here" > .env.temp
# Run migration
DATABASE_URL="$(cat .env.temp)" npx prisma db push
# Delete temp file
rm .env.temp
```

---

## ✅ Test Your Deployment

### Step 1: Test Backend
Open: `https://your-backend-url.vercel.app`
- You should see: `{"message":"Request Management API"}`

Open: `https://your-backend-url.vercel.app/api-docs`
- You should see Swagger UI

### Step 2: Test Frontend
1. Open: `https://your-frontend-url.vercel.app`
2. Click "Register"
3. Create a new user:
   - Email: `test@example.com`
   - Password: `Test123456`
   - Name: `Test User`
   - Role: `EMPLOYEE`
4. You should be logged in and see the dashboard

### Step 3: Test End-to-End
1. Click "New Request"
2. Fill the form and create a request
3. ✅ If it works, your deployment is complete!

---

## 🎉 Success!

Your app is now live:
- **Frontend:** `https://your-frontend-url.vercel.app`
- **Backend:** `https://your-backend-url.vercel.app`
- **API Docs:** `https://your-backend-url.vercel.app/api-docs`

---

## 🐛 Troubleshooting

### "CORS error" in browser console
**Fix:** Make sure you added `FRONTEND_URL` environment variable to backend and redeployed

### "Cannot connect to database"
**Fix:** Ensure DATABASE_URL is set in backend environment variables and database was created

### "404 Not Found" on backend routes
**Fix:** Check that `vercel.json` exists in backend folder with correct configuration

### Frontend shows "Network Error"
**Fix:** Verify `VITE_API_URL` is set correctly in frontend environment variables

---

## 📞 Need Help?

Check the full deployment guide: [DEPLOYMENT_VERCEL.md](DEPLOYMENT_VERCEL.md)

# Vercel Deployment Guide - Complete Step-by-Step

This guide will walk you through deploying both the **frontend** and **backend** to Vercel.

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ GitHub account with your code pushed
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Your repository public or accessible to Vercel

---

## 🚀 Part 1: Deploy Frontend to Vercel

### Step 1: Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"request-management"** repository
4. Click **"Import"** next to it

### Step 3: Configure Frontend Deployment

**Important:** You're deploying the `client` folder, not the root!

1. **Framework Preset:** Select **"Vite"** (Vercel should auto-detect this)

2. **Root Directory:** 
   - Click **"Edit"** next to Root Directory
   - Type: `client`
   - Click **"Continue"**

3. **Build Settings:**
   - Build Command: `npm run build` (should be pre-filled)
   - Output Directory: `dist` (should be pre-filled)
   - Install Command: `npm install` (should be pre-filled)

4. **Environment Variables:**
   - Click **"Add Environment Variable"**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.vercel.app/api` (we'll update this later)
   - Click **"Add"**

5. Click **"Deploy"**

### Step 4: Wait for Deployment

- Vercel will now build and deploy your frontend
- This usually takes **1-3 minutes**
- You'll see a progress screen with build logs
- ✅ When done, you'll see **"Congratulations!"** with confetti 🎉

### Step 5: Get Your Frontend URL

1. After deployment, you'll see your site URL (e.g., `https://request-management-xyz.vercel.app`)
2. **Copy this URL** - you'll need it later
3. Click **"Visit"** to see your deployed frontend

---

## 🔧 Part 2: Deploy Backend to Vercel

### Step 1: Prepare Backend for Vercel

First, we need to create a `vercel.json` configuration file for the backend.

**On your local machine:**

1. Open your terminal
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Create `vercel.json`:
   ```bash
   # On Windows
   type nul > vercel.json
   
   # On Mac/Linux
   touch vercel.json
   ```

4. Open `vercel.json` and paste this content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

5. Save the file

6. **Commit and push:**
   ```bash
   cd ..
   git add backend/vercel.json
   git commit -m "feat: add vercel config for backend deployment"
   git push origin main
   ```

### Step 2: Create Backend Project on Vercel

1. Go back to **Vercel Dashboard** (https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Find **"request-management"** again
4. Click **"Import"**

### Step 3: Configure Backend Deployment

1. **Project Name:** Change to `request-management-backend` (to differentiate)

2. **Root Directory:**
   - Click **"Edit"**
   - Type: `backend`
   - Click **"Continue"**

3. **Framework Preset:** Select **"Other"** (Express is not listed)

4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: Leave blank (or type `dist`)
   - Install Command: `npm install`

5. **Environment Variables** (CRITICAL):
   
   Click **"Add Environment Variable"** for each:
   
   | Name | Value |
   |------|-------|
   | `JWT_SECRET` | Your secret key (e.g., `production-secret-change-this-12345`) |
   | `DATABASE_URL` | We'll use a hosted PostgreSQL (see next section) |

6. Click **"Deploy"**

### Step 4: Database Setup (Important!)

⚠️ **SQLite doesn't work on Vercel** (serverless functions are stateless)

You have two options:

#### Option A: Use PostgreSQL (Recommended)

**Using Vercel Postgres:**

1. In your backend project on Vercel, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a name (e.g., `request-management-db`)
5. Click **"Create"**
6. Vercel will automatically add `DATABASE_URL` to your environment variables
7. **Update Prisma Schema:**
   
   In your local `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

8. Update your schema for PostgreSQL compatibility:
   ```prisma
   model User {
     id         String   @id @default(uuid())  // Change from cuid() to uuid()
     // ... rest of the fields
   }
   
   model Request {
     id         String   @id @default(uuid())  // Change from cuid() to uuid()
     // ... rest of the fields
   }
   ```

9. Commit and push:
   ```bash
   git add backend/prisma/schema.prisma
   git commit -m "feat: update schema for PostgreSQL"
   git push origin main
   ```

10. Vercel will auto-redeploy with the new schema

#### Option B: Use External PostgreSQL

Use services like:
- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Free tier available

1. Create a database on one of these platforms
2. Copy the `DATABASE_URL` (connection string)
3. Add it to Vercel environment variables

### Step 5: Run Database Migration

After setting up the database:

1. In Vercel dashboard, go to **"Settings"** → **"Environment Variables"**
2. Copy your `DATABASE_URL`
3. **On your local machine:**
   ```bash
   cd backend
   # Add the DATABASE_URL to your .env temporarily
   echo "DATABASE_URL=<paste-your-url-here>" >> .env
   
   # Run migration
   npx prisma db push
   
   # Or create a migration
   npx prisma migrate deploy
   ```

### Step 6: Get Your Backend URL

1. After deployment, you'll see your backend URL (e.g., `https://request-management-backend-xyz.vercel.app`)
2. **Copy this URL** - you need to update the frontend!
3. Test it: Open `https://your-backend-url.vercel.app` - you should see the API response

---

## 🔗 Part 3: Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

1. Go to your **frontend project** on Vercel dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Find `VITE_API_URL` and click **"Edit"**
4. Update value to: `https://your-backend-url.vercel.app/api`
5. Click **"Save"**

### Step 2: Update CORS on Backend

**On your local machine:**

1. Open `backend/src/app.ts`
2. Update CORS configuration:

```typescript
app.use(cors({
    origin: [
        'http://localhost:5173',  // Local development
        'https://your-frontend-url.vercel.app'  // Production
    ],
    credentials: true
}));
```

3. Commit and push:
```bash
git add backend/src/app.ts
git commit -m "feat: update CORS for production"
git push origin main
```

### Step 3: Redeploy Frontend

1. Go to your **frontend project** on Vercel
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Select **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

## ✅ Part 4: Test Your Deployed App

### Step 1: Open Your Frontend

1. Go to your frontend URL (e.g., `https://request-management-xyz.vercel.app`)
2. You should see the login page

### Step 2: Register a User

1. Click **"Register"** or go to `/register`
2. Fill in:
   - Email: `test@example.com`
   - Password: `Test123456`
   - Name: `Test User`
   - Role: `EMPLOYEE`
3. Click **"Register"**
4. You should be logged in and see the dashboard

### Step 3: Test API

1. Open Swagger docs: `https://your-backend-url.vercel.app/api-docs`
2. Try the **POST /api/auth/login** endpoint
3. If it works, your deployment is successful! 🎉

---

## 🔄 Future Updates

Every time you push to GitHub:

1. **Automatic Deployment:** Vercel automatically detects changes
2. **Build & Deploy:** Vercel rebuilds and deploys
3. **Preview URLs:** Each commit gets a unique preview URL

### Manual Redeploy

If you need to manually trigger a deployment:

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"** tab
4. Click **"Redeploy"** on any deployment

---

## 🐛 Troubleshooting

### "Module not found" errors

**Solution:** Check your `vercel.json` configuration and make sure the paths are correct.

### CORS errors in browser

**Solution:** Update `backend/src/app.ts` CORS settings to include your frontend URL.

### Database connection errors

**Solution:** 
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Make sure you ran `npx prisma db push` after setting up the database
3. Check Vercel logs: **Deployments** → Click on deployment → **"View Build Logs"**

### 404 on API routes

**Solution:** Check `vercel.json` routes configuration - should route all requests to your server file.

### Environment variables not working

**Solution:**
1. Make sure you added them in Vercel dashboard
2. Redeploy after adding variables
3. Variables only take effect after redeployment

---

## 📊 Monitoring Your Deployment

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"**
4. Click on a deployment
5. View **"Build Logs"** or **"Function Logs"**

### Analytics

1. Go to your project
2. Click **"Analytics"** tab
3. See visitor stats, response times, etc.

---

## 💰 Cost

**Vercel Free Tier includes:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Serverless functions

**Note:** If you exceed the free tier, you'll be prompted to upgrade.

---

## ✨ Next Steps

After successful deployment:

1. ✅ Share your deployed URL
2. ✅ Set up a custom domain (optional)
3. ✅ Enable analytics
4. ✅ Monitor usage and performance

---

**Congratulations! Your app is now live on Vercel! 🎉**

Frontend: `https://your-frontend-url.vercel.app`  
Backend: `https://your-backend-url.vercel.app`  
API Docs: `https://your-backend-url.vercel.app/api-docs`

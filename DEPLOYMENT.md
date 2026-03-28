# Vercel Deployment Guide

This guide will help you deploy the Mess Management System to Vercel and Railway/Render.

## Architecture

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway or Render (NestJS needs a Node.js server)
- **Database**: MongoDB Atlas (cloud)

---

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

### 2. Deploy Backend (Railway)

#### Option A: Using Railway

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Root Directory: `backend`
   - Click on the service
   - Go to "Settings"

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add the following:
   ```
   MONGODB_URI=mongodb+srv://rahatcse5bu:01783307672Rahat@cluster0.t9xf7li.mongodb.net/mess_management
   JWT_SECRET=mess_management_jwt_secret_key_2024_very_secure
   JWT_EXPIRES_IN=7d
   PORT=3000
   ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Note your deployment URL (e.g., `https://mess-backend.railway.app`)

#### Option B: Using Render

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: mess-management-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

4. **Add Environment Variables**
   - Click "Environment"
   - Add the same variables as Railway above

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL (e.g., `https://mess-backend.onrender.com`)

---

### 3. Deploy Frontend (Vercel)

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable**
   - Go to "Environment Variables"
   - Add:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-backend-url.railway.app
   ```
   Replace with your actual Railway/Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Your app will be live at `https://your-app.vercel.app`

---

## Alternative: Deploy Both on Vercel

If you want to try deploying the backend on Vercel as well (serverless):

### Backend on Vercel

1. Create a new Vercel project for backend
2. **Root Directory**: `backend`
3. Add all environment variables
4. Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Note**: NestJS on Vercel serverless has limitations. Railway/Render is recommended for backend.

---

## Post-Deployment Checklist

- [ ] Backend is accessible at your Railway/Render URL
- [ ] Frontend loads correctly on Vercel
- [ ] Test login with default credentials
- [ ] Create a test member
- [ ] Add a meal entry
- [ ] Check reports page
- [ ] Test cooking rotation

---

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_here` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `3000` |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.example.com` |

---

## Troubleshooting

### Backend fails to deploy
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check build logs in Railway/Render dashboard

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check CORS settings in backend (already configured)
- Ensure backend is running and accessible

### Database connection issues
- Check MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Verify username/password in connection string
- Ensure database user has read/write permissions

---

## Monitoring

### Railway
- View logs: Dashboard → Your Service → "Logs" tab
- Check metrics: Dashboard → "Metrics"

### Render
- View logs: Dashboard → Your Service → "Logs"
- Check events: Dashboard → "Events"

### Vercel
- View deployments: Dashboard → Your Project → "Deployments"
- Check logs: Click on a deployment → "Build Logs" or "Function Logs"

---

## Custom Domain (Optional)

### Vercel (Frontend)
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Railway (Backend)
1. Go to your service settings
2. Click "Settings" → "Networking"
3. Add custom domain
4. Update DNS records

---

## Updating Deployments

### Auto-Deploy (Recommended)
Both Vercel and Railway support auto-deployment:
- Push to `main` branch
- Services automatically rebuild and deploy

### Manual Deploy
- **Vercel**: Go to deployments → Click "Redeploy"
- **Railway**: Go to deployments → Click "Deploy"

---

## Cost Estimates

### Free Tier Limits
- **Vercel**: Unlimited hobby projects, 100GB bandwidth/month
- **Railway**: $5 free credit/month, then pay-as-you-go
- **Render**: 750 hours free/month for web services  **MongoDB Atlas**: 512MB free forever

---

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test backend API directly using Postman/curl
4. Check GitHub Issues
5. Contact: rahat.cse5.bu@gmail.com

---

**Happy Deploying! 🚀**

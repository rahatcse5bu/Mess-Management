# Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code is committed to Git
- [ ] `.gitignore` is properly configured
- [ ] Environment variables are documented in `.env.example` files
- [ ] Backend builds successfully (`cd backend && npm run build`)
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] MongoDB Atlas is configured and accessible

---

## 🚀 Backend Deployment (Railway)

- [ ] Sign up / Login to [Railway.app](https://railway.app)
- [ ] Create new project from GitHub repo
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `PORT`
- [ ] Deploy and wait for completion
- [ ] Test backend URL (e.g., `https://your-app.railway.app/auth/login`)
- [ ] Note down the backend URL

---

## 🎨 Frontend Deployment (Vercel)

- [ ] Sign up / Login to [Vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Configure project:
  - [ ] Framework: Vite
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_BASE_URL` = Your Railway backend URL
- [ ] Deploy and wait for completion
- [ ] Visit your Vercel URL
- [ ] Test the application

---

## 🧪 Post-Deployment Testing

- [ ] Open frontend URL
- [ ] Login with default credentials:
  - Email: `rahat.cse5.bu@gmail.com`
  - Password: `01783307672@Rahat`
- [ ] Navigate to Members page
- [ ] Add a test member
- [ ] Navigate to Meals page
- [ ] Add meal data for today
- [ ] Navigate to Cooking page
- [ ] Check cooker rotation
- [ ] Navigate to Purchases page
- [ ] Add a test purchase
- [ ] Navigate to Adjustments page
- [ ] Add a payment
- [ ] Navigate to Reports page
- [ ] Verify due calculations

---

## 🔧 Common Issues & Solutions

### Backend not connecting to MongoDB
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Verify database user credentials
- Check connection string format

### Frontend can't reach backend
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check CORS is enabled in backend (already configured)
- Ensure backend is running and accessible

### Build failures
- Check Node version (18+ required)
- Clear node_modules and reinstall
- Check for TypeScript errors

---

## 📝 Environment Variables Summary

### Backend (Railway/Render)
```
MONGODB_URI=mongodb+srv://rahatcse5bu:01783307672Rahat@cluster0.t9xf7li.mongodb.net/mess_management
JWT_SECRET=mess_management_jwt_secret_key_2024_very_secure
JWT_EXPIRES_IN=7d
PORT=3000
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

---

## 🎯 Success Criteria

- ✅ Backend is accessible and returns data
- ✅ Frontend loads without errors
- ✅ Login works successfully
- ✅ All CRUD operations work (Create, Read, Update, Delete)
- ✅ Reports display correct calculations
- ✅ Cooking rotation auto-assigns correctly

---

## 📞 Need Help?

- Read `DEPLOYMENT.md` for detailed instructions
- Check application logs in Railway/Vercel dashboards
- Email: rahat.cse5.bu@gmail.com

---

**Deployment Time Estimate: 15-20 minutes** ⏱️

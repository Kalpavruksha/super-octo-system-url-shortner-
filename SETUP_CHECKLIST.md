# ✅ Setup Checklist

## 📋 Pre-Launch Checklist

Follow this checklist to get your URL Shortener up and running!

### ✅ Step 1: Verify Installation
- [x] Node.js installed
- [x] npm packages installed (139 packages)
- [x] All project files created
- [x] Server can start (currently running)

### ⚠️ Step 2: MongoDB Atlas Setup (REQUIRED)
- [ ] MongoDB Atlas account created
- [ ] Free cluster created (M0 tier)
- [ ] Database user created (username: beshu, password: beshu)
- [ ] IP address whitelisted (0.0.0.0/0 for development)
- [ ] Connection string obtained
- [ ] `.env` file updated with connection string

**📖 See `MONGODB_SETUP.md` for detailed instructions**

### 🔧 Step 3: Configuration
- [x] `.env` file exists
- [ ] `MONGODB_URI` updated with your connection string
- [x] `JWT_SECRET` configured
- [x] `BASE_URL` set to http://localhost:3000
- [x] `PORT` set to 3000

### 🚀 Step 4: Launch
- [x] Server started (`npm run dev`)
- [ ] MongoDB connected successfully
- [ ] No errors in console
- [ ] Can access http://localhost:3000

### 🧪 Step 5: Test Basic Features
- [ ] Homepage loads correctly
- [ ] Can shorten a URL (guest mode)
- [ ] Short URL redirects to original URL
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Dashboard shows after login

### 🎯 Step 6: Test Advanced Features
- [ ] Can create URL with custom alias
- [ ] Can set expiry date
- [ ] Can view analytics
- [ ] Click tracking works
- [ ] Can delete URLs
- [ ] Can copy URLs to clipboard

## 🔍 Troubleshooting

### Issue: "querySrv ENOTFOUND" error
**Solution**: MongoDB connection string not updated in `.env`
1. Open `.env` file
2. Update `MONGODB_URI` with your actual connection string
3. Save the file
4. Server will auto-restart (nodemon)

### Issue: "Authentication failed"
**Solution**: Wrong MongoDB credentials
1. Check username and password in MongoDB Atlas
2. Update connection string with correct credentials
3. Make sure to replace `<password>` with actual password

### Issue: "IP not whitelisted"
**Solution**: Add your IP to MongoDB Atlas
1. Go to Network Access in MongoDB Atlas
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Issue: "Port 3000 already in use"
**Solution**: Change port or kill existing process
1. Option A: Change `PORT` in `.env` to 3001
2. Option B: Kill process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Issue: Page not loading
**Solution**: Check server is running
1. Look for "Server running on port 3000" in console
2. Check for any error messages
3. Try restarting: Ctrl+C then `npm run dev`

### Issue: "Module not found"
**Solution**: Reinstall dependencies
```bash
npm install
```

## 📝 Post-Setup Tasks

### Security (Before Production)
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update MongoDB password to something secure
- [ ] Restrict MongoDB IP whitelist to specific IPs
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Review rate limiting settings

### Customization
- [ ] Update logo in `index.html`
- [ ] Change color scheme in `style.css`
- [ ] Update meta tags for SEO
- [ ] Add favicon
- [ ] Customize email templates (if adding email)

### Deployment (Optional)
- [ ] Choose hosting platform (Heroku, Vercel, Railway, etc.)
- [ ] Set environment variables on hosting platform
- [ ] Update `BASE_URL` to production URL
- [ ] Deploy application
- [ ] Test production deployment
- [ ] Set up custom domain (optional)

## 🎓 Learning Resources

### MongoDB Atlas
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Getting Started Guide](https://docs.atlas.mongodb.com/getting-started/)

### JWT Authentication
- [JWT.io](https://jwt.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### Express.js
- [Express Documentation](https://expressjs.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Mongoose
- [Mongoose Documentation](https://mongoosejs.com/)
- [Schema Guide](https://mongoosejs.com/docs/guide.html)

## 📞 Need Help?

### Quick Reference Files
1. **`PROJECT_SUMMARY.md`** - Overview of everything
2. **`MONGODB_SETUP.md`** - Database setup guide
3. **`README.md`** - Full documentation
4. **`VISUAL_GUIDE.md`** - UI/UX guide
5. **This file** - Setup checklist

### Common Commands
```bash
# Start development server
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Check for updates
npm outdated
```

## 🎉 Success Criteria

You'll know everything is working when:
1. ✅ Server starts without errors
2. ✅ MongoDB connection successful
3. ✅ Homepage loads at http://localhost:3000
4. ✅ Can create and use short URLs
5. ✅ Can register and login
6. ✅ Dashboard shows your URLs
7. ✅ Analytics display correctly
8. ✅ No console errors

## 📊 Current Status

**Last Updated**: 2025-12-22 13:17

### ✅ Completed
- [x] Project structure created
- [x] All dependencies installed
- [x] Backend code complete
- [x] Frontend code complete
- [x] Server running
- [x] Documentation complete

### ⚠️ Pending
- [ ] MongoDB Atlas connection configured

**Next Action**: Update `.env` with MongoDB Atlas connection string

---

**Once MongoDB is connected, you're 100% ready to go! 🚀**

# 🚀 QUICK SETUP - Choose Your MongoDB Option

## ⚡ OPTION 1: Local MongoDB (FASTEST - 2 Minutes)

### ✅ Best for: Development, Testing, Learning

### Step 1: Install MongoDB Locally

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Run installer (keep default settings)
3. MongoDB will start automatically

**Or use Chocolatey:**
```bash
choco install mongodb
```

### Step 2: Update .env File

Open `.env` and change `MONGODB_URI` to:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/urlshortener
```

### Step 3: Start Server

```bash
npm run dev
```

**✅ DONE! No account needed, no internet required!**

---

## ☁️ OPTION 2: MongoDB Atlas (Cloud - 5 Minutes)

### ✅ Best for: Production, Sharing, Cloud Deployment

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free forever for M0 tier)

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `beshu`
4. Password: `beshu` (or your choice)
5. User Privileges: "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, use specific IPs only
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like:
   ```
   mongodb+srv://beshu:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

Open `.env` and update `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://beshu:beshu@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true&w=majority
```

**Important:**
- Replace `<password>` with your actual password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Add `/urlshortener` before the `?` to specify database name

### Step 7: Start Server

```bash
npm run dev
```

**✅ DONE!**

---

## 🔍 How to Know It's Working

When you run `npm run dev`, you should see:

```
🔌 Connecting to MongoDB: mongodb://127.0.0.1:27017/urlshortener
✅ MongoDB Connected: 127.0.0.1
🚀 Server running on port 3000
🌐 Base URL: http://localhost:3000
📊 Dashboard: http://localhost:3000
```

**✅ If you see "MongoDB Connected" → SUCCESS!**

**❌ If you see errors:**

### Error: "MONGODB_URI is not defined"
- **Fix**: Make sure `.env` file exists in project root
- **Fix**: Make sure `MONGODB_URI=...` is in `.env` (no quotes, no spaces)

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
- **Fix**: MongoDB is not running locally
- **Fix**: Start MongoDB service or use MongoDB Atlas instead

### Error: "querySrv ENOTFOUND"
- **Fix**: Wrong MongoDB Atlas connection string
- **Fix**: Check cluster URL in MongoDB Atlas dashboard

### Error: "Authentication failed"
- **Fix**: Wrong username/password in connection string
- **Fix**: Make sure password doesn't have special characters (or URL encode them)

---

## 🎯 Recommended Setup

**For this project, I recommend OPTION 1 (Local MongoDB):**

✅ **Faster** - No internet needed  
✅ **Simpler** - No account required  
✅ **Free** - No limits  
✅ **Private** - Data stays on your machine  

**Just update .env to:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/urlshortener
```

**And make sure MongoDB is installed and running!**

---

## 🆘 Still Having Issues?

### Quick Test: Is MongoDB Running?

**Windows:**
```bash
# Check if MongoDB service is running
sc query MongoDB

# Start MongoDB service
net start MongoDB
```

### Quick Test: Can You Connect?

Create a test file `test-mongo.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
```

Run it:
```bash
node test-mongo.js
```

---

## 📞 Need More Help?

1. Check `.env` file exists and has correct format
2. Make sure MongoDB is installed and running (for local)
3. Make sure connection string is correct (for Atlas)
4. Try the test script above
5. Check the error message carefully

**Common fixes:**
- Restart MongoDB service
- Restart your terminal
- Delete `node_modules` and run `npm install` again
- Make sure no firewall is blocking MongoDB

---

**Once connected, your URL Shortener is ready to use! 🎉**

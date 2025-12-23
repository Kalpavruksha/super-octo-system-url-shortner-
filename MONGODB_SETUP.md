# MongoDB Atlas Setup Instructions

## ⚠️ IMPORTANT: You need to update your MongoDB Atlas connection string!

### Steps to get your MongoDB Atlas connection string:

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign in** or create a free account
3. **Create a Cluster** (if you haven't already)
   - Choose the FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

4. **Create a Database User**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Username: `beshu`
   - Password: `beshu` (or your preferred password)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist Your IP**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

7. **Update .env file**:
   - Open `.env` file in the project root
   - Replace the `MONGODB_URI` value with your connection string
   - Replace `<password>` with your actual password
   - Add `/urlshortener` before the `?` to specify the database name
   
   Example:
   ```
   MONGODB_URI=mongodb+srv://:@cluster0.abc123.mongodb.net/urlshortener?retryWrites=true&w=majority
   ```

8. **Save the file** and restart the server

## Quick Start After Setup

```bash
# Start the development server
npm run dev

# Or start in production mode
npm start
```

The application will be available at: http://localhost:3000

## Troubleshooting

- **Connection Error**: Make sure your IP is whitelisted
- **Authentication Failed**: Check your username and password
- **Database Not Found**: The database will be created automatically on first connection
- **Network Error**: Check your internet connection

## Need Help?

If you encounter any issues, check:
1. MongoDB Atlas dashboard for cluster status
2. Network Access settings for IP whitelist
3. Database Access for user credentials
4. Connection string format in .env file

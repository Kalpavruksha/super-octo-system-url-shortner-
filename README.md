# 🔗 URL Shortener with Analytics

A modern, feature-rich URL shortener built with Node.js, Express, and MongoDB Atlas. Includes powerful analytics, JWT authentication, and automatic URL expiry management.

![URL Shortener](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)

## ✨ Features

- **🔗 URL Shortening**: Create short, memorable links with auto-generated or custom aliases
- **📊 Advanced Analytics**: Track clicks, referrers, user agents, and timestamps
- **⏰ URL Expiry**: Set expiration dates with automatic cleanup
- **🔐 JWT Authentication**: Secure user authentication and authorization
- **☁️ MongoDB Atlas**: Cloud-based database with automatic scaling
- **🎨 Beautiful UI**: Modern, responsive dashboard with glassmorphism design
- **🚀 Rate Limiting**: Built-in protection against abuse
- **📱 Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **Vanilla JavaScript** - No framework overhead
- **Modern CSS** - Gradients, animations, glassmorphism
- **Responsive Design** - Mobile-first approach

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd url-shortner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Update the `.env` file with your MongoDB Atlas credentials:

```env
PORT=3000
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://beshu:beshu@cluster0.mongodb.net/urlshortener?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=beshu-url-shortener-secret-key-2025
JWT_EXPIRE=7d

# Application Configuration
BASE_URL=http://localhost:3000
DEFAULT_EXPIRY_DAYS=30
```

**Important**: Replace the MongoDB URI with your actual MongoDB Atlas connection string!

### 4. Start the server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "beshu",
  "email": "beshu@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "beshu@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### URL Management Endpoints

#### Create Short URL
```http
POST /api/urls
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "originalUrl": "https://example.com/very-long-url",
  "customAlias": "my-link",  // optional
  "expiryDays": 30,          // optional
  "description": "My link"   // optional
}
```

#### Get User URLs
```http
GET /api/urls
Authorization: Bearer <token>
```

#### Get URL Analytics
```http
GET /api/urls/:shortCode/analytics
Authorization: Bearer <token>
```

#### Update URL
```http
PUT /api/urls/:shortCode
Content-Type: application/json
Authorization: Bearer <token>

{
  "isActive": true,
  "tags": ["marketing", "campaign"],
  "description": "Updated description"
}
```

#### Delete URL
```http
DELETE /api/urls/:shortCode
Authorization: Bearer <token>
```

### Redirect Endpoint

#### Redirect to Original URL
```http
GET /:shortCode
```

## 📊 Analytics Features

The application tracks comprehensive analytics for each URL:

- **Total Clicks**: Lifetime click count
- **Time-based Stats**: Last 24h, 7d, 30d
- **Referrer Tracking**: Where clicks are coming from
- **User Agent Tracking**: Browser and device information
- **Click Timeline**: Detailed click history with timestamps
- **Top Referrers**: Most common traffic sources

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Express-validator for request validation
- **CORS**: Configurable cross-origin resource sharing

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effects
- **Gradient Accents**: Beautiful color gradients
- **Smooth Animations**: Micro-interactions and transitions
- **Dark Theme**: Easy on the eyes
- **Responsive Layout**: Works on all screen sizes
- **Toast Notifications**: User-friendly feedback

## 📁 Project Structure

```
url-shortner/
├── config/
│   └── database.js          # MongoDB connection & cleanup
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── urlController.js     # URL management logic
│   └── redirectController.js # Redirect & click tracking
├── middleware/
│   ├── auth.js              # JWT middleware
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   └── Url.js               # URL schema with analytics
├── public/
│   ├── css/
│   │   └── style.css        # Styles
│   ├── js/
│   │   └── app.js           # Frontend logic
│   └── index.html           # Main page
├── routes/
│   ├── auth.js              # Auth routes
│   └── urls.js              # URL routes
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
└── server.js                # Entry point
```

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user (username: beshu, password: beshu)
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `.env`

### Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Token expiration time (e.g., 7d, 24h)
- `BASE_URL`: Base URL for short links
- `DEFAULT_EXPIRY_DAYS`: Default expiry for URLs (days)

## 🧹 Automatic Cleanup

The application automatically cleans up expired URLs every hour. This is configured in `config/database.js`.

## 🚀 Deployment

### Heroku

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

### Vercel / Netlify

Update `BASE_URL` in `.env` to your deployed URL.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**beshu**

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database
- Express.js team for the amazing framework
- All open-source contributors

---

Made with ❤️ by beshu
- Added quick start instructions

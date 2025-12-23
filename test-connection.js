// Test MongoDB Connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('='.repeat(60));
console.log('🧪 MongoDB Connection Test');
console.log('='.repeat(60));
console.log();

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
    console.log();
    console.log('📝 To fix this:');
    console.log('1. Make sure .env file exists in project root');
    console.log('2. Add this line to .env:');
    console.log('   MONGODB_URI=mongodb://127.0.0.1:27017/urlshortener');
    console.log();
    process.exit(1);
}

// Show the URI (hide password)
const uri = process.env.MONGODB_URI;
const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
console.log('🔌 Attempting to connect to:');
console.log(`   ${maskedUri}`);
console.log();

// Try to connect
console.log('⏳ Connecting...');
mongoose.connect(uri)
    .then(() => {
        console.log();
        console.log('✅ SUCCESS! MongoDB Connected');
        console.log(`   Host: ${mongoose.connection.host}`);
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log();
        console.log('🎉 Your MongoDB connection is working!');
        console.log('   You can now run: npm run dev');
        console.log();
        process.exit(0);
    })
    .catch(err => {
        console.log();
        console.error('❌ CONNECTION FAILED');
        console.error(`   Error: ${err.message}`);
        console.log();

        // Provide helpful suggestions based on error
        if (err.message.includes('ECONNREFUSED')) {
            console.log('💡 Possible solutions:');
            console.log('   1. MongoDB is not running locally');
            console.log('   2. Install MongoDB: https://www.mongodb.com/try/download/community');
            console.log('   3. Or use MongoDB Atlas (cloud): See QUICK_SETUP.md');
            console.log();
            console.log('   To start MongoDB on Windows:');
            console.log('   net start MongoDB');
        } else if (err.message.includes('querySrv') || err.message.includes('ENOTFOUND')) {
            console.log('💡 Possible solutions:');
            console.log('   1. Check your MongoDB Atlas connection string');
            console.log('   2. Make sure cluster URL is correct');
            console.log('   3. Check your internet connection');
            console.log('   4. See QUICK_SETUP.md for detailed setup');
        } else if (err.message.includes('Authentication failed')) {
            console.log('💡 Possible solutions:');
            console.log('   1. Check username and password in connection string');
            console.log('   2. Make sure user exists in MongoDB Atlas');
            console.log('   3. Check user has correct permissions');
        } else if (err.message.includes('MONGODB_URI is not defined')) {
            console.log('💡 Solution:');
            console.log('   1. Create .env file in project root');
            console.log('   2. Add: MONGODB_URI=mongodb://127.0.0.1:27017/urlshortener');
        } else {
            console.log('💡 See QUICK_SETUP.md for troubleshooting guide');
        }

        console.log();
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.log();
    console.error('⏱️  Connection timeout (10 seconds)');
    console.log('   This usually means MongoDB is not accessible');
    console.log('   See suggestions above');
    console.log();
    process.exit(1);
}, 10000);

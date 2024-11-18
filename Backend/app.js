const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

const app = express();

// ========================
// Middleware Configuration
// ========================
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// MongoDB Connection
// ========================
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process on database connection failure
    });

// ========================
// API Routes
// ========================
app.use('/auth', authRoutes); // Authentication routes
app.use('/cars', carRoutes); // Car management routes
//app.use('/api/cars', carRoutes); // Adjust the path as necessary

// ========================
// Default Route for Testing
// ========================
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ========================
// Start the Server
// ========================
const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

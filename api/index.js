const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const uploadRoute = require('./routes/upload.route');
const listingRoute = require('./routes/listing.route');

const connectDB = require('./db/db');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/listing', listingRoute);


// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
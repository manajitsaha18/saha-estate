const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const connectDB = require("./db/db");

const app = express();

// Config dotenv
dotenv.config();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});



app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const connectDB = require("./db/db");

const app = express();

// Middleware
app.use(express.json());

dotenv.config();

connectDB();

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
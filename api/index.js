const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./db/db");

const app = express();

dotenv.config();

connectDB();

app.get("/", (req, res) => {
    res.send("Home page");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
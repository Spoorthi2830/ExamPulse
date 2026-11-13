
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();

const authRoutes = require("./routers/authRoutes");
const reportRoutes = require("./routers/reportRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.json({
        application: "ExamPulse",
        message: "Exam Hall Irregularity Reporter",
        status: "Backend running successfully"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

app.use((error, req, res, next) => {
    res.status(400).json({
        success: false,
        message: error.message || "Request failed"
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`ExamPulse running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();


const mongoose = require("mongoose");

const invigilatorSchema = new mongoose.Schema({
    invigilatorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    branch: {
        type: String,
        enum: ["CSE", "ISE", "ECE", "EEE", "ME", "CIV", "AIML"],
        required: true
    },
    active: { type: Boolean, default: true },
    failedAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Invigilator", invigilatorSchema);

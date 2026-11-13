
const mongoose = require("mongoose");

const handlerSchema = new mongoose.Schema({
    handlerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    authority: {
        type: String,
        enum: [
            "Chief Superintendent",
            "Centre Superintendent",
            "Controller of Examinations"
        ],
        required: true
    },
    zone: { type: String, required: true },
    branch: {
        type: String,
        enum: ["CSE", "ISE", "ECE", "EEE", "ME", "CIV", "AIML"],
        required: true
    },
    available: { type: Boolean, default: true },
    currentLoad: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, default: 5, min: 1 },
    isBackup: { type: Boolean, default: false },
    backupFor: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Handler", handlerSchema);

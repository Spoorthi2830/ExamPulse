
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    invigilatorId: { type: String, required: true },
    examinationName: { type: String, required: true },
    examinationDate: { type: Date, required: true },
    session: { type: String, required: true },
    examinationHall: { type: String, required: true },
    roomNumber: { type: String, required: true },
    seatNumber: { type: String, default: "" },
    branch: {
        type: String,
        enum: ["CSE", "ISE", "ECE", "EEE", "ME", "CIV", "AIML"],
        required: true
    },
    irregularityCode: { type: String, required: true },
    category: { type: String, required: true },
    zone: { type: String, required: true },
    tier: { type: Number, required: true },
    priority: { type: Number, required: true },
    incidentTime: { type: String, required: true },
    description: { type: String, required: true },
    attachment: { type: String, default: null },
    assignedHandler: { type: String, default: null },
    assignedAuthority: { type: String, default: null },
    assignmentType: { type: String, default: null },
    status: {
        type: String,
        enum: [
            "PENDING",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
            "PENDING_ESCALATION"
        ],
        default: "PENDING"
    },
    isEmergency: { type: Boolean, default: false },
    assignedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);

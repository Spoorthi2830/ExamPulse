
const Report = require("../models/Report");
const Handler = require("../models/Handler");
const { validateReport } = require("../algorithms/validator");
const { classifyReport } = require("../algorithms/classifier");
const { IR_ROUTING, BRANCHES } = require("../config/branches");
const { dispatchReport } = require("../algorithms/dispatcher");
const { scheduleReports } = require("../algorithms/scheduler");

async function createReport(req, res) {
    try {
        const {
            examinationName,
            examinationDate,
            session,
            examinationHall,
            roomNumber,
            seatNumber,
            irregularityCode,
            incidentTime,
            description,
            isEmergency = false
        } = req.body;

        const invigilatorId = req.user.invigilatorId;
        const branch = String(req.body.branch || "").toUpperCase();

        const required = [
            examinationName,
            examinationDate,
            session,
            examinationHall,
            roomNumber,
            irregularityCode,
            incidentTime,
            description
        ];

        if (required.some(value => value === undefined || value === "")) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required report details"
            });
        }

        if (typeof isEmergency !== "boolean" &&
            isEmergency !== "true" && isEmergency !== "false") {
            return res.status(400).json({
                success: false,
                message: "Invalid emergency flag"
            });
        }

        const emergency = isEmergency === true || isEmergency === "true";

        const validation = validateReport(
            invigilatorId,
            irregularityCode
        );

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message,
                validation
            });
        }

        if (!BRANCHES.some(item => item.code === branch)) {
            return res.status(400).json({
                success: false,
                message: "Invalid invigilator branch"
            });
        }

        const classification = classifyReport(irregularityCode);

        if (!classification.success) {
            return res.status(400).json(classification);
        }

        const routing = IR_ROUTING[irregularityCode.toUpperCase()];

        const duplicate = await Report.findOne({
            invigilatorId,
            irregularityCode,
            examinationName,
            examinationDate: new Date(examinationDate),
            roomNumber,
            description,
            status: { $ne: "RESOLVED" }
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "Duplicate report detected",
                existingReportId: duplicate._id
            });
        }

        const report = new Report({
            invigilatorId,
            examinationName,
            examinationDate,
            session,
            examinationHall,
            roomNumber,
            seatNumber: seatNumber || "",
            branch,
            irregularityCode: irregularityCode.toUpperCase(),
            category: routing.category,
            zone: routing.zone,
            tier: routing.tier,
            priority: routing.priority,
            incidentTime,
            description,
            attachment: req.file ? `/uploads/${req.file.filename}` : null,
            isEmergency: emergency,
            status: "PENDING"
        });

        const handlers = await Handler.find({
            zone: routing.zone,
            branch,
            authority: routing.authority
        });

        const result = dispatchReport(report, handlers);

        if (result.success) {
            await Promise.all(handlers.map(handler => handler.save()));
        }

        await report.save();

        res.status(201).json({
            success: true,
            message: "Report processed successfully",
            report,
            dispatch: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to process report",
            error: error.message
        });
    }
}

async function getReports(req, res) {
    try {
        const reports = await Report.find({
            invigilatorId: req.user.invigilatorId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getReportById(req, res) {
    try {
        const report = await Report.findOne({
            _id: req.params.id,
            invigilatorId: req.user.invigilatorId
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        res.json({ success: true, report });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid report ID"
        });
    }
}

async function updateReportStatus(req, res) {
    try {
        const { status } = req.body;

        if (!["IN_PROGRESS", "RESOLVED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        if (!report.assignedHandler) {
            return res.status(400).json({
                success: false,
                message: "Report must be assigned first"
            });
        }

        report.status = status;
        await report.save();

        if (status === "RESOLVED") {
            await Handler.findOneAndUpdate(
                { handlerId: report.assignedHandler },
                { $inc: { currentLoad: -1 } }
            );
        }

        res.json({
            success: true,
            message: "Report status updated",
            report
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getHandlers(req, res) {
    try {
        const handlers = await Handler.find({
            zone: req.query.zone,
            branch: req.query.branch
        });

        res.json({ success: true, handlers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getScheduledQueue(req, res) {
    try {
        const reports = await Report.find({
            status: "PENDING"
        });

        res.json({
            success: true,
            queue: scheduleReports(reports)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createReport,
    getReports,
    getReportById,
    updateReportStatus,
    getHandlers,
    getScheduledQueue
};

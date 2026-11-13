
const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createReport,
    getReports,
    getReportById,
    updateReportStatus,
    getHandlers,
    getScheduledQueue
} = require("../controllers/reportController");

router.use(authenticate);

router.post("/", upload.single("attachment"), createReport);
router.get("/", getReports);
router.get("/handlers", getHandlers);
router.get("/queue", getScheduledQueue);
router.get("/:id", getReportById);
router.patch("/:id/status", updateReportStatus);

module.exports = router;

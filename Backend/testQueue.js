
const { dispatchQueue } = require("./algorithms/dispatcher");

const handlers = [
    {
        id: "H001",
        authority: "Chief Superintendent",
        available: true,
        currentLoad: 0,
        capacity: 5
    },
    {
        id: "H002",
        authority: "Centre Superintendent",
        available: true,
        currentLoad: 0,
        capacity: 5
    }
];

const reports = [
    {
        id: "R001",
        category: "Technical",
        isEmergency: false,
        status: "PENDING",
        createdAt: new Date("2026-11-13T10:00:00")
    },
    {
        id: "R002",
        category: "Medical",
        isEmergency: true,
        status: "PENDING",
        createdAt: new Date("2026-11-13T10:05:00")
    }
];

const results = dispatchQueue(reports, handlers);

console.log("Dispatch order:");

results.forEach(item => {
    console.log(item.reportId, item.result.status);
});

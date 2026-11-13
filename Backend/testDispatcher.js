
const { dispatchReport } = require("./algorithms/dispatcher");

const handlers = [
    {
        id: "H001",
        authority: "Chief Superintendent",
        available: false,
        currentLoad: 0,
        capacity: 5
    },
    {
        id: "H002",
        authority: "Centre Superintendent",
        available: true,
        currentLoad: 1,
        capacity: 5,
        backupFor: ["Chief Superintendent"]
    }
];

const report = {
    id: "R002",
    category: "Malpractice",
    status: "PENDING",
    createdAt: new Date()
};

const result = dispatchReport(report, handlers);

console.log("Dispatch result:", result);
console.log("Updated report:", report);
console.log("Updated handlers:", handlers);

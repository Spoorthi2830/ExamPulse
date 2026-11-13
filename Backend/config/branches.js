
const BRANCHES = [
    { code: "CSE", name: "Computer Science and Engineering" },
    { code: "ISE", name: "Information Science and Engineering" },
    { code: "ECE", name: "Electronics and Communication Engineering" },
    { code: "EEE", name: "Electrical and Electronics Engineering" },
    { code: "ME", name: "Mechanical Engineering" },
    { code: "CIV", name: "Civil Engineering" },
    { code: "AIML", name: "Artificial Intelligence and Machine Learning" }
];

const IR_ROUTING = {
    IR01: {
        category: "Malpractice",
        zone: "ZONE01",
        tier: 1,
        authority: "Chief Superintendent",
        priority: 4
    },
    IR02: {
        category: "Medical",
        zone: "ZONE01",
        tier: 1,
        authority: "Chief Superintendent",
        priority: 5
    },
    IR03: {
        category: "Technical",
        zone: "ZONE02",
        tier: 2,
        authority: "Centre Superintendent",
        priority: 3
    },
    IR04: {
        category: "Disturbance",
        zone: "ZONE02",
        tier: 2,
        authority: "Centre Superintendent",
        priority: 4
    },
    IR05: {
        category: "Missing-Script",
        zone: "ZONE03",
        tier: 3,
        authority: "Controller of Examinations",
        priority: 5
    }
};

module.exports = { BRANCHES, IR_ROUTING };

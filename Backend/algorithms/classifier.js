
const { IR_ROUTING } = require("../config/branches");

const CATEGORY_CODES = Object.fromEntries(
    Object.entries(IR_ROUTING).map(([code, data]) => [
        code,
        data.category
    ])
);

const CATEGORY_PRIORITY = Object.fromEntries(
    Object.entries(IR_ROUTING).map(([code, data]) => [
        data.category,
        data.priority
    ])
);

function classifyReport(irregularityCode) {
    const code = String(irregularityCode || "").trim().toUpperCase();
    const routing = IR_ROUTING[code];

    if (!routing) {
        return {
            success: false,
            category: null,
            priority: null,
            message: "Unknown or unsupported irregularity code"
        };
    }

    return {
        success: true,
        code,
        category: routing.category,
        zone: routing.zone,
        tier: routing.tier,
        authority: routing.authority,
        priority: routing.priority,
        message: "Report classified successfully"
    };
}

module.exports = {
    CATEGORY_CODES,
    CATEGORY_PRIORITY,
    classifyReport
};

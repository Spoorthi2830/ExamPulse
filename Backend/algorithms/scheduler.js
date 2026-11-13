
function scheduleReports(reports) {
    return [...reports].sort((a, b) => {
        const priorityDifference = b.priority - a.priority;

        if (priorityDifference !== 0) {
            return priorityDifference;
        }

        return new Date(a.createdAt) - new Date(b.createdAt);
    });
}

module.exports = { scheduleReports };


function hasCapacity(handler) {
    return handler.available === true &&
        handler.currentLoad < handler.capacity;
}

function selectHandler(handlers) {
    return [...handlers].sort((a, b) =>
        a.currentLoad - b.currentLoad ||
        a.handlerId.localeCompare(b.handlerId)
    )[0];
}

function dispatchReport(report, handlers) {
    if (report.assignedHandler) {
        return {
            success: false,
            message: "Duplicate assignment prevented"
        };
    }

    const authority = report.authority;

    if (!authority || !report.zone || !report.branch) {
        return {
            success: false,
            message: "Authority, zone and branch are required"
        };
    }

    let eligible = handlers.filter(handler =>
        handler.authority === authority &&
        handler.zone === report.zone &&
        handler.branch === report.branch &&
        handler.isBackup !== true &&
        hasCapacity(handler)
    );

    let assignmentType = "PRIMARY";

    if (eligible.length === 0) {
        eligible = handlers.filter(handler =>
            handler.authority === authority &&
            handler.zone === report.zone &&
            handler.branch === report.branch &&
            handler.isBackup === true &&
            Array.isArray(handler.backupFor) &&
            handler.backupFor.includes(authority) &&
            hasCapacity(handler)
        );

        assignmentType = "BACKUP";
    }

    if (eligible.length === 0) {
        report.status = "PENDING_ESCALATION";
        report.assignedAuthority = authority;

        return {
            success: false,
            authority,
            status: "PENDING_ESCALATION",
            message: "No matching personnel available"
        };
    }

    const selected = selectHandler(eligible);

    selected.currentLoad++;

    report.assignedHandler = selected.handlerId;
    report.assignedAuthority = authority;
    report.assignmentType = assignmentType;
    report.status = "ASSIGNED";
    report.assignedAt = new Date();

    return {
        success: true,
        handler: selected.handlerId,
        authority,
        zone: report.zone,
        branch: report.branch,
        assignmentType,
        status: "ASSIGNED",
        message: `${assignmentType} handler assigned successfully`
    };
}

module.exports = { dispatchReport };

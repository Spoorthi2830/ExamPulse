
const INVIGILATOR_REGEX = /^INV[A-Z]+\d{4}$/;
const IRREGULARITY_REGEX = /^IR\d{2}$/;

// DFA simulation for Invigilator ID
function validateInvigilatorDFA(id) {
    let state = 0;

    for (const char of id) {
        switch (state) {
            case 0:
                state = char === "I" ? 1 : -1;
                break;

            case 1:
                state = char === "N" ? 2 : -1;
                break;

            case 2:
                state = char === "V" ? 3 : -1;
                break;

            case 3:
                state = /[A-Z]/.test(char) ? 3 :
                        /[0-9]/.test(char) ? 4 : -1;
                break;

            case 4:
                state = /[0-9]/.test(char) ? 4 : -1;
                break;
        }

        if (state === -1) return false;
    }

    // At least one department letter and exactly four digits
    return state === 4 &&
        /^INV[A-Z]+\d{4}$/.test(id);
}

function validateReport(invigilatorId, irregularityCode) {
    const dfaValid = validateInvigilatorDFA(invigilatorId);

    const regexValid =
        INVIGILATOR_REGEX.test(invigilatorId) &&
        IRREGULARITY_REGEX.test(irregularityCode);

    return {
        valid: dfaValid && regexValid,
        dfaValid,
        regexValid,
        message: dfaValid && regexValid
            ? "Report identifiers are valid"
            : "Invalid invigilator ID or irregularity code"
    };
}

module.exports = {
    validateInvigilatorDFA,
    validateReport
};

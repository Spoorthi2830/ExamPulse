
const Invigilator = require("../models/Invigilator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
    try {
        const { invigilatorId, password } = req.body;

        if (!invigilatorId || !password) {
            return res.status(400).json({
                success: false,
                message: "Invigilator ID and password are required"
            });
        }

        const user = await Invigilator.findOne({ invigilatorId });

        if (!user || !user.active) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials"
            });
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(423).json({
                success: false,
                message: "Account locked after three failed attempts"
            });
        }

        if (user.lockedUntil && user.lockedUntil <= new Date()) {
            user.failedAttempts = 0;
            user.lockedUntil = null;
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            user.failedAttempts++;

            if (user.failedAttempts >= 3) {
                user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }

            await user.save();

            return res.status(401).json({
                success: false,
                attemptsRemaining: Math.max(0, 3 - user.failedAttempts),
                message: user.failedAttempts >= 3
                    ? "Account locked for 15 minutes"
                    : "Incorrect password"
            });
        }

        user.failedAttempts = 0;
        user.lockedUntil = null;
        await user.save();

        const token = jwt.sign(
            {
                invigilatorId: user.invigilatorId,
                branch: user.branch
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            invigilator: {
                invigilatorId: user.invigilatorId,
                name: user.name,
                branch: user.branch
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
}

module.exports = { login };

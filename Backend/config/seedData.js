
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Handler = require("../models/Handler");
const Invigilator = require("../models/Invigilator");
const { BRANCHES } = require("./branches");

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const authorities = [
            "Chief Superintendent",
            "Centre Superintendent",
            "Controller of Examinations"
        ];

        const zones = ["ZONE01", "ZONE02", "ZONE03"];
        const handlers = [];

        for (const zone of zones) {
            for (const branch of BRANCHES) {
                for (const authority of authorities) {
                    const prefix = authority === "Chief Superintendent"
                        ? "CS"
                        : authority === "Centre Superintendent"
                            ? "CENT"
                            : "COE";

                    const id = `${prefix}-${zone}-${branch.code}`;

                    handlers.push({
                        handlerId: id,
                        name: `Demo ${authority} ${branch.code}`,
                        authority,
                        zone,
                        branch: branch.code,
                        available: true,
                        currentLoad: 0,
                        capacity: 5,
                        isBackup: false
                    });

                    handlers.push({
                        handlerId: `BACKUP-${id}`,
                        name: `Demo Backup ${branch.code}`,
                        authority,
                        zone,
                        branch: branch.code,
                        available: true,
                        currentLoad: 0,
                        capacity: 3,
                        isBackup: true,
                        backupFor: [authority]
                    });
                }
            }
        }

        await Handler.deleteMany({});
        await Handler.insertMany(handlers);

        const passwordHash = await bcrypt.hash("ExamPulse@123", 10);

        await Invigilator.findOneAndUpdate(
            { invigilatorId: "INVCS1234" },
            {
                invigilatorId: "INVCS1234",
                name: "Demo Invigilator",
                password: passwordHash,
                branch: "CSE",
                active: true,
                failedAttempts: 0
            },
            { upsert: true, new: true }
        );

        console.log("ExamPulse prototype data seeded.");
        console.log("Demo login: INVCS1234");
        console.log("Demo password: ExamPulse@123");
    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedData();

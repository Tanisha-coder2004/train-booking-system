const mongoose = require("mongoose");
require("dotenv").config();
const Train = require("../src/modules/train/train.model");

const stations = [
    "New Delhi", "Mumbai Central", "Mumbai CST", "Chennai Central",
    "Howrah", "Bangalore City", "Pune Junction", "Hyderabad",
    "Ahmedabad", "Lucknow", "Patna", "Guwahati", "Jaipur", "Kochi"
];

const trainTypes = [
    { name: "Rajdhani Express", prefix: "124", classes: ["1A", "2A", "3A"] },
    { name: "Shatabdi Express", prefix: "120", classes: ["CC", "EC"] },
    { name: "Duronto Express", prefix: "122", classes: ["1A", "2A", "3A", "SL"] },
    { name: "Vande Bharat", prefix: "224", classes: ["CC", "EC"] },
    { name: "Garib Rath", prefix: "129", classes: ["3A"] },
    { name: "Humsafar Express", prefix: "223", classes: ["3A"] },
    { name: "Superfast Express", prefix: "128", classes: ["2A", "3A", "SL"] },
    { name: "Jan Shatabdi", prefix: "120", classes: ["CC", "2S"] },
    { name: "Mail Express", prefix: "110", classes: ["3A", "SL"] }
];

const generateInventory = (trainClasses) => {
    const inv = {};
    trainClasses.forEach((cls) => {
        let price = 0;
        let available = Math.floor(Math.random() * 80) + 20;
        switch (cls) {
            case "SL": price = 480 + Math.floor(Math.random() * 150); break;
            case "3A": price = 1150 + Math.floor(Math.random() * 300); break;
            case "2A": price = 1650 + Math.floor(Math.random() * 500); break;
            case "1A": price = 2600 + Math.floor(Math.random() * 800); break;
            case "CC": price = 750 + Math.floor(Math.random() * 200); break;
            case "EC": price = 1450 + Math.floor(Math.random() * 400); break;
            case "2S": price = 180 + Math.floor(Math.random() * 50); break;
        }
        inv[cls] = { available, price };
    });
    return inv;
};

const getDates = (daysCount = 10) => {
    const dates = [];
    const baseDate = new Date("2026-04-24");
    for (let i = 0; i < daysCount; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
};

const seed = async () => {
    try {
        console.log("Connecting to MongoDB...");
        // Fallback to localhost if ENV is missing for some reason
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Train-Ticket-Booking-System";
        await mongoose.connect(uri);
        console.log(`Connected to ${uri}. Clearing existing trains...`);
        await Train.deleteMany({});

        const dates = getDates(10);
        const trainsToInsert = [];

        // Major city pairs for guaranteed density
        const hubs = ['New Delhi', 'Mumbai Central', 'Mumbai CST', 'Chennai Central', 'Howrah', 'Bangalore City'];
        
        for (const date of dates) {
            console.log(`Generating trains for ${date}...`);
            
            for (let i = 0; i < stations.length; i++) {
                for (let j = 0; j < stations.length; j++) {
                    if (i === j) continue;
                    
                    const src = stations[i];
                    const dest = stations[j];

                    // Higher density for hubs, normal for others
                    const isHubPair = hubs.includes(src) && hubs.includes(dest);
                    const trainCount = isHubPair ? (3 + Math.floor(Math.random() * 3)) : (Math.random() > 0.7 ? 1 : 0);

                    for (let k = 0; k < trainCount; k++) {
                        const type = trainTypes[Math.floor(Math.random() * trainTypes.length)];
                        const trainNumber = type.prefix + Math.floor(Math.random() * 999).toString().padStart(3, "0");
                        
                        // Spread trains throughout the day
                        const depH = (6 + (k * 4) + Math.floor(Math.random() * 3)) % 24;
                        const depM = [0, 5, 15, 30, 45][Math.floor(Math.random() * 5)];
                        const departure = `${depH.toString().padStart(2, "0")}:${depM.toString().padStart(2, "0")}`;
                        
                        const durH = 2 + Math.floor(Math.random() * 20);
                        const durM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
                        const duration = `${durH}h ${durM}m`;

                        let arrH = (depH + durH) % 24;
                        let arrM = (depM + durM) % 60;
                        const arrival = `${arrH.toString().padStart(2, "0")}:${arrM.toString().padStart(2, "0")}`;

                        trainsToInsert.push({
                            id: `t-${date}-${trainNumber}-${i}-${j}-${k}`,
                            number: trainNumber,
                            name: `${type.name}`,
                            src,
                            dest,
                            date,
                            departure,
                            arrival,
                            duration,
                            inventory: generateInventory(type.classes)
                        });
                    }
                }
            }
        }

        console.log(`Inserting ${trainsToInsert.length} realistic trains...`);
        // Batch insert for performance
        const chunkSize = 100;
        for (let i = 0; i < trainsToInsert.length; i += chunkSize) {
            const chunk = trainsToInsert.slice(i, i + chunkSize);
            await Train.insertMany(chunk);
            console.log(`Progress: ${Math.min(i + chunkSize, trainsToInsert.length)} / ${trainsToInsert.length}`);
        }

        console.log("Seeding completed successfully!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seed();

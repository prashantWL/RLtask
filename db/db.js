const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connected");
    }
    catch (err) {
        console.error("Database connection failed");
        throw err;
    }
}

module.exports = {connect};
const express = require("express");
const dotenv = require("dotenv");
const path = require('path');

const db = require("../db/db")

// Import routes
const programRoutes = require('../routes/programs');
const userRoutes = require('../routes/users');
const progressRoutes = require('../routes/progress');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Use routes
app.use('/api/programs', programRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);

async function startServer() {
    try {
        await db.connect();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    }
    catch (error) {
        console.error("Could not start server");
        throw err;
    }
}

startServer();
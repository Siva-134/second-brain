const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');
const { mongoose } = require('mongoose');
const cors = require('cors');

app.use(cors({
    origin: function(origin, callback) {
        // Allow all origins for now to avoid CORS issues during initial deployment
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', userRoutes);
app.use('/api/v1', contentRoutes);
app.use('/api/v1', require('./routes/brain'));

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/secondbrain";

mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}...`);
    })
})
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

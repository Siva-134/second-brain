const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');
const { mongoose } = require('mongoose');
const cors = require('cors');
const compression = require('compression');

app.use(compression());

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
app.use('/api/v1', require('./routes/project'));

// Health check endpoint for Uptime Monitors
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'active', timestamp: new Date() });
});

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
    
    // Keep-Alive Mechanism: Ping itself every 10 minutes to prevent Render from sleeping
    // Only effective if the server is already running.
    const PRODUCTION_URL = "https://second-brain-2-gwgk.onrender.com/health";
    
    // Check if we are in production (you might want to use an env var for this logic)
    // For now, we'll just run it if we can access the internet.
    if (process.env.NODE_ENV === 'production' || PRODUCTION_URL.includes('onrender')) {
        setInterval(() => {
            console.log("Pinging self to keep alive...");
            fetch(PRODUCTION_URL)
                .then(res => console.log(`Self-ping status: ${res.status}`))
                .catch(err => console.error("Self-ping failed:", err.message));
        }, 10 * 60 * 1000); // 10 minutes
    }

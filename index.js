const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');
const { mongoose } = require('mongoose');
const cors = require('cors');

app.use(cors({
    origin: function(origin, callback) {
        // Debugging log to see what origin is being received
        console.log('CORS Origin Check:', origin);

        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // allow any localhost/127.0.0.1 origin for development ease
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            // Explicitly return the origin string to ensure the header is set correctly
            return callback(null, origin);
        }
        
        // Block other origins
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
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

mongoose.connect("mongodb://localhost:27017/secondbrain").then(() => {
    app.listen(3000, () => {
        console.log("server running on 3000...");
    })
})
    .catch((err) => {
        console.log(err);
    });

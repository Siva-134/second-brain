const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');
const { mongoose } = require('mongoose');

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', userRoutes);
app.use('/api/v1', contentRoutes);

mongoose.connect("mongodb://localhost:27017/secondbrain").then(() => {
    app.listen(3000, () => {
        console.log("server running on 3000...");
    })
})
    .catch((err) => {
        console.log(err);
    });

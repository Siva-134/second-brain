const mongoose = require('mongoose');
const Tag = require('./tag');
const User = require('./user');


const contentSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'audio', 'video', 'article'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;

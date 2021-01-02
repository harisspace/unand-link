const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const shortId = require('shortid');

const linkSchema = new Schema({
    fullLink: {
        required: true,
        type: String
    },
    shortLink: {
        type: String,
        required: true,
        default: shortId.generate,
        unique: true,
        lowercase: true
    },
    author: {
        type: String,
        required: true,
        default: 'haris'
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
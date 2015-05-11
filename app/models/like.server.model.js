'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Like Schema
 */
var LikeSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: Schema.ObjectId,
        ref: 'Status'
    }
});

mongoose.model('Like', LikeSchema);

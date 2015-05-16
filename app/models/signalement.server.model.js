'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Signalement Schema
 */
var SignalementSchema = new Schema({
    motif: {
        type: String,
        default: '',
        required: '',
        trim: true
    },
    contenu: {
        type: Schema.ObjectId,
        ref: 'Contenu'
    },
    user_signaler: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Signalement', SignalementSchema);

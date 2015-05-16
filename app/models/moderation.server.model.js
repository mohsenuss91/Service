'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Moderation Schema
 */
var ModerationSchema = new Schema({
	modere: {
		type: Boolean,
		default: '',
		required: '',
		trim: true
	},
    moderer_par: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	date_moderation: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Moderation', ModerationSchema);

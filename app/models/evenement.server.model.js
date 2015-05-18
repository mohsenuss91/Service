'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Evenement Schema
 */
var EvenementSchema = new Schema({
    titre: {
		type: String,
		default: '',
		required: '',
		trim: true
	},
    description: {
        type: String,
        default: '',
        required: '',
        trim: true
    },
    date: {
        type: Date,
        default: '',
        required: '',
        trim: true
    },
    lieu: {
        type: String,
        default: '',
        required: '',
        trim: true
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

mongoose.model('Evenement', EvenementSchema);

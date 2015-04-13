'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pub imag Schema
 */
var PubImagSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pub imag name',
		trim: true
	},
    comment:{
        type: String,
        default: '',
        required: 'Please fill Pub imag comment',
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

mongoose.model('PubImag', PubImagSchema);

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contenu Schema
 */
var ContenuSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Contenu name',
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

mongoose.model('Contenu', ContenuSchema);
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
mongooseFS = require('mongoose-fs'),
	Schema = mongoose.Schema;

/**
 * Test Schema
 */
var TestSchema = new Schema({
	name: String,
    size: Number,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

TestSchema.plugin(mongooseFS, {keys: ['content', 'complement'], mongoose: mongoose});
mongoose.model('Test', TestSchema);

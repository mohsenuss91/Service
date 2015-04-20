'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var mongooseFS = require('mongoose-fs');

/**
 * Pub video Schema
 */
var PubVideoSchema = new Schema({
    file:{
        name: {
            type: String,
            default: '',
            required: 'Please fill Pub video name',
            trim: true
        },
        size:{
            type: Number,
            default: '',
            required: 'Please fill Pub video name',
            trim: true
        },
        content:{
            type: String,
            default: '',
            required: 'Please fill Pub video name',
            trim: true
        }
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Pub video name',
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

PubVideoSchema.plugin(mongooseFS, {keys: ['content', 'complement'], mongoose: mongoose});

mongoose.model('PubVideo', PubVideoSchema);

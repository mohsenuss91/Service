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
    id_file_original:
    {
        type: mongoose.Schema.Types.ObjectId
    },
    video_data_thumbnail:
    {
        type: String,
        default: '',
        required: 'Please fill Pub imag description',
        trim: true
    },
    typeVideo: {
        type: String,
        default: '',
        required: 'Please fill Pub imag description',
        trim: true
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

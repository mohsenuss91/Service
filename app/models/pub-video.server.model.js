'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pub video Schema
 */
var PubVideoSchema = new Schema({
    file: {
        id_file_video: {
            type: mongoose.Schema.Types.ObjectId
        },
        namefile: {
            type: String,
            default: '',
            required: 'Please fill Pub imag description',
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

mongoose.model('PubVideo', PubVideoSchema);

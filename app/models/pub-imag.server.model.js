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
    file: {
        id_file_image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'fs.files'
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
        required: 'Please fill Pub imag description',
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

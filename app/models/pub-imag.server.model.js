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
    id_file_original:
    {
        type: mongoose.Schema.Types.ObjectId
    },
    image_data_thumbnail:
    {
        type: String,
        default: '',
        required: 'Please fill Pub imag description',
        trim: true
    },
    typeImage: {
        type: String,
        default: '',
        required: 'Please fill Pub imag description',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Pub imag description',
        trim: true
    },
    content_Url:{
        type:String
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

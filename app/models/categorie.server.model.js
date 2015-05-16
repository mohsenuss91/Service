'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Categorie Schema
 */
var CategorieSchema = new Schema({
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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Categorie', CategorieSchema);

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
    contenu:{
        type: Schema.ObjectId,
        ref: 'Contenu'
    },
    vue:{
        type:Boolean
    },
    type_action:{
        type: String,
        enum: ['jaime', 'comentaire','suivis','publication']
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

mongoose.model('Notification', NotificationSchema);

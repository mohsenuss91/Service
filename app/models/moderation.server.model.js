'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Moderation Schema
 */
var ModerationSchema = new Schema({
    modere: {
        type: Boolean,
        default: false
    },
    contenuImage:{
        type: Schema.ObjectId,
        ref: 'PubImag'
    },
    contenuVideo:{
        type: Schema.ObjectId,
        ref: 'PubVideo'
    },
    contenuEvenement:{
        type: Schema.ObjectId,
        ref: 'Evenement'
    },
    contenuOffre:{
        type: Schema.ObjectId,
        ref: 'Offre'
    },
    contenuStatus:{
        type: Schema.ObjectId,
        ref: 'Status'
    },
    contenuCours:{
        type: Schema.ObjectId,
        ref: 'Cour'
    },
    contenuEmploi:{
        type: Schema.ObjectId,
        ref: 'Emploie'
    },
    moderer_par: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    Url_content:{
        type:String
    },
    date_moderation: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Moderation', ModerationSchema);

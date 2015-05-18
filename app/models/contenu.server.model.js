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
    typeC: {
        type: {
            type: String,
            enum: ['status', 'image', 'video', 'offre', 'evenement', 'emploi', 'cours', 'commentaire']
        },
        default: ['status']
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    jaimes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    commentaires: [{
        type: Schema.ObjectId,
        ref: 'Contenu'
    }],
    pubImag: {
        type: Schema.ObjectId,
        ref: 'PubImag'
    },
    PubVideo: {
        type: Schema.ObjectId,
        ref: 'PubVideo'
    },
    offre: {
        type: Schema.ObjectId,
        ref: 'Offre'
    },
    evenement: {
        type: Schema.ObjectId,
        ref: 'Evenement'
    },
    cours: {
        type: Schema.ObjectId,
        ref: 'Cour'
    },
    emploi: {
        type: Schema.ObjectId,
        ref: 'Emploi'
    },
    tags: [{
        type: String
    }],
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    moderation: {
        type: Schema.ObjectId,
        ref: 'Moderation'
    },
    pere: {
        type: Schema.ObjectId,
        ref: 'Contenu'
    },
    affectations: [{
        type: Schema.ObjectId,
        ref: 'Affectation'
    }],
    categories: [{
        type: Schema.ObjectId,
        ref: 'Categorie'
    }]
});

mongoose.model('Contenu', ContenuSchema);

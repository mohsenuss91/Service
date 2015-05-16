'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Affectation Schema
 */
var AffectationSchema = new Schema({
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
    type: {
        type: String,
        default: '',
        required: '',
        trim: true
    },
    semestre: {
        type: String,
        default: '',
        required: '',
        trim: true
    },
    specialite: {
        type: String,
        default: '',
        required: '',
        trim: true
    },
    annee: {
        type: String,
        default: '',
        required: '',
        trim: true
    }
});

mongoose.model('Affectation', AffectationSchema);

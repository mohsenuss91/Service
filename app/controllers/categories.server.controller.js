'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Categorie = mongoose.model('Categorie'),
    _ = require('lodash');

/**
 * Create a Categorie
 */
exports.create = function (req, res) {
    var categorie = new Categorie(req.body);
    categorie.user = req.user;

    categorie.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categorie);
        }
    });
};

/**
 * Show the current Categorie
 */
exports.read = function (req, res) {
    res.jsonp(req.categorie);
};

/**
 * Update a Categorie
 */
exports.update = function (req, res) {
    var categorie = req.categorie;

    categorie = _.extend(categorie, req.body);

    categorie.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categorie);
        }
    });
};

/**
 * Delete an Categorie
 */
exports.delete = function (req, res) {
    var categorie = req.categorie;

    categorie.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categorie);
        }
    });
};

/**
 * List of Categories
 */
exports.list = function (req, res) {
    Categorie.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categories);
        }
    });
};

/**
 * Categorie middleware
 */
exports.categorieByID = function (req, res, next, id) {
    Categorie.findById(id).populate('user', 'displayName').exec(function (err, categorie) {
        if (err) return next(err);
        if (!categorie) return next(new Error('Failed to load Categorie ' + id));
        req.categorie = categorie;
        next();
    });
};

/**
 * Categorie authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.categorie.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

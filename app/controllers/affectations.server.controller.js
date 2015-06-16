'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Affectation = mongoose.model('Affectation'),
    _ = require('lodash');

/**
 * Create a Affectation
 */
exports.create = function (req, res) {
    var affectation = new Affectation(req.body);
    affectation.user = req.user;
    console.log("yow yow"+affectation.titre+affectation.description);

    affectation.save(function (err) {
        if (err) {
            console.log(errorHandler.getErrorMessage(err));
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(affectation);
        }
    });
};

/**
 * Show the current Affectation
 */
exports.read = function (req, res) {
    res.jsonp(req.affectation);
};

/**
 * Update a Affectation
 */
exports.update = function (req, res) {
    var affectation = req.affectation;

    affectation = _.extend(affectation, req.body);

    affectation.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(affectation);
        }
    });
};

/**
 * Delete an Affectation
 */
exports.delete = function (req, res) {
    var affectation = req.affectation;

    console.log("deleting");
    affectation.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(affectation);
        }
    });
};

/**
 * List of Affectations
 */
exports.list = function (req, res) {
    Affectation.find().sort('-created').populate('user', 'displayName').exec(function (err, affectations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(affectations);
        }
    });
};

/**
 * Affectation middleware
 */
exports.affectationByID = function (req, res, next, id) {
    Affectation.findById(id).populate('user', 'displayName').exec(function (err, affectation) {
        if (err) return next(err);
        if (!affectation) return next(new Error('Failed to load Affectation ' + id));
        req.affectation = affectation;
        next();
    });
};

/**
 * Affectation authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.affectation.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

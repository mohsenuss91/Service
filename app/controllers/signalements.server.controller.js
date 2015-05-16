'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Signalement = mongoose.model('Signalement'),
    _ = require('lodash');

/**
 * Create a Signalement
 */
exports.create = function (req, res) {
    var signalement = new Signalement(req.body);
    signalement.user = req.user;

    signalement.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(signalement);
        }
    });
};

/**
 * Show the current Signalement
 */
exports.read = function (req, res) {
    res.jsonp(req.signalement);
};

/**
 * Update a Signalement
 */
exports.update = function (req, res) {
    var signalement = req.signalement;

    signalement = _.extend(signalement, req.body);

    signalement.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(signalement);
        }
    });
};

/**
 * Delete an Signalement
 */
exports.delete = function (req, res) {
    var signalement = req.signalement;

    signalement.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(signalement);
        }
    });
};

/**
 * List of Signalements
 */
exports.list = function (req, res) {
    Signalement.find().sort('-created').populate('user', 'displayName').exec(function (err, signalements) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(signalements);
        }
    });
};

/**
 * Signalement middleware
 */
exports.signalementByID = function (req, res, next, id) {
    Signalement.findById(id).populate('user', 'displayName').exec(function (err, signalement) {
        if (err) return next(err);
        if (!signalement) return next(new Error('Failed to load Signalement ' + id));
        req.signalement = signalement;
        next();
    });
};

/**
 * Signalement authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.signalement.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

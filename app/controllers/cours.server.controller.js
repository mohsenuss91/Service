'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Cour = mongoose.model('Cour'),
    _ = require('lodash');

/**
 * Create a Cour
 */
exports.create = function (req, res) {
    var cour = new Cour(req.body);
    cour.user = req.user;

    cour.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cour);
        }
    });
};

/**
 * Show the current Cour
 */
exports.read = function (req, res) {
    res.jsonp(req.cour);
};

/**
 * Update a Cour
 */
exports.update = function (req, res) {
    var cour = req.cour;

    cour = _.extend(cour, req.body);

    cour.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cour);
        }
    });
};

/**
 * Delete an Cour
 */
exports.delete = function (req, res) {
    var cour = req.cour;

    cour.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cour);
        }
    });
};

/**
 * List of Cours
 */
exports.list = function (req, res) {
    Cour.find().sort('-created').populate('user', 'displayName').exec(function (err, cours) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(cours);
        }
    });
};

/**
 * Cour middleware
 */
exports.courByID = function (req, res, next, id) {
    Cour.findById(id).populate('user', 'displayName').exec(function (err, cour) {
        if (err) return next(err);
        if (!cour) return next(new Error('Failed to load Cour ' + id));
        req.cour = cour;
        next();
    });
};

/**
 * Cour authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    var trouve=false,i=0;
    while(i<req.user.roles.length && trouve == false){
        if(req.user.roles[i]=='moderateur'){
            trouve==true;
        }
        i++;
    }
    if (req.cour.user.id !== req.user.id && trouve==false) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

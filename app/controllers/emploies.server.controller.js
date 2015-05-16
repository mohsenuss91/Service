'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Emploie = mongoose.model('Emploie'),
	_ = require('lodash');

/**
 * Create a Emploie
 */
exports.create = function(req, res) {
	var emploie = new Emploie(req.body);
	emploie.user = req.user;

	emploie.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emploie);
		}
	});
};

/**
 * Show the current Emploie
 */
exports.read = function(req, res) {
	res.jsonp(req.emploie);
};

/**
 * Update a Emploie
 */
exports.update = function(req, res) {
	var emploie = req.emploie ;

	emploie = _.extend(emploie , req.body);

	emploie.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emploie);
		}
	});
};

/**
 * Delete an Emploie
 */
exports.delete = function(req, res) {
	var emploie = req.emploie ;

	emploie.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emploie);
		}
	});
};

/**
 * List of Emploies
 */
exports.list = function(req, res) { 
	Emploie.find().sort('-created').populate('user', 'displayName').exec(function(err, emploies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emploies);
		}
	});
};

/**
 * Emploie middleware
 */
exports.emploieByID = function(req, res, next, id) { 
	Emploie.findById(id).populate('user', 'displayName').exec(function(err, emploie) {
		if (err) return next(err);
		if (! emploie) return next(new Error('Failed to load Emploie ' + id));
		req.emploie = emploie ;
		next();
	});
};

/**
 * Emploie authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.emploie.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contenu = mongoose.model('Contenu'),
	_ = require('lodash');

/**
 * Create a Contenu
 */
exports.create = function(req, res) {
	var contenu = new Contenu(req.body);
	contenu.user = req.user;

	contenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contenu);
		}
	});
};

/**
 * Show the current Contenu
 */
exports.read = function(req, res) {
	res.jsonp(req.contenu);
};

/**
 * Update a Contenu
 */
exports.update = function(req, res) {
	var contenu = req.contenu ;

	contenu = _.extend(contenu , req.body);

	contenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contenu);
		}
	});
};

/**
 * Delete an Contenu
 */
exports.delete = function(req, res) {
	var contenu = req.contenu ;

	contenu.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contenu);
		}
	});
};

/**
 * List of Contenus
 */
exports.list = function(req, res) { 
	Contenu.find().sort('-created').populate('user', 'displayName').exec(function(err, contenus) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contenus);
		}
	});
};

/**
 * Contenu middleware
 */
exports.contenuByID = function(req, res, next, id) { 
	Contenu.findById(id).populate('user', 'displayName').exec(function(err, contenu) {
		if (err) return next(err);
		if (! contenu) return next(new Error('Failed to load Contenu ' + id));
		req.contenu = contenu ;
		next();
	});
};

/**
 * Contenu authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contenu.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

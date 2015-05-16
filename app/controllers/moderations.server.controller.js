'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Moderation = mongoose.model('Moderation'),
	_ = require('lodash');

/**
 * Create a Moderation
 */
exports.create = function(req, res) {
	var moderation = new Moderation(req.body);
	moderation.user = req.user;

	moderation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(moderation);
		}
	});
};

/**
 * Show the current Moderation
 */
exports.read = function(req, res) {
	res.jsonp(req.moderation);
};

/**
 * Update a Moderation
 */
exports.update = function(req, res) {
	var moderation = req.moderation ;

	moderation = _.extend(moderation , req.body);

	moderation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(moderation);
		}
	});
};

/**
 * Delete an Moderation
 */
exports.delete = function(req, res) {
	var moderation = req.moderation ;

	moderation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(moderation);
		}
	});
};

/**
 * List of Moderations
 */
exports.list = function(req, res) { 
	Moderation.find().sort('-created').populate('user', 'displayName').exec(function(err, moderations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(moderations);
		}
	});
};

/**
 * Moderation middleware
 */
exports.moderationByID = function(req, res, next, id) { 
	Moderation.findById(id).populate('user', 'displayName').exec(function(err, moderation) {
		if (err) return next(err);
		if (! moderation) return next(new Error('Failed to load Moderation ' + id));
		req.moderation = moderation ;
		next();
	});
};

/**
 * Moderation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.moderation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

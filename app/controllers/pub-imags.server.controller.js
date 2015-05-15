'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	PubImag = mongoose.model('PubImag'),
	_ = require('lodash');


/**
 * Create a Pub imag
 */

exports.create = function(req, res) {
	var pubImag = new PubImag(req.body);
	pubImag.user = req.user;
	pubImag.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pubImag);
			// alert('haha');
			var conn = mongoose.connection;
			conn.once('open', function () {
				var gfs = Grid(conn.db);
				console.log('work perfectly');
			});
		}
	});

};

/**
 * Show the current Pub imag
 */
exports.read = function(req, res) {
	res.jsonp(req.pubImag);
};

/**
 * Update a Pub imag
 */
exports.update = function(req, res) {
	var pubImag = req.pubImag ;

	pubImag = _.extend(pubImag , req.body);

	pubImag.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pubImag);
		}
	});
};

/**
 * Delete an Pub imag
 */
exports.delete = function(req, res) {
	var pubImag = req.pubImag ;

	pubImag.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pubImag);
		}
	});
};

/**
 * List of Pub imags
 */
exports.list = function(req, res) { 
	PubImag.find().sort('-created').populate('user', 'displayName').exec(function(err, pubImags) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pubImags);
		}
	});
};

/**
 * Pub imag middleware
 */
exports.pubImagByID = function(req, res, next, id) { 
	PubImag.findById(id).populate('user', 'displayName').exec(function(err, pubImag) {
		if (err) return next(err);
		if (! pubImag) return next(new Error('Failed to load Pub imag ' + id));
		req.pubImag = pubImag ;
		next();
	});
};

/**
 * Pub imag authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pubImag.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

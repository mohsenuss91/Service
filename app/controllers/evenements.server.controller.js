'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Evenement = mongoose.model('Evenement'),
    Contenu = mongoose.model('Contenu'),
	_ = require('lodash');

/**
 * Create a Evenement
 */
exports.create = function(req, res) {
	var evenement = new Evenement(req.body);
	evenement.user = req.user;



	evenement.save(function(err, evenement) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            var contenu = new Contenu();
            contenu.user = req.user;
            contenu.typeC = 'evenement';
            contenu.evenement = evenement._id;

            //console.log("evenement.server.controller "+contenu.created);

            contenu.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(evenement);
                }
            });

		}
	});
};

/**
 * Show the current Evenement
 */
exports.read = function(req, res) {
	res.jsonp(req.evenement);
};

/**
 * Update a Evenement
 */
exports.update = function(req, res) {
	var evenement = req.evenement ;


    console.log("apdate request titre:" +req.body.titre +", description :"
                + req.body.description+", lieu : "+req.body.lieu+", date:"+ req.body.date);
    /*Evenement.findByIdAndUpdate(
        evenement._id,
        {$set: {titre: req.body.titre, description : req.body.description, lieu : req.body.lieu, date: req.body.date}},
        function (err, comment) {
            //status.save();
        }
    );
	evenement = _.extend(evenement , req.body);

	evenement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evenement);
		}
	});*/
};

/**
 * Delete an Evenement
 */
exports.delete = function(req, res) {
	var evenement = req.evenement ;

	evenement.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evenement);
		}
	});
};

/**
 * List of Evenements
 */
exports.list = function(req, res) { 
	Evenement.find().sort('-created').populate('user', 'displayName').exec(function(err, evenements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evenements);
            console.log("evenements.server.ctrl "+evenements.length);
		}
	});
};

/**
 * Evenement middleware
 */
exports.evenementByID = function(req, res, next, id) { 
	Evenement.findById(id).populate('user', 'displayName').exec(function(err, evenement) {
		if (err) return next(err);
		if (! evenement) return next(new Error('Failed to load Evenement ' + id));
		req.evenement = evenement ;
		next();
	});
};

/**
 * Evenement authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.evenement.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

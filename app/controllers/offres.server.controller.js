'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Offre = mongoose.model('Offre'),
    Contenu = mongoose.model('Contenu'),
	_ = require('lodash');

/**
 * Create a Offre
 */
exports.create = function(req, res) {
	var offre = new Offre(req.body);
    offre.user = req.user;



    offre.save(function(err, offre) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var contenu = new Contenu();
            contenu.user = req.user;
            contenu.typeC = 'offre';
            contenu.offre = offre._id;

            //console.log("evenement.server.controller "+contenu.created);

            contenu.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(offre);
                }
            });

        }
    });
};

/**
 * Show the current Offre
 */
exports.read = function(req, res) {
	res.jsonp(req.offre);
};

/**
 * Update a Offre
 */
exports.update = function(req, res) {
	var offre = req.offre ;

    console.log("apdate request titre:" +req.body.entreprise +", description :");
    Offre.findByIdAndUpdate(
        offre._id,
         {$set: {entreprise: req.body.entreprise, post : req.body.post, competences : req.body.competences, date: req.body.documents}},
         function (err, offre) {
             res.jsonp(offre);
         }
     );
};

/**
 * Delete an Offre
 */
exports.delete = function(req, res) {
	var offre = req.offre ;

	offre.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offre);
		}
	});
};

/**
 * List of Offres
 */
exports.list = function(req, res) { 
	Offre.find().sort('-created').populate('user', 'displayName').exec(function(err, offres) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offres);
		}
	});
};

/**
 * Offre middleware
 */
exports.offreByID = function(req, res, next, id) { 
	Offre.findById(id).populate('user', 'displayName').exec(function(err, offre) {
		if (err) return next(err);
		if (! offre) return next(new Error('Failed to load Offre ' + id));
		req.offre = offre ;
		next();
	});
};

/**
 * Offre authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offre.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

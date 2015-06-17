'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
    Affectation = mongoose.model('Affectation'),
    Signalement = mongoose.model('Signalement'),
    Contenu = mongoose.model('Contenu'),
	_ = require('lodash');

/**
 * Create a Admin
 */
exports.create = function(req, res) {
	var admin = new Admin(req.body);
	admin.user = req.user;

	admin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Show the current Admin
 */
exports.read = function(req, res) {
	res.jsonp(req.admin);
};

/**
 * Update a Admin
 */
exports.userUpdate = function(req, res) {
	var admin = req.admin ;

    if(req.body.affectations){
        User.findByIdAndUpdate(
            req.body._id,
            {$set: {bloque: req.body.bloque, roles : req.body.roles, affectations : req.body.affectations[0]._id}},
            function (err, user) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(user);
                }
            }
        );
    }
    else{
        User.findByIdAndUpdate(
            req.body._id,
            {$set: {bloque: req.body.bloque, roles : req.body.roles}},
            function (err, user) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(user);
                }
            }
        );
    }

};

exports.signalementApdate = function(req, res) {
    var signalement = req.signalement ;

    Contenu.findByIdAndRemove(
        req.signalement.contenu,
        function (err, contenu) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {
                signalement.remove(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(signalement);
                    }
                });
            }
        })/*
    User.findByIdAndUpdate(
        req.signalement.user_signale,
        {$set: {bloque: true}},
        function (err, contenu) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {
                signalement.remove(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(signalement);
                    }
                });
            }
        })*/
};

/**
 * Delete an Admin
 */
exports.signalementDelete = function(req, res) {
    var signalement = req.signalement ;

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
 * Delete an Admin
 */
exports.delete = function(req, res) {
	var signalement = req.signalement ;

    console.log("yow yow"+signalement._id);
    /*User.findByIdAndUpdate(
        req.signalement.user_signale,
        {$set: {bloque: true}},
        function (err, contenu) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {
                console.log("remove request recieved from server  " + comment._id);
                res.jsonp(contenu);
            }
        }
    );*/
};

/**
 * List of Admins
 */
exports.listUsers = function(req, res) {
    User.find().sort('-created')
        .populate({
            path: 'affectations',
            select: 'titre'})
        .exec(function(err, users) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(users);
            }
        });
};

exports.listSignalements = function(req, res) {
    Signalement.find().sort('-created')
        .populate('user', 'displayName')
        .populate(
        {path :'user_signale',select: 'displayName bloque'})
        .exec(function(err, users) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(users);
            }
        });
};
/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) {
	Admin.findById(id).populate('user', 'displayName').exec(function(err, admin) {
		if (err) return next(err);
		if (! admin) return next(new Error('Failed to load Admin ' + id));
		req.admin = admin ;
		next();
	});
};

/**
 * Admin authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admin.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.estAdministrateur = function(req, res, next) {
    if (req.admin.user.roles !== 'administrateur') {
        return res.status(403).send('cette action est droit reservé pour l administrateur');
    }
    next();
};

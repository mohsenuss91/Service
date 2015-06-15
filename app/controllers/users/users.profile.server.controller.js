'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
    Grid = require('gridfs-stream'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

var Busboy = require('busboy');

exports.upload = function(req,res){
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var dataResp= {
            data:'',
            typeData : mimetype
        };
        /*******     image    ******/
        var bufs = [];
        file.on('data',function(chunk){
                bufs.push(chunk);
            }).
            on('end',function(){
                var fbuf = Buffer.concat(bufs);
                var base64 = (fbuf.toString('base64'));
                var data = 'data:'+mimetype+';base64,' + base64 + '';
                dataResp.data = data;
                res.jsonp(dataResp);
            });
    });
    busboy.on('finish', function() {
        console.log('uploade finish');
    });
    req.pipe(busboy);
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

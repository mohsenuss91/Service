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
        var userOther = req.body.userOther;
        if(userOther != null){
            User.findById(userOther._id).exec(function(err,user) {
                if (err) {
                    return err;
                }else{
                    user.estSuivi = userOther.estSuivi;
                    user.save(function(err) {
                        if (err) {
                            return err;
                        }
                    });
                }
            });
        }
		// Merge existing user
        if(req.body.user != null) user = _.extend(user, req.body.user);
        else user = _.extend(user, req.body);

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
    /*************list des user qui te suive***********/
    var userProfile = {
        estSuivi:[],
        suit:[]
    };
    var i= 0,estSuivi=req.user.estSuivi;
    while(i<estSuivi.length){
        User.findById(estSuivi[k]).exec(function(err,user) {
            if (err) {
                return err;
            }else{
                var suiv={
                    firstName:'',
                    lastName:''
                };
                suiv.firstName=user.firstName;
                suiv.lastName=user.lastName;
                userProfile.estSuivi.push(suiv);
            }
        });
        i++;
    }
    /*************list des user qui tu suive***********/
    var k= 0,suit=req.user.suit;
    while(k<suit.length){
        User.findById(suit[k]).exec(function(err,user) {
            if (err) {
                return err;
            }else{
                var suiv={
                    firstName:'',
                    lastName:''
                };
                suiv.firstName=user.firstName;
                suiv.lastName=user.lastName;
                userProfile.suit.push(suiv);
            }
        });
        if(k== suit.length-1){
            User.findById(suit[k]).exec(function(err,user) {
                if (err) {
                    return err;
                }else{
                    var suiv={
                        firstName:'',
                        lastName:''
                    };
                    suiv.firstName=user.firstName;
                    suiv.lastName=user.lastName;
                    userProfile.suit.push(suiv);
                    res.jsonp(userProfile || null);
                }
            });
        }
        k++;
    }
};



exports.list = function(req, res){
    if(req.user != null){
    User.find().sort('-created').exec(function(err, Users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var i=0;
            var listUsers=[];
            while(i < Users.length){
                if(Users[i].displayName != req.user.displayName){
                    var j=0;
                    while(j<req.user.suit.length && (req.user.suit[j].toString())!=(Users[i]._id.toString())){
                        j++;
                    }
                    if(j==req.user.suit.length){
                        var user={
                            _id : '',
                            firstName:'',
                            lastName:'',
                            estSuivi:[]
                        };
                        user.firstName = Users[i].firstName;
                        user.lastName = Users[i].lastName;
                        user._id = Users[i]._id;
                        listUsers.push(user);
                    }
                }
                i++;
            }
            res.jsonp(listUsers);
        }
    });
    }
}

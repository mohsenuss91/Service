'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
	errorHandler = require('./errors.server.controller'),
    Test = mongoose.model('Test'),
	_ = require('lodash');
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;

    var gfs
    conn.once('open', function () {
        gfs = Grid(conn.db);
    });

/**
 * Create a Test
 */
exports.upload = function(req,res){
    var data = req.files.file;
    res.send(data);
    res.end();
};
exports.readFile=function(req,res){
    (req.test).retrieveBlobs(function (err, doc) {
        if(err) {
            return done(err);
        }
        var writeStream = fs.createWriteStream('./public/videos/test.png');
        writeStream.write(doc.content);
        res.jsonp(doc);
    });
};
var buffer;
exports.create = function(req, res) {
	var test = new Test(req.body);
    /*test.content = "test unitaire";
    test.complement = { some: { complicated: { stuff: true } } };
    test.user = req.user;
    test.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(test);
        }
    });*/

    var readStream = fs.createReadStream('public/uploads/video.png');
    readStream.on('data',function(chunk){
        buffer +=chunk;
    });
    readStream.on('close',function(){
        test.content = buffer;
        test.complement = { some: { complicated: { stuff: true } } };
        test.user = req.user;
        test.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(test);
            }
        });
    });
};

/**
 * Show the current Test
 */
var buffer_write;
exports.read = function(req, res) {
    res.jsonp(req.test);
    /*(req.test).retrieveBlobs(function (err, doc) {
        if(err) {
            return done(err);
        }
        res.jsonp(doc);
    });*/
};

/**
 * Update a Test
 */
exports.update = function(req, res) {
	var test = req.test ;

	test = _.extend(test , req.body);

	test.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test);
		}
	});
};

/**
 * Delete an Test
 */
exports.delete = function(req, res) {
	var test = req.test ;

	test.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test);
		}
	});
};

/**
 * List of Tests
 */
exports.list = function(req, res) {
	Test.find().sort('-created').populate('user', 'displayName').exec(function(err, tests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tests);
		}
	});
};

/**
 * Test middleware
 */
exports.testByID = function(req, res, next, id) {
	Test.findById(id).populate('user', 'displayName').exec(function(err, test) {
		if (err) return next(err);
		if (! test) return next(new Error('Failed to load Test ' + id));
		req.test = test ;
		next();
	});
};

/**
 * Test authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.test.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


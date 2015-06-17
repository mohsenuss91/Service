'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
    Contenu = mongoose.model('Contenu'),
    Moderation = mongoose.model('Moderation'),
	errorHandler = require('./errors.server.controller'),
	PubImag = mongoose.model('PubImag'),
	_ = require('lodash');
var Busboy = require('busboy');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

var gfs;
conn.once('open', function () {
    gfs = Grid(conn.db);
});

/**
 * Create a Pub imag
 */

//var im = require('imagemagick-stream');

exports.upload = function(req,res){
    //var resize = im().resize('400x400').quality(90);
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var dataResp= {
            originalFile : '',
            data:'',
            typeData : mimetype
        };
        var writeStreamOrginal = gfs.createWriteStream({
            filename: filename+'original'
        });
        file.pipe(writeStreamOrginal)
            .on('close',function(originalFile){
                dataResp.originalFile = originalFile;
                res.jsonp(dataResp);
            });
        var bufs = [];
        file.on('data',function(chunk){
            bufs.push(chunk);
        }).on('end',function(){
            var fbuf = Buffer.concat(bufs);
            var base64 = (fbuf.toString('base64'));
            var data = 'data:'+mimetype+';base64,' + base64 + '';
            dataResp.data = data;
        });
    });
    busboy.on('finish', function() {
        console.log('uploade finish');
    });
    req.pipe(busboy);
};


exports.create = function(req, res) {
    var pubImag = new PubImag(req.body);
    pubImag.user = req.user;
    pubImag.save(function (err,pubImag) {
        if (err) {
            console.log()
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var moderation = new Moderation();
            moderation.save(function (err,moderation) {
                if (err) {
                    console.log()
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var contenu = new Contenu();
                    contenu.user = req.user;
                    contenu.typeC = 'image';
                    contenu.pubImag = pubImag._id;
                    contenu.moderation = moderation._id;
                    contenu.save(function(err,contenu) {
                        if (err) {
                            console.log(err);
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            console.log('contenu saved');
                            res.jsonp(contenu);
                        }
                    });
                }
            });
        }
    });
};
/**
 * Show the current Pub imag
 */
/**
 * read object  file of image
 * @param req
 * @param res
 */
exports.read = function(req, res) {
    var pubImag=req.pubImag;
    res.jsonp(pubImag);
};
/**
 * read object  file of image
 * @param req
 * @param res
 */
exports.readFile = function (req,res){
    var pubImag=req.pubImag;
    gfs.findOne({_id : pubImag.id_file_original},function (err, file) {
        if(err){return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        }else{
            if(file!=null){
                res.jsonp(file);
            }
        };
    })
};
/**
 * read data  of image
 * @param req
 * @param res
 */
exports.readData = function(req, res) {
    var pubImag=req.pubImag;
    gfs.findOne({_id : pubImag.id_file_original},function (err, file) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        console.log(file);
        if(file!=null){
            var bufs = [];
            var readStream = gfs.createReadStream({_id: pubImag.id_file_original});
                readStream.on('data',function(chunk){
                    bufs.push(chunk);
                });
                readStream.on('close',function(){
                    var fbuf = Buffer.concat(bufs);
                    var base64 = (fbuf.toString('base64'));
                    var data = 'data:'+pubImag.typeImage+';base64,' + base64 + '';
                    res.jsonp({data : data});
                });
            }

    });
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
            gfs.remove({_id :pubImag.id_file_original}, function (err) {
                if (err) return handleError(err);
                console.log('success');
            });
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

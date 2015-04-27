'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
	errorHandler = require('./errors.server.controller'),
	PubImag = mongoose.model('PubImag'),
	_ = require('lodash');

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

var gfs
conn.once('open', function () {
    gfs = Grid(conn.db);
});

var file;
var buffer;
var buffer2;
/**
 * Create a Pub imag
 */

exports.upload = function(req,res){
    var data = req.files.file;
    res.jsonp(data);
    res.end();
};

var _id_file;
exports.create = function(req, res) {

    var file = req.body.datafile.file;
    var pubImageData = req.body.datapubImages;
    var name = file.originalname;
    var path=file.path.replace(/\//g, '/');
    var writestream = gfs.createWriteStream({
        filename: name
     });
     fs.createReadStream(path).pipe(writestream);
     writestream.on('close', function (file) {
         _id_file=file._id;
         pubImageData.file.id_file_image = _id_file;
         pubImageData.file.namefile ='/images/'+name;
         var pubImag = new PubImag(pubImageData);
         pubImag.user = req.user;
         pubImag.save(function(err) {
             if (err) {
                 return res.status(400).send({
                     message: errorHandler.getErrorMessage(err)
                 });
             } else {
                 res.jsonp(pubImag);
             }
         });

     });
};

/**
 * Show the current Pub imag
 */
exports.read = function(req, res) {

    gfs.files.find({ _id: _id_file}).toArray(function (err, files) {
        if(err){return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        }else{
            if(files[0]!=null){
                var path = '/images/'+files[0].filename;
                var writeStream = fs.createWriteStream('./public'+path);
                var readStream = gfs.createReadStream({_id: _id_file});
                readStream.on("data", function (chunk) {
                    buffer += writeStream.write(chunk);
                });
                readStream.on('close',function(){
                    console.log('the file is readed complitelly ');
                });}
            res.jsonp(req.pubImag);
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
            gfs.files.find().toArray(function (err, files) {
                if(err){return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
                }else{
                    var i= 0;
                        while((files[i]!=null)){
                            var path = '/images/'+files[i].filename;
                            var writeStream = fs.createWriteStream('./public'+path);
                            var readStream = gfs.createReadStream({_id: files[i]._id});
                            readStream.on("data", function (chunk) {
                                buffer2 += writeStream.write(chunk);
                            });
                            readStream.on('close',function(){
                                console.log('the file is readed complitelly ');
                            });
                            i++;
                        }
                    }
                });
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

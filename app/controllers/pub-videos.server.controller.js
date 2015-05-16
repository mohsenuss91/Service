'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs=require('fs'),
    ffmpeg = require('fluent-ffmpeg'),
    thumbler = require('video-thumb'),
	errorHandler = require('./errors.server.controller'),
	PubVideo = mongoose.model('PubVideo'),
	_ = require('lodash');

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

var gfs
conn.once('open', function () {
    gfs = Grid(conn.db);
});
var file;
var buffer2;
var buffer;
exports.upload = function(req,res){
    var data = req.files.file;
    console.log(data);
    res.jsonp(data);
    res.end();

};
/**
 * Create a Pub video
 */
var _id_file;
exports.create = function(req, res) {
    var file = req.body.datafile.file;
    var pubVideoData = req.body.datapubVideos;
    console.log(pubVideoData);
    var name = file.originalname;
    var path=file.path.replace(/\//g, '/');
    var writestream = gfs.createWriteStream({
        filename: name
    });
    fs.createReadStream(path).pipe(writestream);
    writestream.on('close', function (file) {
        _id_file = file._id;
        pubVideoData.file.id_file_video = _id_file;
        pubVideoData.file.namefile = '/videos/' + name;
        var pubVideo = new PubVideo(pubVideoData);
        pubVideo.user = req.user;
        pubVideo.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(pubVideo);
            }
        });
    });
};

/**
 * Show the current Pub video
 */
exports.read = function(req, res) {
    gfs.findOne({_id : _id_file},function (err, file) {
        if(err){return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        }else{
            if(file!=null){
            var path = '/videos/'+file.filename;
            var writeStream = fs.createWriteStream('./public'+path);
            var readStream = gfs.createReadStream({_id: _id_file});
                readStream.pipe(writeStream);
            readStream.on('close',function(){
                console.log('the file is readed complitelly ');
            });}
            res.jsonp(req.pubVideo);
        }
    });
};

/**
 * Update a Pub video
 */
exports.update = function(req, res) {
	var pubVideo = req.pubVideo ;

	pubVideo = _.extend(pubVideo , req.body);

	pubVideo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pubVideo);
		}
	});
};

/**
 * Delete an Pub video
 */
exports.delete = function(req, res) {
	var pubVideo = req.pubVideo ;

	pubVideo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            gfs.remove({_id :pubVideo.file.id_file_video}, function (err) {
                if (err) return handleError(err);
                console.log('success');
            });
			res.jsonp(pubVideo);
		}
	});
};

/**
 * List of Pub videos
 */
exports.list = function(req, res) {
	PubVideo.find().sort('-created').populate('user', 'displayName').exec(function(err, pubVideos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            var i=0;
            while(pubVideos[i]!=null && i < pubVideos.length-1){
                gfs.findOne({_id : pubVideos[i].file.id_file_video},function (err, file) {
                if(err){return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
                }else{
                    if(file!=null){
                        var path = '/videos/'+file.filename;
                        var writeStream = fs.createWriteStream('./public'+path);
                        var readStream = gfs.createReadStream({_id: file._id});
                        readStream.pipe(writeStream);
                        readStream.on('close',function(){
                            console.log('the file is readed complitelly '+file.filename);
                        });
                    }
                }
            });
                i++;
            }
            if(i == pubVideos.length-1){
                gfs.findOne({_id : pubVideos[i].file.id_file_video},function (err, file) {
                    if(err){return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    }else{
                        if(file!=null){
                            var path = '/videos/'+file.filename;
                            var writeStream = fs.createWriteStream('./public'+path);
                            var readStream = gfs.createReadStream({_id: file._id});
                            readStream.pipe(writeStream);
                            readStream.on('close',function(){
                                console.log('the file is readed complitelly '+file.filename);
                                res.jsonp(pubVideos);
                            });
                        }
                    }
                });
            }
		}
	});
};

/**
 * Pub video middleware
 */
exports.pubVideoByID = function(req, res, next, id) { 
	PubVideo.findById(id).populate('user', 'displayName').exec(function(err, pubVideo) {
		if (err) return next(err);
		if (! pubVideo) return next(new Error('Failed to load Pub video ' + id));
		req.pubVideo = pubVideo ;
		next();
	});
};

/**
 * Pub video authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pubVideo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

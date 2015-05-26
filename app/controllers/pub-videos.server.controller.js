'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs=require('fs'),
    errorHandler = require('./errors.server.controller'),
	PubVideo = mongoose.model('PubVideo'),
	_ = require('lodash');

var Busboy = require('busboy');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

var gfs
conn.once('open', function () {
    gfs = Grid(conn.db);
});
var SpawnStream = require('spawn-stream');

exports.upload = function(req,res){
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
        file.pipe(writeStreamOrginal);
        writeStreamOrginal.on('close',function(originalFile){
            dataResp.originalFile = originalFile;
            var ffmpeg = SpawnStream('ffmpeg', ['-i','-','-vcodec','mjpeg','-ss','00:00:03','-vframes','1','-s','100x80']);
            gfs.createReadStream({_id:originalFile._id}).pipe(ffmpeg).pipe(fs.createWriteStream('./public/uploads/test.jpg', 'w'));
        });
    });
    busboy.on('finish', function() {
        console.log('uploade finish');
    });
    req.pipe(busboy);

};
/**
 * Create a Pub video
 */


exports.create = function(req, res) {
    var pubVideo = new PubVideo(req.body);
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
};

/**
 * Show the current Pub video
 */
exports.read = function(req, res) {
    var pubVideo = req.body;
    res.jsonp(pubVideo);
};

exports.readData=function(req,res){

}
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
            res.jsonp(pubVideos);
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

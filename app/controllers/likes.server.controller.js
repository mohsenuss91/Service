'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Like = mongoose.model('Like'),
    Status = mongoose.model('Status'),
    _ = require('lodash');

/**
 * Create a Like
 */
exports.create = function (req, res) {
    var like = new Like(req.body);
    like.user = req.user;
    //like.status = req.body.

    console.log('req.status: ' + like.status);

    like.save(function (err, like) {
        if (err) {
            return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        } else {
            Status.findByIdAndUpdate(
                like.status,
                {'$push': {likes: {'_id': like._id}}},
                function (err, status) {
                    res.json(like);
                }
            );
        }
    });
};

/**
 * Show the current Like
 */
exports.read = function (req, res) {
    res.jsonp(req.like);
};

/**
 * Update a Like
 */
exports.update = function (req, res) {
    var like = req.like;

    like = _.extend(like, req.body);

    like.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(like);
        }
    });
};

/**
 * Delete an Like
 */
exports.delete = function (req, res) {
    //var status = req.stat ;
    console.log("likes server removing from status  and user  " + req.user._id + " " + req.status._id);
    Like.findOneAndRemove({$and: [{status: req.status._id}, {user: req.user._id}]}, function (err, like) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Status.findByIdAndUpdate(
                req.status._id,
                {'$pull': {likes: {'_id': like._id}}},
                function (err, status) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        console.log("remove request recieved from server  " + like._id);
                        status.save();
                        res.jsonp(status);
                    }
                }
            );

        }
    })
};

/**
 * List of Likes
 */
exports.list = function (req, res) {
    //console.log("likes server GET from status  and user  "+req.status._id);
    Like.find({status: req.status}).sort('-created').populate('user', 'displayName').exec(function (err, likes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(likes);
        }
    });
};

/**
 * Like middleware
 */
exports.likeByID = function (req, res, next, id) {
    Like.findById(id).populate('user', 'displayName').exec(function (err, like) {
        if (err) return next(err);
        if (!like) return next(new Error('Failed to load Like ' + id));
        req.like = like;
        next();
    });
};

/**
 * Like authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.like.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

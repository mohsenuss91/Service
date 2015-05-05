'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Comment = mongoose.model('Comment'),
    Status = mongoose.model('Status'),
    _ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function (req, res) {
    var comment = new Comment(req.body);
    comment.user = req.user;

    comment.status = req.status;
    //console.log('req.status: ' + comment.status );

    comment.save(function (err, comment) {
        if (err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});

        Status.findByIdAndUpdate(
            comment.status,
            {'$push': {comments: {'_id': comment._id}}},
            function (err, status) {
                //status.save();
            }
        );

        res.json(comment);
    });
};

/**
 * Show the current Comment
 */
exports.read = function (req, res) {
    res.jsonp(req.comment);
};

/**
 * Update a Comment
 */
exports.update = function (req, res) {
    var comment = req.comment;

    comment = _.extend(comment, req.body);

    comment.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};

/**
 * Delete an Comment
 */
exports.delete = function (req, res) {
    var comment = req.comment;

    comment.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Status.findByIdAndUpdate(
                req.status._id,
                {$pull: {comments: comment._id}},
                function (err, status) {
                    if (err) {
                        console.log(err);
                        return res.send(err);
                    }
                    else {
                        console.log("remove request recieved from server  " + comment._id);
                        res.jsonp(status);
                    }
                }
            );
        }
    });
};

/**
 * List of Comments
 */
exports.list = function (req, res) {
    console.log("comments server");
    Comment.find({status: req.status}).sort('created').populate('user', 'displayName').exec(function (err, comments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comments);
        }
    });
};

/**
 * Comment middleware
 */
exports.commentByID = function (req, res, next, id) {
    Comment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
        if (err) return next(err);
        if (!comment) return next(new Error('Failed to load Comment ' + id));
        req.comment = comment;
        next();
    });
};

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.comment.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

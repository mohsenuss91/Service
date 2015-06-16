'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Comment = mongoose.model('Comment'),
    Contenu = mongoose.model('Contenu'),
    _ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function (req, res) {
    var comment = new Comment(req.body);
    comment.user = req.user;

    comment.contenu = req.contenu;
    console.log('req.contenu: ' + comment.contenu);

    comment.save(function (err, comment) {
        if (err) return res.contenu(400).send({message: errorHandler.getErrorMessage(err)});

        Contenu.findByIdAndUpdate(
            comment.contenu,
            {'$push': {commentaires: {'_id': comment._id}}},
            function (err, contenu) {
                //contenu.save();
                res.json(comment);
            }
        );


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

    console.log('comments server : updating comment  ' + comment._id + '  new value ' + req.body.name);

    Comment.findByIdAndUpdate(
        comment._id,
        {$set: {name: req.body.name}},
        function (err, comment) {
            //status.save();
        }
    );
    /*comment = _.extend(comment, req.body);

     comment.save(function (err) {
     if (err) {
     return res.status(400).send({
     message: errorHandler.getErrorMessage(err)
     });
     } else {
     res.jsonp(comment);
     }
     });*/
};

/**
 * Delete an Comment
 */
exports.delete = function (req, res) {
    var comment = req.comment;

    comment.remove(function (err) {
        if (err) {
            return res.contenu(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Contenu.findByIdAndUpdate(
                req.contenu._id,
                {$pull: {commentaires: comment._id}},
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
            );
        }
    });
};

/**
 * List of Comments
 */
exports.list = function (req, res) {
    console.log("comments server");
    Comment.find({contenu: req.contenu}).sort('created').populate('user', 'displayName').exec(function (err, comments) {
        if (err) {
            return res.contenu(400).send({
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
    var trouve=false,i=0;
    while(i<req.user.roles.length && trouve == false){
        if(req.user.roles[i]=='moderateur'){
            trouve==true;
        }
        i++;
    }
    if (req.comment.user.id !== req.user.id &&  trouve == false) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

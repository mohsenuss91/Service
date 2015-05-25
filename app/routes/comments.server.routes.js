'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var comments = require('../../app/controllers/comments.server.controller');
    var contenus = require('../../app/controllers/contenus.server.controller');

    // Comments Routes
    app.route('/contenus/:contenuId/comments')
        .get(comments.list)
        .post(users.requiresLogin, comments.create);

    app.route('/contenus/:contenuId/comments/:commentId')
        .get(contenus.read, comments.read)
        .put(users.requiresLogin, comments.hasAuthorization, comments.update)
        .delete(users.requiresLogin, comments.hasAuthorization, comments.delete);

    // Finish by binding the Comment middleware
    app.param('contenuId', contenus.contenuByID);
    app.param('commentId', comments.commentByID);
};

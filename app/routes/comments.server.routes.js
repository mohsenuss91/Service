'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var comments = require('../../app/controllers/comments.server.controller');
    var statuses = require('../../app/controllers/statuses.server.controller');

    // Comments Routes
    app.route('/statuses/:statusId/comments')
        .get(comments.list)
        .post(users.requiresLogin, comments.create);

    app.route('/statuses/:statusId/comments/:commentId')
        .get(statuses.read, comments.read)
        .put(users.requiresLogin, comments.hasAuthorization, comments.update)
        .delete(users.requiresLogin, comments.hasAuthorization, comments.delete);

    // Finish by binding the Comment middleware
    app.param('statusId', statuses.statusByID);
    app.param('commentId', comments.commentByID);
};

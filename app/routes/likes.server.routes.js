'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var likes = require('../../app/controllers/likes.server.controller');
    var statuses = require('../../app/controllers/statuses.server.controller');

    // Likes Routes
    app.route('/statuses/:statusId/likes')
        .get(likes.list)
        .post(users.requiresLogin, likes.create)
        .delete(users.requiresLogin, likes.delete);

    app.route('/statuses/:statusId/likes/:likeId')
        .get(statuses.read, likes.read);

    // Finish by binding the Like middleware
    app.param('statusId', statuses.statusByID);
    app.param('likeId', likes.likeByID);
};

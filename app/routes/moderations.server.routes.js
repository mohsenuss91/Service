'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var moderations = require('../../app/controllers/moderations.server.controller');

    // Moderations Routes
    app.route('/moderations')
        .get(users.requiresLogin, moderations.hasAuthorization,moderations.list)
        .post(users.requiresLogin,moderations.create);
    app.route('/moderations/?')
        .get(users.requiresLogin, moderations.hasAuthorization,moderations.list)

    app.route('/moderations/:moderationId')
        .get(users.requiresLogin, moderations.hasAuthorization,moderations.read)
        .put(users.requiresLogin, moderations.hasAuthorization, moderations.update)
        .delete(users.requiresLogin, moderations.hasAuthorization, moderations.delete);

    // Finish by binding the Moderation middleware
    app.param('moderationId', moderations.moderationByID);
};

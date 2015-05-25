'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var likes = require('../../app/controllers/likes.server.controller');
    var contenus = require('../../app/controllers/contenus.server.controller');

    // Likes Routes
    app.route('/contenus/:contenuId/likes')
        .get(likes.list)
        .post(users.requiresLogin, likes.create)
        .delete(users.requiresLogin, likes.delete);

    app.route('/contenus/:contenuId/likes/:likeId')
        .get(contenus.read, likes.read);

    // Finish by binding the Like middleware
    app.param('contenuId', contenus.contenuByID);
    app.param('likeId', likes.likeByID);
};

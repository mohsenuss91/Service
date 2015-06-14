'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var cours = require('../../app/controllers/cours.server.controller');

    // Cours Routes
    app.route('/cours')
        .get(cours.list)
        .post(users.requiresLogin, cours.create);

    app.route('/cours/:courId')
        .get(cours.read)
        .put(users.requiresLogin, cours.hasAuthorization, cours.update)
        .delete(users.requiresLogin, cours.hasAuthorization, cours.delete);

    // Finish by binding the Cour middleware
    app.param('courId', cours.courByID);
};

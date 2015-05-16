'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var emploies = require('../../app/controllers/emploies.server.controller');

    // Emploies Routes
    app.route('/emploies')
        .get(emploies.list)
        .post(users.requiresLogin, emploies.create);

    app.route('/emploies/:emploieId')
        .get(emploies.read)
        .put(users.requiresLogin, emploies.hasAuthorization, emploies.update)
        .delete(users.requiresLogin, emploies.hasAuthorization, emploies.delete);

    // Finish by binding the Emploie middleware
    app.param('emploieId', emploies.emploieByID);
};

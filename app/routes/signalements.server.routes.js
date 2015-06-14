'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var signalements = require('../../app/controllers/signalements.server.controller');

    // Signalements Routes
    app.route('/signalements')
        .get(signalements.list)
        .post(users.requiresLogin, signalements.create);

    app.route('/signalements/:signalementId')
        .get(signalements.read)
        .put(users.requiresLogin, signalements.hasAuthorization, signalements.update)
        .delete(users.requiresLogin, signalements.hasAuthorization, signalements.delete);

    // Finish by binding the Signalement middleware
    app.param('signalementId', signalements.signalementByID);
};

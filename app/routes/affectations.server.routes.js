'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var affectations = require('../../app/controllers/affectations.server.controller');

	// Affectations Routes
	app.route('/affectations')
		.get(affectations.list)
		.post(users.requiresLogin, affectations.create);

	app.route('/affectations/:affectationId')
		.get(affectations.read)
		.put(users.requiresLogin, affectations.hasAuthorization, affectations.update)
		.delete(users.requiresLogin, affectations.hasAuthorization, affectations.delete);

	// Finish by binding the Affectation middleware
	app.param('affectationId', affectations.affectationByID);
};

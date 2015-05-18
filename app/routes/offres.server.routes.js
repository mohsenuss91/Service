'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var offres = require('../../app/controllers/offres.server.controller');

	// Offres Routes
	app.route('/offres')
		.get(offres.list)
		.post(users.requiresLogin, offres.create);

	app.route('/offres/:offreId')
		.get(offres.read)
		.put(users.requiresLogin, offres.hasAuthorization, offres.update)
		.delete(users.requiresLogin, offres.hasAuthorization, offres.delete);

	// Finish by binding the Offre middleware
	app.param('offreId', offres.offreByID);
};

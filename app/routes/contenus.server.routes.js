'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var contenus = require('../../app/controllers/contenus.server.controller');
	var comments = require('../../app/controllers/comments.server.controller');
	var likes = require('../../app/controllers/likes.server.controller');

	// Contenus Routes
	app.route('/contenus')
		.get(contenus.list)
		.post(users.requiresLogin, contenus.create);


	app.route('/contenus/:contenuId')
		.get(contenus.read)
		.put(users.requiresLogin, contenus.hasAuthorization, contenus.update)
		.delete(users.requiresLogin, contenus.hasAuthorization, contenus.delete);


	// Finish by binding the Contenu middleware
	app.param('contenuId', contenus.contenuByID);
};

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pubImags = require('../../app/controllers/pub-imags.server.controller');

    app.route('/pub-imags/create')
        .post(pubImags.upload);

	// Pub imags Routes
	app.route('/pub-imags')
		.get(pubImags.list)
		.post(users.requiresLogin, pubImags.create);

	app.route('/pub-imags/:pubImagId')
		.get(pubImags.read)
		.put(users.requiresLogin, pubImags.hasAuthorization, pubImags.update)
		.delete(users.requiresLogin, pubImags.hasAuthorization, pubImags.delete);

	// Finish by binding the Pub imag middleware
	app.param('pubImagId', pubImags.pubImagByID);
};

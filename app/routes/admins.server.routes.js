'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admin = require('../../app/controllers/admins.server.controller');

	// Admins Routes
	app.route('/admin/users')
		.get(admin.listUsers);

	app.route('/admin/users/:userId')
		.put(users.requiresLogin, admin.userUpdate);

    app.route('/admin/signalements')
        .get(admin.listSignalements);

    app.route('/admin/signalements/:signalementId')
        .put(users.requiresLogin, admin.signalementApdate)
        .delete(users.requiresLogin, admin.signalementDelete);

	// Finish by binding the Admin middleware
	app.param('adminId', admin.adminByID);
};

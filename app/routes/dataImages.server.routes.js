'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dataImages = require('../../app/controllers/pub-imags.server.controller');
	// Tests Routes

    app.route('/dataImages/:dataImageId')
        .get(dataImages.readData);


	// Finish by binding the Test middleware
	app.param('dataImageId', dataImages.pubImagByID);
};

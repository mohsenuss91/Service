'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pubVideos = require('../../app/controllers/pub-videos.server.controller');

    app.route('/pub-videos/create')
        .post(pubVideos.upload);
	// Pub videos Routes
	app.route('/pub-videos')
		.get(pubVideos.list)
		.post(users.requiresLogin, pubVideos.create);

	app.route('/pub-videos/:pubVideoId')
		.get(pubVideos.read)
		.put(users.requiresLogin, pubVideos.hasAuthorization, pubVideos.update)
		.delete(users.requiresLogin, pubVideos.hasAuthorization, pubVideos.delete);

	// Finish by binding the Pub video middleware
	app.param('pubVideoId', pubVideos.pubVideoByID);
};

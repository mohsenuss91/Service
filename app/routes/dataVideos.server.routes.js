/**
 * Created by 15-D010sk on 24/05/2015.
 */
'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var dataVideos = require('../../app/controllers/pub-videos.server.controller');
    // Tests Routes

    app.route('/dataVideos/:dataVideoId')
        .get(dataVideos.readData);


    // Finish by binding the Test middleware
    app.param('dataVideoId', dataVideos.pubVideoByID);
};

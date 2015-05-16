'use strict';

//Setting up route
angular.module('pub-videos').config(['$stateProvider',
	function($stateProvider) {
		// Pub videos state routing
		$stateProvider.
		state('listPubVideos', {
			url: '/pub-videos',
			templateUrl: 'modules/pub-videos/views/list-pub-videos.client.view.html'
		}).
		state('createPubVideo', {
			url: '/pub-videos/create',
			templateUrl: 'modules/pub-videos/views/create-pub-video.client.view.html'
		}).
		state('viewPubVideo', {
			url: '/pub-videos/:pubVideoId',
			templateUrl: 'modules/pub-videos/views/view-pub-video.client.view.html'
		}).
		state('editPubVideo', {
			url: '/pub-videos/:pubVideoId/edit',
			templateUrl: 'modules/pub-videos/views/edit-pub-video.client.view.html'
		});
	}
]);
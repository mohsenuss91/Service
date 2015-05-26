'use strict';

//Tests service used to communicate Tests REST endpoints
angular.module('dataVideos').factory('DataVideos', ['$resource',
	function($resource) {
		return $resource('dataVideos/:dataVideoId', { testId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

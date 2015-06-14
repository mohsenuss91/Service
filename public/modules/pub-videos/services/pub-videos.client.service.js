'use strict';

//Pub videos service used to communicate Pub videos REST endpoints
angular.module('pub-videos').factory('PubVideos', ['$resource',
	function($resource) {
		return $resource('pub-videos/:pubVideoId', { pubVideoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


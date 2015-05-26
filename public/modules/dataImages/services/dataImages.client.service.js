'use strict';

//Tests service used to communicate Tests REST endpoints
angular.module('dataImages').factory('DataImages', ['$resource',
	function($resource) {
		return $resource('dataImages/:dataImageId', { testId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

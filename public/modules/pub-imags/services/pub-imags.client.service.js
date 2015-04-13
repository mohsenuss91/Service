'use strict';

//Pub imags service used to communicate Pub imags REST endpoints
angular.module('pub-imags').factory('PubImags', ['$resource',
	function($resource) {
		return $resource('pub-imags/:pubImagId', {
            pubImagId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

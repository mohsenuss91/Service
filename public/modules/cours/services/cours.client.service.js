'use strict';

//Cours service used to communicate Cours REST endpoints
angular.module('cours').factory('Cours', ['$resource',
	function($resource) {
		return $resource('cours/:courId', { courId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
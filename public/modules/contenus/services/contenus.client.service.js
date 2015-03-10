'use strict';

//Contenus service used to communicate Contenus REST endpoints
angular.module('contenus').factory('Contenus', ['$resource',
	function($resource) {
		return $resource('contenus/:contenuId', { contenuId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Offres service used to communicate Offres REST endpoints
angular.module('offres').factory('Offres', ['$resource',
	function($resource) {
		return $resource('offres/:offreId', { offreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
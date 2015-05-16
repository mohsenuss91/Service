'use strict';

//Setting up route
angular.module('upload').config(['$stateProvider',
	function($stateProvider) {
		// Upload state routing
		$stateProvider.
		state('test-exempleclientview', {
			url: '/test-exempleclientview',
			templateUrl: 'modules/upload/views/test-exempleclientview.client.view.html'
		}).
		state('exemple', {
			url: '/exemple',
			templateUrl: 'modules/upload/views/exemple.client.view.html'
		});
	}
]);
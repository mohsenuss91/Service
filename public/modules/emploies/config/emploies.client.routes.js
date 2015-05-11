'use strict';

//Setting up route
angular.module('emploies').config(['$stateProvider',
	function($stateProvider) {
		// Emploies state routing
		$stateProvider.
		state('listEmploies', {
			url: '/emploies',
			templateUrl: 'modules/emploies/views/list-emploies.client.view.html'
		}).
		state('createEmploie', {
			url: '/emploies/create',
			templateUrl: 'modules/emploies/views/create-emploie.client.view.html'
		}).
		state('viewEmploie', {
			url: '/emploies/:emploieId',
			templateUrl: 'modules/emploies/views/view-emploie.client.view.html'
		}).
		state('editEmploie', {
			url: '/emploies/:emploieId/edit',
			templateUrl: 'modules/emploies/views/edit-emploie.client.view.html'
		});
	}
]);
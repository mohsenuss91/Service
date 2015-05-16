'use strict';

//Setting up route
angular.module('signalements').config(['$stateProvider',
	function($stateProvider) {
		// Signalements state routing
		$stateProvider.
		state('listSignalements', {
			url: '/signalements',
			templateUrl: 'modules/signalements/views/list-signalements.client.view.html'
		}).
		state('createSignalement', {
			url: '/signalements/create',
			templateUrl: 'modules/signalements/views/create-signalement.client.view.html'
		}).
		state('viewSignalement', {
			url: '/signalements/:signalementId',
			templateUrl: 'modules/signalements/views/view-signalement.client.view.html'
		}).
		state('editSignalement', {
			url: '/signalements/:signalementId/edit',
			templateUrl: 'modules/signalements/views/edit-signalement.client.view.html'
		});
	}
]);
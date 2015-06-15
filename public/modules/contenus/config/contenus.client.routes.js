'use strict';

//Setting up route
angular.module('contenus').config(['$stateProvider',
	function($stateProvider) {
		// Contenus state routing
		$stateProvider.
		state('listContenus', {
				url: '/contenus',
				views : {
					'':{
						templateUrl: 'modules/contenus/views/list-contenus.client.view.html'
					},
					'offre': {
						templateUrl: 'modules/offres/views/list-offres.client.view.html'
					}
				}
		}).
		state('listContenus.offre', {
			url: '/contenus/offre',
			views : {
				'':{
					templateUrl: 'modules/contenus/views/list-contenus.client.view.html'
				},
				'offre': {
					templateUrl: 'modules/offres/views/list-offres.client.view.html'
				}
			}
		}).
		state('createContenu', {
			url: '/contenus/create',
			templateUrl: 'modules/contenus/views/create-contenu.client.view.html'
		}).
		state('viewContenu', {
			url: '/contenus/:contenuId',
			templateUrl: 'modules/contenus/views/view-contenu.client.view.html'
		}).
		state('editContenu', {
			url: '/contenus/:contenuId/edit',
			templateUrl: 'modules/contenus/views/edit-contenu.client.view.html'
		});
	}
]);

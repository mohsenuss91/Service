'use strict';

//Setting up route
angular.module('categories').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('listCategories', {
			url: '/categories',
			templateUrl: 'modules/categories/views/list-categories.client.view.html'
		}).
		state('createCategorie', {
			url: '/categories/create',
			templateUrl: 'modules/categories/views/create-categorie.client.view.html'
		}).
		state('viewCategorie', {
			url: '/categories/:categorieId',
			templateUrl: 'modules/categories/views/view-categorie.client.view.html'
		}).
		state('editCategorie', {
			url: '/categories/:categorieId/edit',
			templateUrl: 'modules/categories/views/edit-categorie.client.view.html'
		});
	}
]);
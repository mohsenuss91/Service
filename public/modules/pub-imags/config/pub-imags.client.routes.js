'use strict';

//Setting up route
angular.module('pub-imags').config(['$stateProvider',
	function($stateProvider) {
		// Pub imags state routing
		$stateProvider.
		state('listPubImags', {
			url: '/pub-imags',
			templateUrl: 'modules/pub-imags/views/list-pub-imags.client.view.html'
		}).
		state('createPubImag', {
			url: '/pub-imags/create',
			templateUrl: 'modules/pub-imags/views/create-pub-imag.client.view.html'
		}).
		state('viewPubImag', {
			url: '/pub-imags/:pubImagId',
			templateUrl: 'modules/pub-imags/views/view-pub-imag.client.view.html'
		}).
		state('editPubImag', {
			url: '/pub-imags/:pubImagId/edit',
			templateUrl: 'modules/pub-imags/views/edit-pub-imag.client.view.html'
		});
	}
]);
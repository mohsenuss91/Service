'use strict';

//Setting up route
angular.module('admins').config(['$stateProvider',
	function($stateProvider) {
		// Admins state routing
		$stateProvider.
		state('listUsersAdmins', {
			url: '/admin/users',
			templateUrl: 'modules/admins/views/list-users-admin.client.view.html'
		}).
		state('listSignalementsAdmins', {
			url: '/admin/signalements',
			templateUrl: 'modules/admins/views/list-signalement-admin.client.view.html'
		}).
		state('viewAdmin', {
			url: '/admins/:adminId',
			templateUrl: 'modules/admins/views/view-admin.client.view.html'
		}).
		state('editAdmin', {
			url: '/admins/:adminId/edit',
			templateUrl: 'modules/admins/views/edit-admin.client.view.html'
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('notifications').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('y', 'Notifications', 'notifications', 'dropdown', '/notifications(/create)?');
		Menus.addSubMenuItem('y', 'notifications', 'List Notifications', 'notifications');
		Menus.addSubMenuItem('y', 'notifications', 'New Notification', 'notifications/create');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('signalements').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('y', 'Signalements', 'signalements', 'dropdown', '/signalements(/create)?');
		Menus.addSubMenuItem('y', 'signalements', 'List Signalements', 'signalements');
		Menus.addSubMenuItem('y', 'signalements', 'New Signalement', 'signalements/create');
	}
]);
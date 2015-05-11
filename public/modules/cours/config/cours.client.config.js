'use strict';

// Configuring the Articles module
angular.module('cours').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('y', 'Cours', 'cours', 'dropdown', '/cours(/create)?');
		Menus.addSubMenuItem('y', 'cours', 'List Cours', 'cours');
		Menus.addSubMenuItem('y', 'cours', 'New Cour', 'cours/create');
	}
]);
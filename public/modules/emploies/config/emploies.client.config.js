'use strict';

// Configuring the Articles module
angular.module('emploies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('y', 'Emploies', 'emploies', 'dropdown', '/emploies(/create)?');
		Menus.addSubMenuItem('y', 'emploies', 'List Emploies', 'emploies');
		Menus.addSubMenuItem('y', 'emploies', 'New Emploie', 'emploies/create');
	}
]);
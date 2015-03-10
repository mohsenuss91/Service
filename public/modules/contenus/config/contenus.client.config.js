'use strict';

// Configuring the Articles module
angular.module('contenus').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Contenus', 'contenus', 'dropdown', '/contenus(/create)?');
		Menus.addSubMenuItem('topbar', 'contenus', 'List Contenus', 'contenus');
		Menus.addSubMenuItem('topbar', 'contenus', 'New Contenu', 'contenus/create');
	}
]);
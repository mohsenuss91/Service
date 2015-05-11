'use strict';

// Configuring the Articles module
angular.module('moderations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('y', 'Moderations', 'moderations', 'dropdown', '/moderations(/create)?');
		Menus.addSubMenuItem('y', 'moderations', 'List Moderations', 'moderations');
		Menus.addSubMenuItem('y', 'moderations', 'New Moderation', 'moderations/create');
	}
]);
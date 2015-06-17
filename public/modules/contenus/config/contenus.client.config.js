'use strict';

// Configuring the Articles module
angular.module('contenus').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Contenus', 'contenus', 'icon-ship-wheel', '/contenus(/create)?');
		Menus.addMenuItem('topbar', 'Profile', 'profile', 'icon-user-1', '/profile(/create)?');
		Menus.addMenuItem('topbar', 'Utilisateurs', 'listUser', 'fa fa-group', '/listUser(/create)?');
		Menus.addMenuItem('topbar', 'Administrateur', 'admin/users', 'icon-comment-fill-1', '/evenements(/create)?',false,['administrateur']);
		Menus.addMenuItem('topbar', 'Affectation', 'affectations', 'icon-user-1', '/evenements(/create)?',false,['administrateur']);
	}
]);

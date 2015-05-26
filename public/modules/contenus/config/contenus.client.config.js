'use strict';

// Configuring the Articles module
angular.module('contenus').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Contenus', 'contenus', 'icon-ship-wheel', '/contenus(/create)?');
		Menus.addMenuItem('topbar', 'Images', 'pub-imags', 'fa fa-picture-o', '/pub-imags(/create)?');
		Menus.addMenuItem('topbar', 'Videos', 'pub-videos', 'fa fa-group', '/pub-videos(/create)?');
		Menus.addMenuItem('topbar', 'Emplois', 'emploies', 'icon-user-1', '/emploies(/create)?');
		Menus.addMenuItem('topbar', 'Evenements', 'evenements', 'icon-comment-fill-1', '/evenements(/create)?');
	}
]);

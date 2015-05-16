'use strict';

// Configuring the Articles module
angular.module('pub-videos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pub videos', 'pub-videos', 'dropdown', '/pub-videos(/create)?');
		Menus.addSubMenuItem('topbar', 'pub-videos', 'List Pub videos', 'pub-videos');
		Menus.addSubMenuItem('topbar', 'pub-videos', 'New Pub video', 'pub-videos/create');
	}
]);
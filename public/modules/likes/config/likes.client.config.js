'use strict';

// Configuring the Articles module
angular.module('likes').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Likes', 'likes', 'dropdown', '/likes(/create)?');
        Menus.addSubMenuItem('topbar', 'likes', 'List Likes', 'likes');
        Menus.addSubMenuItem('topbar', 'likes', 'New Like', 'likes/create');
    }
]);

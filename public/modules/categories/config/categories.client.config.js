'use strict';

// Configuring the Articles module
angular.module('categories').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
         Menus.addSubMenuItem('y', 'categories', 'List Categories', 'categories');
         Menus.addSubMenuItem('y', 'categories', 'New Categorie', 'categories/create');*/
    }
]);

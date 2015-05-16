'use strict';

// Configuring the Articles module
angular.module('evenements').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Evenements', 'evenements', 'dropdown', '/evenements(/create)?');
         Menus.addSubMenuItem('y', 'evenements', 'List Evenements', 'evenements');
         Menus.addSubMenuItem('y', 'evenements', 'New Evenement', 'evenements/create');
         */
    }
]);

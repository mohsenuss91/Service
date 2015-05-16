'use strict';

// Configuring the Articles module
angular.module('affectations').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        //Menus.addMenuItem('y', 'Affectations', 'affectations', 'dropdown', '/affectations(/create)?');
        //Menus.addSubMenuItem('y', 'affectations', 'List Affectations', 'affectations');
        //Menus.addSubMenuItem('y', 'affectations', 'New Affectation', 'affectations/create');
    }
]);

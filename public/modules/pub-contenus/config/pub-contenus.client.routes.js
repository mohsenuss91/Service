'use strict';

//Setting up route
angular.module('pub-contenus').config(['$stateProvider',
    function ($stateProvider) {
        // Pub contenus state routing
        $stateProvider.
            state('pub-contenu', {
                url: '/pub-contenu',
                templateUrl: 'modules/pub-contenus/views/pub-contenu.client.view.html'
            });
    }
]);

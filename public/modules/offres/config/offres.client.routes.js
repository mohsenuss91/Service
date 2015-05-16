'use strict';

//Setting up route
angular.module('offres').config(['$stateProvider',
    function ($stateProvider) {
        // Offres state routing
        $stateProvider.
            state('listOffres', {
                url: '/offres',
                templateUrl: 'modules/offres/views/list-offres.client.view.html'
            }).
            state('createOffre', {
                url: '/offres/create',
                templateUrl: 'modules/offres/views/create-offre.client.view.html'
            }).
            state('viewOffre', {
                url: '/offres/:offreId',
                templateUrl: 'modules/offres/views/view-offre.client.view.html'
            }).
            state('editOffre', {
                url: '/offres/:offreId/edit',
                templateUrl: 'modules/offres/views/edit-offre.client.view.html'
            });
    }
]);

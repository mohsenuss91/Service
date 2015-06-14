'use strict';

//Setting up route
angular.module('affectations').config(['$stateProvider',
    function ($stateProvider) {
        // Affectations state routing
        $stateProvider.
            state('listAffectations', {
                url: '/affectations',
                templateUrl: 'modules/affectations/views/list-affectations.client.view.html'
            }).
            state('createAffectation', {
                url: '/affectations/create',
                templateUrl: 'modules/affectations/views/create-affectation.client.view.html'
            }).
            state('viewAffectation', {
                url: '/affectations/:affectationId',
                templateUrl: 'modules/affectations/views/view-affectation.client.view.html'
            }).
            state('editAffectation', {
                url: '/affectations/:affectationId/edit',
                templateUrl: 'modules/affectations/views/edit-affectation.client.view.html'
            });
    }
]);

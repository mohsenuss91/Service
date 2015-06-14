'use strict';

//Setting up route
angular.module('cours').config(['$stateProvider',
    function ($stateProvider) {
        // Cours state routing
        $stateProvider.
            state('listCours', {
                url: '/cours',
                templateUrl: 'modules/cours/views/list-cours.client.view.html'
            }).
            state('createCour', {
                url: '/cours/create',
                templateUrl: 'modules/cours/views/create-cour.client.view.html'
            }).
            state('viewCour', {
                url: '/cours/:courId',
                templateUrl: 'modules/cours/views/view-cour.client.view.html'
            }).
            state('editCour', {
                url: '/cours/:courId/edit',
                templateUrl: 'modules/cours/views/edit-cour.client.view.html'
            });
    }
]);

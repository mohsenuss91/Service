'use strict';

//Setting up route
angular.module('moderations').config(['$stateProvider',
    function ($stateProvider) {
        // Moderations state routing
        $stateProvider.
            state('listModerations', {
                url: '/moderations',
                templateUrl: 'modules/moderations/views/list-moderations.client.view.html'
            }).
            state('createModeration', {
                url: '/moderations/create',
                templateUrl: 'modules/moderations/views/create-moderation.client.view.html'
            }).
            state('viewModeration', {
                url: '/moderations/:moderationId',
                templateUrl: 'modules/moderations/views/view-moderation.client.view.html'
            }).
            state('editModeration', {
                url: '/moderations/:moderationId/edit',
                templateUrl: 'modules/moderations/views/edit-moderation.client.view.html'
            });
    }
]);

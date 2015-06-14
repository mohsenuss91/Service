'use strict';

//Moderations service used to communicate Moderations REST endpoints
angular.module('moderations').factory('Moderations', ['$resource',
    function ($resource) {
        return $resource('moderations/:moderationId', {
            moderationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

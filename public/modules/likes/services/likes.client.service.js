'use strict';

//Likes service used to communicate Likes REST endpoints
angular.module('likes').factory('Likes', ['$resource',
    function ($resource) {
        return $resource('statuses/:statusId/likes/:likeId', {
                statusId: '@statusId', likeId: '@_id'
            },
            {
                update: {
                    method: 'PUT'
                }
            });
    }
]);

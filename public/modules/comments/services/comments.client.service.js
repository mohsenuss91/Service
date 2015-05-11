'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
    function ($resource) {
        return $resource('statuses/:statusId/comments/:commentId', {
                statusId: '@statusId', commentId: '@_id'
            },
            {
                update: {
                    method: 'PUT'
                }
            });
    }
]);

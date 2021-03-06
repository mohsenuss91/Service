'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
    function ($resource) {
        return $resource('contenus/:contenuId/comments/:commentId', {
                contenuId: '@contenuId', commentId: '@_id'
            },
            {
                update: {
                    method: 'PUT'
                }
            });
    }
]);

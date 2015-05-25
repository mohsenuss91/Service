'use strict';

//Likes service used to communicate Likes REST endpoints
angular.module('likes').factory('Likes', ['$resource',
    function ($resource) {
        return $resource('contenus/:contenuId/likes/:likeId', {
                contenuId: '@contenuId', likeId: '@_id'
            },
            {
                update: {
                    method: 'PUT'
                }
            });
    }
]);

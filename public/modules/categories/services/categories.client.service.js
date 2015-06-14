'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
    function ($resource) {
        return $resource('categories/:categorieId', {
            categorieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

//Evenements service used to communicate Evenements REST endpoints
angular.module('evenements').factory('Evenements', ['$resource',
    function ($resource) {
        return $resource('evenements/:evenementId', {
            evenementId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

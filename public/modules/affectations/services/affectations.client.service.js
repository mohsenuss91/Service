'use strict';

//Affectations service used to communicate Affectations REST endpoints
angular.module('affectations').factory('Affectations', ['$resource',
    function ($resource) {
        return $resource('affectations/:affectationId', {
            affectationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

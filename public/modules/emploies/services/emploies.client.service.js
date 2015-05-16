'use strict';

//Emploies service used to communicate Emploies REST endpoints
angular.module('emploies').factory('Emploies', ['$resource',
    function ($resource) {
        return $resource('emploies/:emploieId', {
            emploieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

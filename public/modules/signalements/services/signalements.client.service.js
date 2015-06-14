'use strict';

//Signalements service used to communicate Signalements REST endpoints
angular.module('signalements').factory('Signalements', ['$resource',
    function ($resource) {
        return $resource('signalements/:signalementId', {
            signalementId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

//Admins service used to communicate Admins REST endpoints
angular.module('admins').factory('Admins', ['$resource',
	function($resource) {
		return $resource('admins/users/:userId', { userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('admins').factory('Admins', ['$resource',
    function($resource) {
        return $resource('admins/signalements/:signalementId', { signalementId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

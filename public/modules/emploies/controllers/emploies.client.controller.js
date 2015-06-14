'use strict';

// Emploies controller
angular.module('emploies').controller('EmploiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Emploies',
    function ($scope, $stateParams, $location, Authentication, Emploies) {
        $scope.authentication = Authentication;

        // Create new Emploie
        $scope.create = function () {
            // Create new Emploie object
            var emploie = new Emploies({
                name: this.name
            });

            // Redirect after save
            emploie.$save(function (response) {
                $location.path('emploies/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Emploie
        $scope.remove = function (emploie) {
            if (emploie) {
                emploie.$remove();

                for (var i in $scope.emploies) {
                    if ($scope.emploies [i] === emploie) {
                        $scope.emploies.splice(i, 1);
                    }
                }
            } else {
                $scope.emploie.$remove(function () {
                    $location.path('emploies');
                });
            }
        };

        // Update existing Emploie
        $scope.update = function () {
            var emploie = $scope.emploie;

            emploie.$update(function () {
                $location.path('emploies/' + emploie._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Emploies
        $scope.find = function () {
            $scope.emploies = Emploies.query();
        };

        // Find existing Emploie
        $scope.findOne = function () {
            $scope.emploie = Emploies.get({
                emploieId: $stateParams.emploieId
            });
        };
    }
]);

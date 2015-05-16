'use strict';

// Cours controller
angular.module('cours').controller('CoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cours',
    function ($scope, $stateParams, $location, Authentication, Cours) {
        $scope.authentication = Authentication;

        // Create new Cour
        $scope.create = function () {
            // Create new Cour object
            var cour = new Cours({
                name: this.name
            });

            // Redirect after save
            cour.$save(function (response) {
                $location.path('cours/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Cour
        $scope.remove = function (cour) {
            if (cour) {
                cour.$remove();

                for (var i in $scope.cours) {
                    if ($scope.cours [i] === cour) {
                        $scope.cours.splice(i, 1);
                    }
                }
            } else {
                $scope.cour.$remove(function () {
                    $location.path('cours');
                });
            }
        };

        // Update existing Cour
        $scope.update = function () {
            var cour = $scope.cour;

            cour.$update(function () {
                $location.path('cours/' + cour._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Cours
        $scope.find = function () {
            $scope.cours = Cours.query();
        };

        // Find existing Cour
        $scope.findOne = function () {
            $scope.cour = Cours.get({
                courId: $stateParams.courId
            });
        };
    }
]);

'use strict';

// Offres controller
angular.module('offres').controller('OffresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offres',
    function ($scope, $stateParams, $location, Authentication, Offres) {
        $scope.authentication = Authentication;

        // Create new Offre
        $scope.create = function () {
            // Create new Offre object
            var offre = new Offres({
                name: this.name
            });

            // Redirect after save
            offre.$save(function (response) {
                $location.path('offres/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Offre
        $scope.remove = function (offre) {
            if (offre) {
                offre.$remove();

                for (var i in $scope.offres) {
                    if ($scope.offres [i] === offre) {
                        $scope.offres.splice(i, 1);
                    }
                }
            } else {
                $scope.offre.$remove(function () {
                    $location.path('offres');
                });
            }
        };

        // Update existing Offre
        $scope.update = function () {
            var offre = $scope.offre;

            offre.$update(function () {
                $location.path('offres/' + offre._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Offres
        $scope.find = function () {
            $scope.offres = Offres.query();
        };

        // Find existing Offre
        $scope.findOne = function () {
            $scope.offre = Offres.get({
                offreId: $stateParams.offreId
            });
        };
    }
]);

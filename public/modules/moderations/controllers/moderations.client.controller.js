'use strict';

// Moderations controller
angular.module('moderations').controller('ModerationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moderations',
    function ($scope, $stateParams, $location, Authentication, Moderations) {
        $scope.authentication = Authentication;

        // Create new Moderation
        $scope.create = function () {
            // Create new Moderation object
            var moderation = new Moderations({
                name: this.name
            });

            // Redirect after save
            moderation.$save(function (response) {
                $location.path('moderations/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Moderation
        $scope.remove = function (moderation) {
            if (moderation) {
                moderation.$remove();

                for (var i in $scope.moderations) {
                    if ($scope.moderations [i] === moderation) {
                        $scope.moderations.splice(i, 1);
                    }
                }
            } else {
                $scope.moderation.$remove(function () {
                    $location.path('moderations');
                });
            }
        };

        // Update existing Moderation
        $scope.update = function () {
            var moderation = $scope.moderation;

            moderation.$update(function () {
                $location.path('moderations/' + moderation._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Moderations
        $scope.find = function () {
            $scope.moderations = Moderations.query();
        };

        // Find existing Moderation
        $scope.findOne = function () {
            $scope.moderation = Moderations.get({
                moderationId: $stateParams.moderationId
            });
        };
    }
]);

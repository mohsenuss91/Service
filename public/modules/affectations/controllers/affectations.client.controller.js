'use strict';

// Affectations controller
angular.module('affectations').controller('AffectationsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Affectations',
    function ($scope, $http, $stateParams, $location, Authentication, Affectations) {
        $scope.authentication = Authentication;

        // Find a list of Affectations
        $scope.findAffectations = function () {
            $http.get('affectations/')
                .success(function (response) {
                    console.log("i got the data affectationsList  " + response.length);
                    $scope.affectationsList = response;
                });
        };


        // Create new Affectation
        $scope.create = function () {
            // Create new Affectation object
            var affectation = new Affectations({
                titre: this.titre,
                description: this.description,
                type: this.type,
                semestre: this.semestre,
                specialite : this.specialite,
                annee : this.annee
            });

            // Redirect after save
            affectation.$save(function (response) {
                $location.path('affectations');

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Affectation
        $scope.remove = function (affectation) {
            if (affectation) {
                $http.delete("/affectations/" + affectation._id).success(function (response) {
                    $scope.findAffectations();
                });
            }
        };
        $scope.changeViewCreate = function(){
            $location.path('affectations/create');
        }
        $scope.changeViewListe = function(){
            $location.path('affectations');
        }

        // Update existing Affectation
        $scope.updateAffec = function (affectation) {
            var newAffectation = affectation;
            $http.put('affectations/'+affectation._id, newAffectation)
                .success(function (response) {
                });
        };


        // Find existing Affectation
        $scope.findOne = function () {
            $scope.affectation = Affectations.get({
                affectationId: $stateParams.affectationId
            });
        };
    }
]);

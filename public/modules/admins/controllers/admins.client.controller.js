'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Admins', 'Affectations',
	function($scope, $http, $stateParams, $location, Authentication, Admins, Affectations) {
		$scope.authentication = Authentication;


        //find the list of the users
        $scope.findUsers = function() {
            $http.get('admin/users/')
                .success(function (response) {
                    console.log("i got the data usersList  " + response.length);
                    $scope.usersList = response;
                });
            $http.get('affectations/')
                .success(function (response) {
                    console.log("i got the data affectationsList  " + response.length);
                    $scope.affectationsList = response;
                });
        };

        //bock the user
        $scope.bloquer= function(utilisateur){
            //var newUtilistateur = utilisateur
            utilisateur.bloque=!utilisateur.bloque;
            $http.put('admin/users/'+utilisateur._id, utilisateur)
                .success(function (response) {
                    $scope.findUsers();
                });
        };

        //update the user
        $scope.update= function(utilisateur){
            var newUtilistateur = utilisateur;
            //console.log("updating"+utilisateur.affectations[0]._id);
            $http.put('admin/users/'+utilisateur._id, newUtilistateur)
                .success(function (response) {
                    $scope.findUsers();
                });
        }

        //find the list of the signalements
        $scope.findSignalements = function() {
            $http.get('admin/signalements/')
                .success(function (response) {
                    console.log("i got the data usersList  " + response.length);
                    $scope.signalementsList = response;
                });
        };

        //accepter un signalement
        $scope.acceptSignalement= function(signalement){
            if(!signalement.user_signale.bloque){
                $http.put('admin/signalements/'+signalement._id)
                    .success(function (response) {
                        $scope.findSignalements();
                    });
            }
            else{
                $scope.supprimerSignalement(signalement);
            }
        }

        //accepter un signalement
        $scope.supprimerSignalement= function(signalement){
            $http.delete('admin/signalements/'+signalement._id)
                .success(function (response) {
                    $scope.findSignalements();
                });
        }

	}
]);

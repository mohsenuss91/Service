'use strict';

// Contenus controller
angular.module('contenus').controller('ContenusController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contenus',
	function($scope, $stateParams, $location, Authentication, Contenus) {
		$scope.authentication = Authentication;

		// Create new Contenu
		$scope.create = function() {
			// Create new Contenu object
			var contenu = new Contenus ({
				name: this.name
			});

			// Redirect after save
			contenu.$save(function(response) {
				$location.path('contenus/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contenu
		$scope.remove = function(contenu) {
			if ( contenu ) { 
				contenu.$remove();

				for (var i in $scope.contenus) {
					if ($scope.contenus [i] === contenu) {
						$scope.contenus.splice(i, 1);
					}
				}
			} else {
				$scope.contenu.$remove(function() {
					$location.path('contenus');
				});
			}
		};

		// Update existing Contenu
		$scope.update = function() {
			var contenu = $scope.contenu;

			contenu.$update(function() {
				$location.path('contenus/' + contenu._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contenus
		$scope.find = function() {
			$scope.contenus = Contenus.query();
		};

		// Find existing Contenu
		$scope.findOne = function() {
			$scope.contenu = Contenus.get({ 
				contenuId: $stateParams.contenuId
			});
		};
	}
]);
'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Evenements',
	function($scope, $stateParams, $location, Authentication, Evenements) {
		$scope.authentication = Authentication;

		// Create new Evenement
		$scope.create = function() {
			// Create new Evenement object
			var evenement = new Evenements ({
				name: this.name
			});

			// Redirect after save
			evenement.$save(function(response) {
				$location.path('evenements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Evenement
		$scope.remove = function(evenement) {
			if ( evenement ) { 
				evenement.$remove();

				for (var i in $scope.evenements) {
					if ($scope.evenements [i] === evenement) {
						$scope.evenements.splice(i, 1);
					}
				}
			} else {
				$scope.evenement.$remove(function() {
					$location.path('evenements');
				});
			}
		};

		// Update existing Evenement
		$scope.update = function() {
			var evenement = $scope.evenement;

			evenement.$update(function() {
				$location.path('evenements/' + evenement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Evenements
		$scope.find = function() {
			$scope.evenements = Evenements.query();
		};

		// Find existing Evenement
		$scope.findOne = function() {
			$scope.evenement = Evenements.get({ 
				evenementId: $stateParams.evenementId
			});
		};
	}
]);
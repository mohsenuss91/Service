'use strict';

// Signalements controller
angular.module('signalements').controller('SignalementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Signalements',
	function($scope, $stateParams, $location, Authentication, Signalements) {
		$scope.authentication = Authentication;

		// Create new Signalement
		$scope.create = function() {
			// Create new Signalement object
			var signalement = new Signalements ({
				name: this.name
			});

			// Redirect after save
			signalement.$save(function(response) {
				$location.path('signalements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Signalement
		$scope.remove = function(signalement) {
			if ( signalement ) { 
				signalement.$remove();

				for (var i in $scope.signalements) {
					if ($scope.signalements [i] === signalement) {
						$scope.signalements.splice(i, 1);
					}
				}
			} else {
				$scope.signalement.$remove(function() {
					$location.path('signalements');
				});
			}
		};

		// Update existing Signalement
		$scope.update = function() {
			var signalement = $scope.signalement;

			signalement.$update(function() {
				$location.path('signalements/' + signalement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Signalements
		$scope.find = function() {
			$scope.signalements = Signalements.query();
		};

		// Find existing Signalement
		$scope.findOne = function() {
			$scope.signalement = Signalements.get({ 
				signalementId: $stateParams.signalementId
			});
		};
	}
]);
'use strict';

// Affectations controller
angular.module('affectations').controller('AffectationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Affectations',
	function($scope, $stateParams, $location, Authentication, Affectations) {
		$scope.authentication = Authentication;

		// Create new Affectation
		$scope.create = function() {
			// Create new Affectation object
			var affectation = new Affectations ({
				name: this.name
			});

			// Redirect after save
			affectation.$save(function(response) {
				$location.path('affectations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Affectation
		$scope.remove = function(affectation) {
			if ( affectation ) { 
				affectation.$remove();

				for (var i in $scope.affectations) {
					if ($scope.affectations [i] === affectation) {
						$scope.affectations.splice(i, 1);
					}
				}
			} else {
				$scope.affectation.$remove(function() {
					$location.path('affectations');
				});
			}
		};

		// Update existing Affectation
		$scope.update = function() {
			var affectation = $scope.affectation;

			affectation.$update(function() {
				$location.path('affectations/' + affectation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Affectations
		$scope.find = function() {
			$scope.affectations = Affectations.query();
		};

		// Find existing Affectation
		$scope.findOne = function() {
			$scope.affectation = Affectations.get({ 
				affectationId: $stateParams.affectationId
			});
		};
	}
]);
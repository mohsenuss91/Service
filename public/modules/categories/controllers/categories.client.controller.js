'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;

		// Create new Categorie
		$scope.create = function() {
			// Create new Categorie object
			var categorie = new Categories ({
				name: this.name
			});

			// Redirect after save
			categorie.$save(function(response) {
				$location.path('categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Categorie
		$scope.remove = function(categorie) {
			if ( categorie ) { 
				categorie.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === categorie) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.categorie.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Categorie
		$scope.update = function() {
			var categorie = $scope.categorie;

			categorie.$update(function() {
				$location.path('categories/' + categorie._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Categorie
		$scope.findOne = function() {
			$scope.categorie = Categories.get({ 
				categorieId: $stateParams.categorieId
			});
		};
	}
]);
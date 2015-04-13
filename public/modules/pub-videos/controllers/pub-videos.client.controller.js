'use strict';

// Pub videos controller
angular.module('pub-videos').controller('PubVideosController', ['$scope', '$stateParams', '$location', 'Authentication', 'PubVideos',
	function($scope, $stateParams, $location, Authentication, PubVideos) {
		$scope.authentication = Authentication;

		// Create new Pub video
		$scope.create = function() {
			// Create new Pub video object
			var pubVideo = new PubVideos ({
				name: this.name
			});

			// Redirect after save
			pubVideo.$save(function(response) {
				$location.path('pub-videos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pub video
		$scope.remove = function(pubVideo) {
			if ( pubVideo ) { 
				pubVideo.$remove();

				for (var i in $scope.pubVideos) {
					if ($scope.pubVideos [i] === pubVideo) {
						$scope.pubVideos.splice(i, 1);
					}
				}
			} else {
				$scope.pubVideo.$remove(function() {
					$location.path('pub-videos');
				});
			}
		};

		// Update existing Pub video
		$scope.update = function() {
			var pubVideo = $scope.pubVideo;

			pubVideo.$update(function() {
				$location.path('pub-videos/' + pubVideo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pub videos
		$scope.find = function() {
			$scope.pubVideos = PubVideos.query();
		};

		// Find existing Pub video
		$scope.findOne = function() {
			$scope.pubVideo = PubVideos.get({ 
				pubVideoId: $stateParams.pubVideoId
			});
		};
	}
]);
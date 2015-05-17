'use strict';

// Pub videos controller
angular.module('pub-videos').controller('PubVideosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'PubVideos',
	function ($scope, $upload, $stateParams, $location, Authentication, PubVideos) {
		$scope.authentication = Authentication;

		var datafile;
		$scope.upload = function (files) {
			if (files && files.length) {
				var file = files[0];
				$upload.upload({
					method: 'POST',
					url: '/pub-videos/create',
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					document.getElementById('bar1').style.width = progressPercentage + "%";
				}).success(function (data, status, headers, config) {
					datafile = data;
					var path = data.path.replace(/\//g, '/').replace(/public/, '');

					$("#image").replaceWith("<video class='thumbnail' id='video' src=''></video>");
					document.getElementById('video').style.width = "170px";
					document.getElementById('video').style.height = "139px";
					document.getElementById('video').src = path;
					//document.getElementById('bar1').style.width="0%";
				});
			}
		};

		// Create new Pub video
		$scope.create = function() {
			// Create new Pub video object
			var pubVideo = new PubVideos ({
				datapubVideos: {
					description: this.description,
					file: {id_file_video: '', namefile: ''}
				},
				datafile: {file: datafile}
			});

			// Redirect after save
			pubVideo.$save(function(response) {
				//$location.path('pub-videos/' + response._id);
				$scope.find();
				// Clear form fields
				$scope.description = '';
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
					$location.path('pub-videos/create');
					$scope.find();
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

'use strict';

// Pub videos controller
angular.module('pub-videos').controller('PubVideosController', ['$scope','$upload', '$stateParams', '$location', 'Authentication', 'PubVideos','DataVideos',
	function($scope,$upload,$stateParams, $location, Authentication, PubVideos, DataVideos) {
		$scope.authentication = Authentication;

        $scope.video_data_thumbnail = "/images/260x180.png";
        $scope.upload = function(files) {
            if (files && files.length) {
                var file = files[0];
                $upload.upload({
                    method:'POST',
                    url:'/pub-videos/create',
                    file:file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    document.getElementById('bar1').style.width= progressPercentage+"%";
                }).success(function(data, status, headers, config) {
                    $scope.originalFile = data.originalFile;
                    $scope.video_data_thumbnail = data.data;
                    $scope.video_data_type = data.typeData;
                });
            }
        };

        // Create new Pub video
		$scope.create = function() {
			// Create new Pub video object
			var pubVideo = new PubVideos ({
<<<<<<< .merge_file_a09728
                id_file_video: $scope.file._id,
                description: $scope.description
=======
                id_file_original: this.originalFile._id,
                video_data_thumbnail:this.video_data_thumbnail,
                typeVideo: this.video_data_type,
                description: this.description
>>>>>>> .merge_file_a10992
            });

			// Redirect after save
			pubVideo.$save(function(response) {
                document.getElementById('bar1').style.width="0%";
                $scope.find();
                $scope.description= '';
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
            $scope.dataVideoUrl = DataVideos.get({
                dataVideoId: $stateParams.pubVideoId
            });
		};
	}
]);

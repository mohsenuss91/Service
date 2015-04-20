'use strict';

// Pub videos controller
angular.module('pub-videos').controller('PubVideosController', ['$scope', '$stateParams', '$location', 'Authentication', 'PubVideos',
	function($scope, $stateParams, $location, Authentication, PubVideos) {
		$scope.authentication = Authentication;

        var name,size,content;
        $scope.onFileSelect=function($files){
            var file;
            if($files[0] != null){
                file=$files[0];
                var imgType;
                imgType =file.name.split('.');
                imgType = imgType[imgType.length - 1].toLowerCase();
                $scope.name=file.name;
                size = file.size;
                name=file.name;
                var reader =new FileReader();
                reader.onprogress=function(e){
                    document.getElementById('bar1').style.width= parseInt(100.0 * e.loaded / e.total)+"%";
                }
                reader.onload = function () {
                    $( "#image" ).replaceWith( "<video  id='video' src=''></video>" );
                    document.getElementById('video').style.width = "181px";
                    document.getElementById('video').style.height = "125px";
                    document.getElementById('video').src = reader.result;
                    content=reader.result;
                    console.log(content);
                }
                reader.readAsDataURL(file);
            }
        }

        // Create new Pub video
		$scope.create = function() {
			// Create new Pub video object
			var pubVideo = new PubVideos ({
                file:{
                    name:name,
                    size:size,
                    content:content
                },
                description: this.description
			});

			// Redirect after save
			pubVideo.$save(function(response) {
				$location.path('pub-videos/' + response._id);

				// Clear form fields
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

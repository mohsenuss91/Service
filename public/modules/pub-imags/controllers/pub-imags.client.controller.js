'use strict';


// Pub imags controller
angular.module('pub-imags').controller('PubImagsController', ['$scope','$upload','$stateParams','$location', 'Authentication', 'PubImags','DataImages',
    function($scope,$upload,$stateParams,$location,Authentication, PubImags,DataImages) {
		$scope.authentication = Authentication;

        $scope.image_data_thumbnail = "/images/260x180.png";
        $scope.upload = function(files) {
            if (files && files.length) {
                var file = files[0];
                $upload.upload({
                    method:'POST',
                    url:'/pub-imags/create',
                    file: file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    document.getElementById('bar1').style.width= progressPercentage+"%";
                }).success(function(data, status, headers, config) {
					console.log(data);
                    $scope.originalFile = data.originalFile;
                    $scope.image_data_thumbnail = data.data;
                    $scope.image_data_type = data.typeData;
                });
            }
        };

        // Create new Pub imag
		$scope.create = function() {
			// Create new Pub imag object
			var pubImag = new PubImags ({
                id_file_original: this.originalFile._id,
                //image_data_thumbnail:this.image_data_thumbnail,
                typeImage: this.image_data_type,
                description: this.description
			});
            // Redirect after save
			pubImag.$save(function(response) {
				//$location.path('/pub-imags/'+response._id);
				// Clear form fields
                document.getElementById('bar1').style.width= "0%";
                $scope.find();
                $scope.image_data = "/images/260x180.png";
                $scope.image_data_type="";
				$scope.description= '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pub imag
		$scope.remove = function(pubImag) {
			if ( pubImag ) {
				pubImag.$remove();

				for (var i in $scope.pubImags) {
					if ($scope.pubImags [i] === pubImag) {
						$scope.pubImags.splice(i, 1);
					}
				}
			} else {
                $scope.pubImag.$remove(function() {
					$location.path('pub-imags/create');
				});
			}
		};

		// Update existing Pub imag
		$scope.update = function() {
			var pubImag = $scope.pubImag;

			pubImag.$update(function() {
				$location.path('pub-imags/' + pubImag._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pub imags
		$scope.find = function() {
			$scope.pubImags = PubImags.query();
		};

		// Find existing Pub imag
		$scope.findOne = function() {
            $scope.pubImag = PubImags.get({
				pubImagId: $stateParams.pubImagId
			});
            $scope.dataImageUrl = DataImages.get({
                dataImageId: $stateParams.pubImagId
            });
        };
	}
]);


'use strict';


// Pub imags controller
angular.module('pub-imags').controller('PubImagsController', ['$scope','$upload','$stateParams','$location', 'Authentication','PubImags','DataImages',
    function($scope,$upload,$stateParams,$location,Authentication, PubImags,DataImages) {
		$scope.authentication = Authentication;

        $scope.image_data_thumbnail = "/images/260x180.png";
        $scope.upload = this.upload = function(files) {
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
					console.log("success");
                    $scope.originalFile = data.originalFile;
                    $scope.image_data_thumbnail = data.data;
                    $scope.image_data_type = data.typeData;
                });
            }
        };

        // Create new Pub imag
		$scope.create = this.create = function() {
			console.log('create');
			// Create new Pub imag object
			var pubImag = new PubImags ({
                id_file_original: $scope.originalFile._id,
                //image_data_thumbnail:this.image_data_thumbnail,
                typeImage: $scope.image_data_type,
                description: $scope.description
			});
            // Redirect after save
			pubImag.$save(function(response) {
				//$location.path('/pub-imags/'+response._id);
				// Clear form fields
				response.user = Authentication.user;
				console.log('response in');
				console.log(response);
				$scope.contenus.push(response);
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
		$scope.update = this.update = function() {
			var pubImag = $scope.pubImag;

			pubImag.$update(function() {
				$location.path('pub-imags/' + pubImag._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pub imags
		$scope.find = function() {
			console.log('list');
			$scope.pubImags = PubImags.query(function(){
				var i=0;
				for (i=0;i<$scope.pubImags.length;i++){
					$scope.pubImags[i].dataImageUrl = DataImages.get({
						dataImageId: $scope.pubImags[i]._id
					});
				}
			});
		};

		// Find existing Pub imag
		$scope.findOne = this.findOne = function(id) {
			console.log(id);
            $scope.pubImag = PubImags.get({
				pubImagId: id
			});
            $scope.dataImageUrl = DataImages.get({
                dataImageId: id
            });
			console.log($scope.dataImageUrl);
        };
	}
]);


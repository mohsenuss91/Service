'use strict';


// Pub imags controller
angular.module('pub-imags').controller('PubImagsController', ['$scope','$upload','$stateParams','$location', 'Authentication', 'PubImags',
    function($scope,$upload,$stateParams,$location,Authentication, PubImags) {
		$scope.authentication = Authentication;
        var datafile;
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
                    datafile=data;
                    var path=data.path.replace(/\//g, '/').replace(/public/,'');
                    document.getElementById('image').style.width = "181px";
                    document.getElementById('image').style.height = "125px";
                    document.getElementById('image').src = path;
                    //document.getElementById('bar1').style.width="0%";
                });
            }
        };

        // Create new Pub imag
		$scope.create = function() {
			// Create new Pub imag object
			var pubImag = new PubImags ({
                datapubImages:{description: this.description,
                file:{id_file_image:'',namefilen:''}},
                datafile:{file:datafile}
			});
            // Redirect after save
			pubImag.$save(function(response) {
				//$location.path('/pub-imags/'+response._id);
				// Clear form fields
                $scope.find();
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
		};
	}
]);


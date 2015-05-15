'use strict';

// Pub imags controller
angular.module('pub-imags').controller('PubImagsController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'PubImags',
	function ($scope, $upload, $stateParams, $location, Authentication, PubImags) {
		$scope.authentication = Authentication;

		var name, size, content;
		$scope.onFileSelect = function ($files) {
			var file;
			if ($files[0] != null) {
				file = $files[0];
				var imgType;
				imgType = file.name.split('.');
				imgType = imgType[imgType.length - 1].toLowerCase();
				$scope.name = file.name;
				size = file.size;
				name = file.name;
				var reader = new FileReader();
				reader.onprogress = function (e) {
					document.getElementById('bar1').style.width = parseInt(100.0 * e.loaded / e.total) + "%";
                }
				reader.onload = function () {
					document.getElementById('image').style.width = "181px";
					document.getElementById('image').style.height = "125px";
					document.getElementById('image').src = reader.result;
					content = reader.result;
				}
				reader.readAsDataURL(file);
			}
        }

		// Create new Pub imag
		$scope.create = function() {
			// Create new Pub imag object
			var pubImag = new PubImags ({
				file: {
					name: name,
					size: size,
					content: content
				},
				description: this.description
			});
			pubImag.content = content;
			// Redirect after save
			pubImag.$save(function(response) {
				$location.path('pub-imags/' + response._id);
				// Clear form fields
				$scope.description = '';
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
					$location.path('pub-imags');
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


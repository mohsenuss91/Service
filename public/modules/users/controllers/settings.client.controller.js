'use strict';

angular.module('users').controller('SettingsController', ['$scope','$upload', '$http', '$location', 'Users', 'Authentication',
	function($scope, $upload,$http, $location, Users,Authentication) {
		$scope.user = Authentication.user;

        $scope.image_data_thumbnail = "/images/260x180.png";
        $scope.suivre="suivi+";
        $scope.upload = function(files) {
            if (files && files.length) {
                var file = files[0];
                $upload.upload({
                    method:'POST',
                    url:'/users',
                    file: file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    document.getElementById('bar1').style.width= progressPercentage+"%";
                }).success(function(data, status, headers, config) {
                    $scope.image_data_thumbnail =data.data;
                    $scope.image_data_type = data.typeData;
                });
            }
        };
        // If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
                $scope.user.file_image = $scope.image_data_thumbnail;
                $scope.user.typeImage = $scope.image_data_type;
                console.log($scope.user);
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
        /************************/
        $scope.find = function() {
            $scope.Users = Users.query();
        };
        /************************/
        $scope.ajoutSuiv = function(userOther){
            $scope.success = $scope.error = null;
            $scope.user.suit.push(userOther._id);
            userOther.estSuivi.push($scope.user._id);
            var userSuit = new Users({
                user:$scope.user,
                userOther:userOther
            });
            userSuit.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.suivre="accepter";
                $scope.find();
            }, function(response) {
                $scope.error = response.data.message;
            });
        }
        $scope.showlist=false;
        $scope.listSuivis=function(){
            $http.get('/users/me', {
            }).success(function(response) {
                $scope.EstSuivis=response.estSuivi;
                $scope.Suits=response.suit;
                $scope.showlist=true;
            }).error(function(response) {

            });
        }
	}
]);

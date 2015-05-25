'use strict';

// Likes controller
angular.module('likes').controller('LikesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Likes',
    function ($scope, $http, $stateParams, $location, Authentication, Likes) {
        $scope.authentication = Authentication;

        // Create new Like
        this.createLikeContenu = function (contenu) {
            // Create new Like object
            var like = new Likes({
                contenu: contenu._id
            });

            //console.log("LikesController is here" + contenu._id);
            // Redirect after save
            like.$save({contenuId: contenu._id},
                function (response) {
                    $scope.aime = true;
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }
            );
        };

        // Remove existing Like
        this.removeLikeContenu = function (contenu) {
            //console.log("like delete		" + contenu._id);
            $http.delete("contenus/" + contenu._id + "/likes/").success(function (response) {
                $scope.aime = false;
                //console.log("confirme demande de suppression delete		" + response.comment._id);
            });
        };

        // Update existing Like
        $scope.update = function () {
            var like = $scope.like;

            like.$update(function () {
                $location.path('likes/' + like._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Likes
        this.find = function (contenu) {
            $http.get('contenus/' + contenu._id + '/likes/')
                .success(function (response) {
                    //console.log("i got the data likesList  " + response.length);
                    $scope.likesList = response;
                    var like;
                    //console.log(" nember of likes for contenu ");
                    var i;
                    for (i = 0; i < $scope.likesList.length; i++) {
                        //if($scope.authentication.user._id == like.user)
                        if ($scope.authentication.user._id == $scope.likesList[i].user._id) {
                            console.log(" found of likes for contenu " + $scope.likesList[i].user._id);
                            $scope.aime = true;
                        }

                    }
                    ;
                });
            //$scope.likes = Likes.query();
        };

        // Find existing Like
        $scope.findOne = function () {
            $scope.like = Likes.get({
                likeId: $stateParams.likeId
            });
        };
    }
]);

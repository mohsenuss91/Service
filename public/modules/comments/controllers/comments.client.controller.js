'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments',
    function ($scope, $http, $stateParams, $location, Authentication, Comments) {
        $scope.authentication = Authentication;

        // Create new Comment
        this.createCommentStatus = function (status) {
            // Create new Comment object
            var comment = new Comments({
                name: $scope.name
            });

            console.log("CommentsController is here" + status._id);

            // Redirect after save
            comment.$save({statusId: status._id},
                function (response) {
                    //$location.path('statuses/' + status._id);

                    // Clear form fields
                    $scope.name = '';

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            this.find(status);
        };

        // Remove existing Comment
        this.removeCommentStatus = function (status, comment) {
            $http.delete("/statuses/" + status._id + "/comments/" + comment._id).success(function (response) {
                //console.log("confirme demande de suppression delete		" + response.comment._id);
            });
            //console.log("confirme demande de suppression delete		" + response._id + "   " + $scope.commentsList.length);
            this.find(status);
        };

        // Update existing Comment
        this.updateCommentStatus = function (status, comment) {
            var newComment = comment;
            //console.log("comment  " + comment.name);
            $http.put('statuses/' + status._id + '/comments/' + comment._id, newComment)
                .success(function (response) {
                    console.log("comment  " + response.name + " updated");
                });
        };

        // Find a list of Comments
        this.find = function (status) {
            $http.get('statuses/' + status._id + '/comments/')
                .success(function (response) {
                    console.log("i got the data contactList  " + response.length);
                    $scope.commentsList = response;
                });
        };

        // Find existing Comment
        $scope.findOne = function () {
            $scope.comment = Comments.get({
                commentId: $stateParams.commentId
            });
        };
    }
]);

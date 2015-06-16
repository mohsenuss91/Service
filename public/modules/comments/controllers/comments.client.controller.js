'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments','Moderationcomments',
    function ($scope, $http, $stateParams, $location, Authentication, Comments,Moderationcomments) {
        $scope.authentication = Authentication;

        // Create new Comment
        this.createCommentContenu = function (contenu) {
            // Create new Comment object
            var comment = new Comments({
                name: $scope.name
            });

            console.log("commentaire a �t� " + contenu._id);

            // Redirect after save
            comment.$save({contenuId: contenu._id},
                function (response) {
                    //$location.path('contenues/' + contenu._id);

                    /********************************************************/
                    var modertaionComment = new Moderationcomments({
                        contenuComment:response._id,
                        content_Url:'/#!/comments/'
                    });
                    modertaionComment.$save(function(response){
                        console.log(response)
                    },function(errResponse){
                        console.log(errResponse);
                    });
                /************************************************************/

                    // Clear form fields
                    $scope.name = '';

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            this.find(contenu);
        };

        // Remove existing Comment
        this.removeCommentContenu = function (contenu, comment) {
            $http.delete("/contenus/" + contenu._id + "/comments/" + comment._id).success(function (response) {
                //console.log("confirme demande de suppression delete		" + response.comment._id);
            });
            //console.log("confirme demande de suppression delete		" + response._id + "   " + $scope.commentsList.length);
            this.find(contenu);
        };

        // Update existing Comment
        this.updateCommentContenu = function (contenu, comment) {
            var newComment = comment;
            //console.log("comment  " + comment.name);
            $http.put('contenus/' + contenu._id + '/comments/' + comment._id, newComment)
                .success(function (response) {
                    console.log("comment  " + response.name + " updated");
                });
        };

        // Find a list of Comments
        this.find = function (contenu) {
            $http.get('contenus/' + contenu._id + '/comments/')
                .success(function (response) {
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

'use strict';

// Tests controller
angular.module('tests').controller('TestsController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Tests',
    function ($scope, $upload, $stateParams, $location, Authentication, Tests) {
        $scope.authentication = Authentication;
        var fileUploaded;
        $scope.upload = function (files) {
            if (files && files.length) {
                var file = files[0];
                $scope.nameFile = file.name;
                $upload.upload({
                    method: 'POST',
                    url: '/tests/create',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' +
                        evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    fileUploaded = data;
                    console.log('the file is uploaded');
                });
            }
        };
        // Create new Test
        $scope.create = function () {
            // Create new Test object
            var test = new Tests({
                name: fileUploaded.originalname,
                size: fileUploaded.size
            });
            // Redirect after save
            test.$save(function (response) {
                $location.path('tests/' + response._id);
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Test
        $scope.remove = function (test) {
            if (test) {
                test.$remove();

                for (var i in $scope.tests) {
                    if ($scope.tests [i] === test) {
                        $scope.tests.splice(i, 1);
                    }
                }
            } else {
                $scope.test.$remove(function () {
                    $location.path('tests');
                });
            }
        };

        // Update existing Test
        $scope.update = function () {
            var test = $scope.test;

            test.$update(function () {
                $location.path('tests/' + test._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Tests
        $scope.find = function () {
            $scope.tests = Tests.query();
        };

        // Find existing Test
        $scope.findOne = function () {
            $scope.test = Tests.get({
                testId: $stateParams.testId
            });
            console.log($scope.test);
        };
    }
]);

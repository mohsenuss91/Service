'use strict';

angular.module('upload').controller('ExempleController', ['$scope', '$upload', '$location',
    function ($scope, $upload, $location) {


        $scope.upload = function (files) {
            if (files && files.length) {
                var file = files[0];
                $scope.nameFile = file.name;
                $upload.upload({
                    url: '/test-exempleclientview',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' +
                        evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('the file is uploaded');
                });
            }
        };
    }
]);

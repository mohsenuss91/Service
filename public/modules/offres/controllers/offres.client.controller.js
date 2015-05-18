'use strict';

// Offres controller
angular.module('offres').controller('OffresController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Offres','$modal', '$log', '$http',
    function($scope, $http, $stateParams, $location, Authentication, Offres, $modal, $log) {
        $scope.authentication = Authentication;

        this.modalCreate = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/offres/views/create-offre.client.view.html',
                controller: function ($scope, $modalInstance, parentScope) {
                    $scope.create = function() {
                        // Create new Evenement object
                        console.log(entreprise);
                        var offre = new Offres ({
                            entreprise: $scope.entreprise,
                            post: $scope.poste,
                            competences: $scope.listCompetence,
                            documents :$scope.listDocument
                        });

                        // Redirect after save
                        offre.$save(function(response) {
                            //console.log("yow yow event has been created ");
                            parentScope.find();
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    };

                    $scope.ok = function () {
                        $scope.create();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    offre: function () {
                        return $scope.offre;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };

        // Open a modal window to update a single event record
        this.modalUpdate = function(size, selectedOffre){
            console.log("yow yow from modalUpdate");
            /*$scope.mytime = new Date();
             $scope.mytime.setHours( selectedEvent.date.getHours());
             $scope.mytime.setMinutes(selectedEvent.date.getMinutes());*/
            var modalInstance = $modal.open({
                templateUrl:'modules/offres/views/edit-offre.client.view.html',
                controller: function($scope, $modalInstance, offre) {
                    $scope.offre = offre;

                    $scope.ok = function () {
                        modalInstance.close($scope.offre);
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    offre: function(){
                        return selectedOffre;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (){
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        // Find a list of Evenements
        $scope.find = this.find = function() {
            $http.get('offres/')
                .success(function (response) {
                    console.log("i got the data offresList  " + response.length);
                    $scope.offresList = response;
                    //$scope.nbreComments = $scope.commentsList.length;
                });
            //$scope.evenements = Evenements.query();
            //console.log(" lenght of evenements list "+Evenements.query().length);
        };

        // Remove existing Evenement
        this.remove = function(offre) {
            if ( offre ) {
                offre.$remove();

                for (var i in $scope.offres) {
                    if ($scope.offres [i] === offre) {
                        $scope.offres.splice(i, 1);
                    }
                }
            } else {
                $scope.offres.$remove(function() {
                    //$location.path('offres');
                });
            }
        };

        // Find existing Evenement
        $scope.findOne = function() {
            $scope.offre = Evenements.get({
                offreId: $stateParams.offreId
            });
        };
    }]);

angular.module('offres').controller('OffresCreateController', ['$scope', 'Offres',
    function($scope, Offres) {

        // Create new Evenement
                this.create = function() {
            // Create new Evenement object
            var offre = new Offres ({
                entreprise: $scope.entreprise,
                post: $scope.poste,
                competences: $scope.listCompetence,
                documents : $scope.listDocument
            });


            // Redirect after save
            offre.$save(function(response) {
                //console.log("yow yow event has been created ");
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


angular.module('offres').controller('OffresUpdateController', ['$scope', 'Offres', '$http',
    function($scope, Offres, $http) {

        // Update existing Evenement
        this.update = function(updatedOffre) {
            var offre = updatedOffre;


             console.log("updating of evenement "+offre.competences);
             $http.put('offres/' + offre._id, offre)
             .success(function (response) {

             });
             /*evenement.$update(function() {
             //$location.path('evenements/' + evenement._id);
             }, function(errorResponse) {
             $scope.error = errorResponse.data.message;
             });*/
        };
    }
]);

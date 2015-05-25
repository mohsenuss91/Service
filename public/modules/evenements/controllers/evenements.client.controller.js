'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Evenements','$modal', '$log', '$http',
	function($scope, $http, $stateParams, $location, Authentication, Evenements, $modal, $log) {
        $scope.authentication = Authentication;

        this.modalCreate = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/evenements/views/create-evenement.client.view.html',
                controller: function ($scope, $modalInstance, parentScope) {
                    // Create new Evenement
                    $scope.create = function() {
                        $scope.dt.setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0)
                        //console.log("yow yow dt "+$scope.dt);

                        // Create new Evenement object
                        var evenement = new Evenements ({
                            titre: $scope.newEventTitle,
                            description: $scope.newEventDescription,
                            date: $scope.dt,
                            lieu : $scope.newEventPlace
                        });

                        // Redirect after save
                        evenement.$save(function(response) {
                            //console.log("yow yow event has been created ");
                            parentScope.find();
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    };

                    ///////////////////////////////////////////////
                    $scope.today = function() {
                        $scope.dt = new Date();
                    };
                    $scope.today();
                    $scope.clear = function () {
                        $scope.dt = null;
                    };
                    // Disable weekend selection
                    $scope.disabled = function(date, mode) {
                        return ( mode === 'day' && ( date.getDay() === 5 ) );
                    };
                    $scope.toggleMin = function() {
                        $scope.minDate = $scope.minDate ? null : new Date();
                    };
                    $scope.toggleMin();
                    $scope.open = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope.opened = true;
                    };
                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1
                    };
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[0];
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    var afterTomorrow = new Date();
                    afterTomorrow.setDate(tomorrow.getDate() + 2);
                    $scope.events =
                        [
                            {
                                date: tomorrow,
                                status: 'full'
                            },
                            {
                                date: afterTomorrow,
                                status: 'partially'
                            }
                        ];
                    $scope.getDayClass = function(date, mode) {
                        if (mode === 'day') {
                            var dayToCheck = new Date(date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                            for (var i=0;i<$scope.events.length;i++){
                                var currentDay = new Date($scope.events[i].date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                                if (dayToCheck === currentDay) {
                                    return $scope.events[i].status;
                                }
                            }
                        }
                        return '';
                    };
                    ///////////////////////////////////////////////////////////////

                    $scope.mytime = new Date();

                    $scope.hstep = 1;
                    $scope.mstep = 15;

                    $scope.options = {
                        hstep: [1, 2, 3],
                        mstep: [1, 5, 10, 15, 25, 30]
                    };

                    $scope.ismeridian = true;
                    $scope.toggleMode = function() {
                        $scope.ismeridian = ! $scope.ismeridian;
                    };
                    $scope.update = function() {
                        var d = new Date();
                        d.setHours( 14 );
                        d.setMinutes( 0 );
                        $scope.mytime = d;
                    };
                    $scope.clear = function() {
                        $scope.mytime = null;
                    };
                    $scope.ok = function () {
                        //console.log("yow yow from EvenementsController.ok()");
                        $scope.create();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },

                size: size,
                resolve: {
                    evenement: function () {
                        return $scope.evenement;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };

        // Open a modal window to update a single event record
        this.modalUpdate = function(size, selectedEvent){
            console.log("yow yow from modalUpdate");
            /*$scope.mytime = new Date();
            $scope.mytime.setHours( selectedEvent.date.getHours());
            $scope.mytime.setMinutes(selectedEvent.date.getMinutes());*/
            var modalInstance = $modal.open({
                templateUrl:'modules/evenements/views/edit-evenement.client.view.html',
                controller: function($scope, $modalInstance, evenement) {
                    $scope.evenement = evenement;

                    $scope.ok = function () {
                            modalInstance.close($scope.evenement);
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    evenement: function(){
                        return selectedEvent;
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
                $http.get('evenements/')
                    .success(function (response) {
                        console.log("i got the data contactList  " + response.length);
                        $scope.evenementsList = response;
                        //$scope.nbreComments = $scope.commentsList.length;
                    });
            //console.log(" lenght of evenements list "+Evenements.query().length);
        };

        // Remove existing Evenement
        this.remove = function(evenement) {
            $http.delete("/evenements/" + evenement._id).success(function (response) {
                $scope.find();
                //console.log("confirme demande de suppression		" + response.comment._id);
            });
        };

        // Find existing Evenement
        $scope.findOne = function() {
            $scope.evenement = Evenements.get({
                evenementId: $stateParams.evenementId
            });
        };
    }]);

angular.module('evenements').controller('EvenementsUpdateController', ['$scope', 'Evenements',
    function($scope, Evenements) {

        // Update existing Evenement
        this.update = function(updatedEvent) {
            var evenement = updatedEvent;
            evenement.date.getsetHours(updatedEvent.mytime.getHours(),updatedEvent.mytime.getMinutes(),0,0);

/*
            console.log("updating of evenement "+evenement._id+" date "+evenement.date);
            $http.put('evenements/' + evenement._id, newComment)
                .success(function (response) {
                    console.log("date  " + response.date + " updated");
                });
            /*evenement.$update(function() {
                //$location.path('evenements/' + evenement._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });*/
        };

        ///////////////////////////////////////////////
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 5 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        };
        ///////////////////////////////////////////////////////////////

        $scope.mytime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };
    }
]);

'use strict';

var movementController = angular.module('movementController', []);

movementController.controller('movementController', ['$scope', '$stateParams', 'Movement','Action',
    function($scope, $stateParams, Movement, Action) {
        $scope.movementStatus = 'empty';

        if ($stateParams.movementId) {
            Movement.get({id: $stateParams.movementId}).$promise
                .then(function (response) {
                    $scope.movement = response.resources;
                    $scope.movementStatus = 'success';
                }).catch(function(error){ $scope.movementStatus = 'error'; });
        }
        else if ($stateParams.query){
            Movement.query({query: $stateParams.q}).$promise
                .then(function(response){
                    $scope.movements = response.resources;
                    $scope.movementStatus = 'success';
                }).catch(function(error){ $scope.movementStatus = 'error'; });
        }
        else {
            $scope.movement = new Movement();
            $scope.movements = [];
        }

        //$scope.actions = Action.query({id: $stateParams.movementId});

        $scope.addMovement = function () {
            var mov = new Movement();
            mov.resources = [];
            mov.resources.push($scope.movement);
            mov.$add()
                .then(function(response){ $scope.movementStatus = 'success'; })
                .catch(function(error){ $scope.movementStatus = 'error'; });

            return $scope.movementStatus;
        };

        $scope.modifyMovement = function () {
            $scope.movement.$modify()
                .then(function(response){ $scope.movementStatus = 'success'; })
                .catch(function(error){ $scope.movementStatus = 'error'; });

            return $scope.movementStatus;
        };

        $scope.queryMovements = function(query){
            Movement.query({query: query}).$promise
                .then(function(response){
                    $scope.movements = response.resources;
                    $scope.movementStatus = 'success';
                }).catch(function(error){ $scope.movementStatus = 'error'; });

            return $scope.movementStatus;
        };

        $scope.deleteMovement = function(){
            $scope.movement.$remove()
                .then(function(response){
                    $scope.movements = response.resources;
                    $scope.movementStatus = 'success';
                }).catch(function(error){ $scope.movementStatus = 'error'; });

            return $scope.movementStatus;
        };
    }]);

'use strict';

var searchController = angular.module('searchController', []);

searchController.controller('searchController', ['$scope', '$stateParams', 'Movement', '$state',
    function($scope, $stateParams, Movement, $state){
        $scope.movementStatus = 'empty';
        $scope.query = $stateParams.query;

        if($stateParams.query) {
            Movement.query({query: $scope.query}).$promise
                .then(function(response){
                    $scope.movements = response.resources;
                    $scope.movementStatus = 'success';
                }).catch(function(error){ $scope.movementStatus = 'error'; });
        }
        else {
            Movement.query().$promise
                .then(function(response){
                    $scope.movements = response.resources;
                    $scope.movementStatus = 'success';
                }).catch(function(error){ $scope.movementStatus = 'error'; });
        }

        $scope.search = function(query){ $state.go('search', {"query":query}); };
    }]);

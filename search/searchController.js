'use strict';

var searchController = angular.module('searchController', []);

searchController.controller('searchController', ['$scope', '$stateParams', 'movements', '$state',
    function($scope, $stateParams, movements, $state){
        $scope.query = $stateParams.query;
        $scope.movements = movements

        $scope.search = function(query){ $state.go('search', {"query":query}); };
    }]);

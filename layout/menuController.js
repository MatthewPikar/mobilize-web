'use strict'

var menuController= angular.module('menuController', [])

menuController.controller('menuController', ['$scope', '$state',
    function($scope, $state){
        $scope.search = function(query){ $state.go('search', {"query":query}); }



}]);
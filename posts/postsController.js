'use strict'

var postsController = angular.module('postsController', [])

postsController.controller('postsController', ['$scope','$state','LocalState','post',
    function($scope, $state, LocalState, post) {
        // Initialization
        $scope.post = post
        $scope.postState = new LocalState(['edit','new','view'])
        $scope.postState.set('view')


        // Resource Control
        $scope.addPost = function () {
            $scope.post.sourceId = $stateParams.movementId
            $scope.post.$add()
                .then(function(response){
                    angular.extend($scope.post, response)
                    $scope.go('movement.overview',{movementId:$stateParams.movementId})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.modifyPost = function () {
            $scope.post.$modify()
                .then(function(response){
                    angular.extend($scope.post, response)
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.deletePost = function () {
            $scope.post.$remove()
                .then(function(response){
                    return true
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }


        // Navigation
        $scope.go = function(state){
            $state.go(state)
        }
    }])
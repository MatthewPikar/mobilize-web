'use strict'

var postsController = angular.module('postsController', [])

postsController.controller('postsController', ['$scope','$state','LocalState','post',
    function($scope, $state, LocalState, post) {
        // Initialization
        $scope.post = post
        $scope.postState = new LocalState(['edit','new','view'])
        if (post.name)
            $scope.postState.set('view')
        else {
            $scope.postState.set('new')
            $scope.postState.toggle('edit')
        }


        // Resource Control
        $scope.addPost = function () {
            $scope.post.$add()
                .then(function(){
                    $scope.go('movement.overview',{movementId:$scope.movement.id}, {reload:true})
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
                    $scope.go('movement.post',{postId:$scope.post.id}, {reload:true})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.deletePost = function () {
            $scope.post.$remove()
                .then(function(){
                    $scope.go('movement.overview',{movementId:$scope.movement.id}, {reload:true})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }


        // Navigation
        $scope.go = function(state,params,options){
            $state.go(state, params, options)
        }
    }])
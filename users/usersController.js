(function () { "use strict"

    angular.module('usersController', []).controller('usersController', ['$scope','$state','LocalState','user',
        function($scope, $state, LocalState, user) {

            // Initialization
            $scope.user = user
            $scope.userState = new LocalState(['edit','new','view'])
            if (user.name)
                $scope.userState.set('view')
            else {
                $scope.userState.set('new')
                $scope.userState.toggle('edit')
            }


            // Resource Control
            $scope.addUser = function () {
                $scope.user.$add()
                    .then(function(response){
                        $scope.go('user',{userId:response.id}, {reload:true})
                    })
                    .catch(function(error){
                        console.log(error)
                        $scope.error = error
                    })
            }
            $scope.modifyUser = function () {
                $scope.user.$modify()
                    .then(function(response){
                        angular.extend($scope.user, response)
                        $scope.go('user',{userId:response.id}, {reload:true})
                    })
                    .catch(function(error){
                        console.log(error)
                        $scope.error = error
                    })
            }
            $scope.deleteUser = function () {
                $scope.user.$remove()
                    .then(function(){
                        $scope.go('root')
                    })
                    .catch(function(error){
                        console.log(error)
                        $scope.error = error
                    })
            }


            // Navigation
            $scope.go = function(state,params,options){ $state.go(state, params, options) }
        }])

}) ()
(function () { "use strict"

var eventsController = angular.module('eventsController', [])

eventsController.controller('eventsController', ['$scope','$state','event','LocalState','Datetime',
    function($scope, $state, event, LocalState, Datetime) {
        // Initialization
        $scope.eventState = new LocalState(['edit','new','view'])
        $scope.event = event

        if (event.name) {
            $scope.date = new Datetime(event.date)
            $scope.eventState.set('view')
        }
        else {
            $scope.date = new Datetime(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000)
            $scope.eventState.set('new')
            $scope.eventState.toggle('edit')
        }


        // Resource Control
        $scope.addEvent = function () {
            $scope.event.date = $scope.date.get()
            $scope.event.sourceId = $scope.movement.id
            $scope.event.$add()
                .then(function(){
                    $scope.go('movement.overview',{movementId:$scope.movement.id},{reload:true})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.modifyEvent = function () {
            $scope.event.date = $scope.date.get()
            $scope.event.$modify()
                .then(function(response){
                    angular.extend($scope.event, response)
                    $scope.go('movement.event',{eventId:response.id},{reload:true})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.deleteEvent = function () {
            $scope.event.$remove()
                .then(function(){
                    $scope.go('movement.overview',{movementId:$scope.movement.id},{reload:true})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }


        // Navigation
        $scope.go = function(state, params, options){ $state.go(state, params, options) }
    }])

}) ()
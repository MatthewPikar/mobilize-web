'use strict'

var movementController = angular.module('movementController', [])

movementController.controller('movementController', ['$scope', '$stateParams', '$state', '$uibModal', '$sce', 'Movement',
    function($scope, $stateParams, $state, $uibModal, $sce, Movement) {
        // Initialization
        if ($stateParams.movementId) {
            $scope.movement = new Movement()
            Movement.get({id: $stateParams.movementId}).$promise
                .then(function (response) {
                    angular.extend($scope.movement, response)
                    $scope.videoResource = $sce.trustAsResourceUrl($scope.movement.video)
                    $scope.description = $scope.movement.description
                }).catch(function(error){ $scope.error = error })
        }
        else {
            $scope.movements = Movement.query({query: $stateParams.query ? $stateParams.query : ''})
            $scope.movements.$promise
                .then(function(response){
                    $scope.movements = response
                    $scope.movementStatus = 'success'
                }).catch(function(error){ $scope.movementStatus = 'error' })
        }

        $scope.now = new Date(Date.now())

        $scope.MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC','None']

        // State flow
        $scope.state = {
            _zones: { name:false, description:false, video:false, image:false},
            _active: false,
            off: function() {
                for (var zone in $scope.state._zones)
                    if ($scope.state._zones.hasOwnProperty(zone)) $scope.state._zones[zone] = false
            },
            setActive: function(state){
                if (state === true) $scope.state._active = true
                else if (state === false) {
                    $scope.state.off()
                    $scope.state._active = false
                    $scope.modifyMovement()
                }
            },
            active: function(){
                return $scope.state._active
            },
            set: function(zone) {
                var currentState = $scope.state._zones[zone]
                $scope.state.off()
                $scope.state._zones[zone] = !currentState
                if (zone === 'video' && $scope.state._zones[zone] === true) $scope.openVideoModal()
                else if (zone === 'image'  && $scope.state._zones[zone] === true) $scope.openImageModal()
            },
            get:  function(state){ return $scope.state._zones[state] }
        }

        // Modals
        $scope.openVideoModal = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'movements/modalVideo.html',
                controller: 'modalVideoController',
                size: 'md',
                resolve:{
                    currentVideoUrl: function(){return $scope.movement.video}
                }
            })

            modalInstance.result
                .then(function(url){
                    $scope.movement.video = url
                    $scope.videoResource = $sce.trustAsResourceUrl($scope.movement.video)
                    $scope.state.set('video')
                })
                .catch(function(){
                    $scope.state.set('video')
                })
        }
        $scope.openImageModal = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'movements/modalImage.html',
                controller: 'modalImageController',
                size: 'md',
                resolve:{
                    currentImage: function(){return $scope.movement.image}
                }
            })

            modalInstance.result
                .then(function(imageName){
                    $scope.movement.image = imageName
                    $scope.state.set('image')
                })
                .catch(function(){
                    $scope.state.set('image')
                })
        }

        // Resource Control
        $scope.modifyMovement = function () {
            $scope.movement.$modify()
                .then(function(response){
                    angular.extend($scope.movement, response)
                })
                .catch(function(error){
                    $scope.error = error
                })
        }
        $scope.deleteMovement = function(){
            $scope.movement.$remove()
                .then(function(response){
                    $scope.movements = response.resources
                    $scope.movementStatus = 'success'
                }).catch(function(error){ $scope.movementStatus = 'error' })

            return $scope.movementStatus
        }

        // Navigation
        $scope.go = function(state, params){
            $state.go(state, params)
        }
    }])
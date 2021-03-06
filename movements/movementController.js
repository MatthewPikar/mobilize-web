(function () { "use strict"

var movementController = angular.module('movementController', [])

movementController.controller('movementController', ['$scope','$state','LocalState','$uibModal','$sce',
    'movement','posts','events','actions',
function($scope, $state, LocalState, $uibModal, $sce, movement, posts, events, actions) {
    $scope.actionTypes = {
        Share: {
            active: false,
            label: 'Share',
            icon: 'fa-bullhorn',
            description: 'Your message will be shared on social media on behalf of members.',
            fields: ['message']
        },
        Mail: {
            active: false,
            label: 'Mail',
            icon: 'fa-envelope-o',
            description: 'Provide a letter, which will be signed and sent on behalf of members.',
            helpText: '',
            fields: ['targets', 'message']
        },
        'E-mail': {
            active: false,
            label: 'E-mail',
            icon: 'fa-at',
            description: 'Provide an e-mail, which will be signed and sent on behalf of members.',
            fields: ['targets', 'message']
        },
        Petition: {
            active: false,
            label: 'Petition',
            icon: 'fa-clipboard',
            description: 'Provide a petition, which will be signed on behalf of members.',
            fields: ['targets', 'message']
        },
        Call: {
            active: false,
            label: 'Call',
            icon: 'fa-phone',
            description: 'Provide the talking points and members will pledge to call.',
            fields: ['targets', 'instructions']
        }
    }

    // Initialization
    $scope.masterState = $state
    $scope.now = new Date(Date.now())
    $scope.movement = movement
    $scope.sourceId = $scope.movement.id
    $scope.videoResource = $sce.trustAsResourceUrl($scope.movement.video)
    $scope.posts = posts
    $scope.events = events
    $scope.actions = actions

    if (events) {
        for (var e = 0, len = $scope.events.length; e < len; e++) {
            $scope.events[e].date = $scope.events[e].date ? new Date($scope.events[e].date) : false
        }
    }

    // State flow
    $scope.state = new LocalState(['view','edit','edit.name','edit.description','edit.video','edit.image'])
    $scope.state.set('view')

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
                $scope.state.set('edit.video')
            })
            .catch(function(){
                $scope.state.set('edit.video')
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
                $scope.state.set('edit.image')
            })
            .catch(function(){
                $scope.state.set('edit.image')
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
                $scope.go('root',{},{reload:true})
            }).catch(function(error){ $scope.error = 'error' })

        return $scope.movementStatus
    }

    // Navigation
    $scope.go = function(state, params, options){ $state.go(state, params, options) }
}])

}) ()
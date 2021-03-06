(function () { "use strict"

var actionsController = angular.module('actionsController', []);

actionsController.controller('actionsController', ['$scope','$state', 'action','LocalState','$uibModal',

function($scope, $state, action, LocalState, $uibModal){
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
    $scope.targetClasses = {
        President: {
            active: false,
            scope: ['national'],
            label: 'President',
            icon: 'fa-institution',
            description: 'Action will go out to the president of the United States of America.'
        },
        Senators: {
            active: false,
            scope: ['national', 'state'],
            label: 'Senators',
            icon: 'fa-institution',
            description: 'Members will be matched with senators from their state for the states you designate.'
        },
        Representatives: {
            active: false,
            scope: ['national', 'state'],
            label: 'Reps',
            icon: 'fa-institution',
            description: 'Members will be matched with district representatives for the districts you designate.'
        },
        Media: {
            active: false,
            scope: ['national', 'state'],
            label: 'Media',
            icon: 'fa-newspaper-o',
            description: 'Action will go out to news organizations you designate.'
        },
        Company: {
            active: false,
            scope: ['national'],
            label: 'Company',
            icon: 'fa-shopping-bag',
            description: 'Action will go out to company public relations departments.'
        },
        People: {
            active: false,
            scope: ['national'],
            label: 'Person(s)',
            icon: 'fa-group',
            description: 'Actions will go out to specific persons you designate.'
        }
    }

    // Initialization
    $scope.action = action
    $scope.actionState = new LocalState(['edit','new','view','type','name','target.class','target.detail','content.message'])

    if ($scope.action.id) {
        $scope.action.suspenseDate = new Date($scope.action.suspenseDate)
        $scope.actionState.set('view')
    }
    else {
        $scope.suspenseDate = new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000)
        $scope.actionState.set('new')
        $scope.actionState.toggle('edit')
    }

    $scope.setName = function() {
        $scope.action.name = $scope.actionTypes[$scope.action.type].label + ' your ' +
            $scope.targetClasses[$scope.action.target.class].label
    }


    $scope.openPreviewModal = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'actions/modalPreview.html',
            controller: 'modalPreviewController',
            size: 'lg',
            //openedClass: 'printed-page letter',
            windowClass: 'print-preview',
            resolve:{
                action: function(){return $scope.action}
            }
        })

        modalInstance.result
            .catch(function(error){
                $scope.error = error
            })
    }


    // Resource Control
    $scope.addAction = function () {
        $scope.action.sourceId = $scope.movement.id
        $scope.action.$add()
            .then(function(response){
                angular.extend($scope.action, response)
                $scope.go('movement.action',{actionId:response.id},{reload:true})
            })
            .catch(function(error){
                console.log(error)
                $scope.error = error
            })
    }
    $scope.modifyAction = function () {
        $scope.action.suspenseDate = $scope.suspenseDate.get()
        $scope.action.$modify()
            .then(function(response){
                angular.extend($scope.action, response)
                $scope.go('movement.action',{actionId:response.id},{reload:true})
            })
            .catch(function(error){
                console.log(error)
                $scope.error = error
            })
    }
    $scope.deleteAction = function () {
        $scope.action.$remove()
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
    /*$scope.scrollTo = function(location) {
        $location.hash(location)
        $anchorScroll()
    }*/
}])

}) ()
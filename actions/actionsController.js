(function () { "use strict"

var actionsController = angular.module('actionsController', []);

actionsController.controller('actionsController', ['$scope','$state', 'action','LocalState',

function($scope, $state, action, LocalState){
    $scope.actionTypes = {
        social: {
            active: false,
            label: 'Social Post',
            icon: 'fa-bullhorn',
            description: 'Your message will be shared on social media on behalf of members.',
            fields: ['message']
        },
        letter: {
            active: false,
            label: 'Letter',
            icon: 'fa-envelope-o',
            description: 'Provide a letter, which will be signed and sent on behalf of members.',
            fields: ['targets', 'message']
        },
        email: {
            active: false,
            label: 'E-mail',
            icon: 'fa-at',
            description: 'Provide an e-mail, which will be signed and sent on behalf of members.',
            fields: ['targets', 'message']
        },
        petition: {
            active: false,
            label: 'Petition',
            icon: 'fa-clipboard',
            description: 'Provide a petition, which will be signed on behalf of members.',
            fields: ['targets', 'message']
        },
        phone: {
            active: false,
            label: 'Phone Call',
            icon: 'fa-phone',
            description: 'Provide the talking points and members will pledge to call.',
            fields: ['targets', 'instructions']
        }
    }
    $scope.targets = [
        {
            active: false,
            scope: ['national'],
            label: 'the president',
            icon: 'fa-institution',
            description: 'Action will go out to the president of the United States of America.'
        },
        {
            active: false,
            scope: ['national','state'],
            label: 'senators',
            icon: 'fa-institution',
            description: 'Members will be matched with senators from their state for the states you designate.'
        },
        {
            active: false,
            scope: ['national','state'],
            label: 'representatives',
            icon: 'fa-institution',
            description: 'Members will be matched with district representatives for the districts you designate.'
        },
        {
            active: false,
            scope: ['national','state'],
            label: 'the media',
            icon: 'fa-newspaper-o',
            description: 'Action will go out to news organizations you designate.'
        },
        {
            active: false,
            scope: ['national'],
            label: 'companies',
            icon: 'fa-shopping-bag',
            description: 'Action will go out to company public relations departments.'
        },
        {
            active: false,
            scope: ['national'],
            label: 'persons',
            icon: 'fa-group',
            description: 'Actions will go out to specific persons you designate.'
        }
    ]

    // Initialization
    $scope.action = action
    $scope.actionState = new LocalState(['edit','new','view','type','content','content.target','content.targetDetail','content.message'])

    if ($scope.action.id) {
        $scope.action.suspenseDate = new Date($scope.action.suspenseDate)
        $scope.actionState.set('view')
    }
    else {
        $scope.action.suspenseDate = new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000)
        $scope.actionState.set('new')
        $scope.actionState.toggle('edit')
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
'use strict'

var movementController = angular.module('newMovementController', [])

movementController.controller('newMovementController', ['$scope', '$stateParams', '$state', 'Movement',
    function($scope, $stateParams, $state, Movement) {
        $scope.movement = {
            topic: '',
            type: {
                federal: {state: false, value: 'U.S.'},
                state: {state: false, value: ''},
                local: {state: false, value: ''},
                corporate: {state: false, value: ''}
            },
            name: ''
        }

        //$scope.topicReady = false
        $scope.topicSummaryCollapsed = true
        $scope.typeCollapsed = true
        $scope.typeSummaryCollapsed = true
        $scope.nameCollapsed = true
        $scope.nameSummaryCollapsed = true
        $scope.descriptionCollapsed = true
        $scope.descriptionSummaryCollapsed = true
        $scope.typeTruthy = false

        $scope.error = ''

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
        $scope.topicVerbs = [
            {name:'Protect'},{name:'Pass'},{name:'Abolish'},{name:'Vote against'},
            {name: 'Support'},{name:'Reform'},{name:'Enact'}
        ]
        $scope.exampleTopics = [
                {name:'TPP'}, {name:'School Board'}, {name:'Election'}, {name:'Economy'},
                {name:'Terrorism'}, {name:'Feminism'}, {name:'Gun Control'}, {name:'Crime'},
                {name:'Fiscal Responsibility'},{name:'Net Neutrality'}, {name:'Environment'}, {name:'Jobs'},
                {name:'Financial Aid'}, {name:'Debt'},{name:'Scool Loans'}, {name:'Small Business'},
                {name:'Budget'}
        ]

        $scope.addTopic = function(topic){
            $scope.movement.topic += ($scope.movement.topic === '') ? topic : (' ' + topic)
        }

        $scope.type = {
            value:'',
            detail:''
        }
        $scope.getTypeTruthy = function(){
            return $scope.type && $scope.movement.type
        }

        /*$scope.setTypeContent = function() {
            var values = [], count = 0, value = ''

            if ($scope.movement.type.federal.state) values[count++] = $scope.movement.type.federal.value
            if ($scope.movement.type.state.state) values[count++] = $scope.movement.type.state.value
            if ($scope.movement.type.local.state) values[count++] = $scope.movement.type.local.value
            if ($scope.movement.type.corporate.state) values[count++] = $scope.movement.type.corporate.value

            for (var i=0; i < count; i++) {
                value += (i===0) ? values[i] : ( i < (count-1) ) ? ', ' + values[i] : ' and ' + values[i]
            }

            if ($scope.movement.name === '') $scope.movement.name = $scope.movement.topics + ' in ' + value
            return $scope.typeContent = value
        }*/

        $scope.setName = function() {
            return $scope.movement.name = ($scope.movement.name=== '') ?
                $scope.movement.topic + ' in ' + $scope.movement.type :
                $scope.movement.name
        }

        $scope.addMovement = function () {
            var mov = new Movement()
            mov.resources = []
            mov.resources.push($scope.movement)
            mov.$add()
                .then(function(response){
                    $scope.error = JSON.stringify(response)
                    $state.go('movement.overview',{movementId:response.id})
                })
                .catch(function(error){
                    $scope.error = "Ooops!  Something went wrong"
                })

            return $scope.movementStatus
        }
    }])

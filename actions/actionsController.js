'use strict';

var actionsController = angular.module('actionsController', []);

actionsController.controller('actionsController', ['$scope','$state', 'Action', '$stateParams','$q',
    function($scope, $state, Action, $stateParams, $q){
        $scope.actionTemplates = [
            {name: 'mail', url:'actions/mail.html'},
            {name: 'email', url:'actions/email.html'},
            {name: 'call', url:'actions/call.html'},
            {name: 'share', url:'actions/share.html'}
        ];

        function getAction(query){
            var actionPromise = $q.defer();
            var actionResult = Action.get({id: query}, function(){
                actionPromise.resolve(actionResult);
            });
            return actionPromise.promise;
        }

        $q.all([
            getAction($stateParams.actionId)
        ]).then(function(data){
                $scope.action = data[0];
                var actionType = $scope.action.type;

                for(var t= 0, templatesLen=$scope.actionTemplates.length; t<templatesLen; t++){
                    if ($scope.actionTemplates[t].name == actionType)
                        $scope.actionTemplate = $scope.actionTemplates[t];
                }
            }
        )
    }]);

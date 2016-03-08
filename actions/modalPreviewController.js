(function () { "use strict"

    var modalPreviewController = angular.module('modalPreviewController',[])

    modalPreviewController.controller('modalPreviewController', ['$scope', '$uibModalInstance', 'action',
        function($scope, $uibModalInstance, action){
            $scope.error = ''
            $scope.action = action

            $scope.cancel = function(){
                $uibModalInstance.dismiss('cancel')
            }
        }])

}) ()
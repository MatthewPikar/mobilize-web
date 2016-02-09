'use strict'

function moreController($scope){
    $scope.toggleText = '...less'
    $scope.text = ''

    $scope.$watch('content', function(){
        $scope.toggle($scope.content, $scope.length)
    })

    $scope.toggle = function (string, length){
        if (string.length <= length) {
            $scope.toggleText = ''
            return $scope.text = string
        }
        else if($scope.toggleText === '...less' || $scope.toggleText === '') {
            $scope.toggleText = '...more'
            return $scope.text = string.slice(0,length)
        }
        else if($scope.toggleText === '...more' || $scope.toggleText === ''){
            $scope.toggleText = '...less'
            return $scope.text = string
        }
    }
}

var moreDirective = angular.module('more', [])

moreDirective.directive('more',
    function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {length:'@', content:'@'},
            template: '<ng-transclude></ng-tranclude>',
            controller: ["$scope",moreController]
        }
})
(function () { "use strict"

    function focusController(scope, $timeout, element){
        if (typeof(focusIf) !== 'undefined') {
            scope.$watch('focusIf', function(value){
                if(value === true) {
                    element[0].focus()
                    scope.focusIf = false
                }
            })
        }
        else {
            $timeout(function () {
                element[0].focus()
            })
        }
    }

    var focusDirective = angular.module('focus', [])

    focusDirective.directive('focus', ['$timeout',
        function($timeout) {
            function link(scope, element, attrs) {
                if (typeof(attrs.focusIf) !== 'undefined') {
                    scope.$watch('focusIf', function(value){
                        if(value == true) {
                            $timeout(function () {
                                element.focus()
                                element.select()
                            })
                        }
                    })
                }
                else {
                    element.focus()
                    element.select()
                }
            }

            return {
                restrict: 'A',
                scope: {'focusIf':'='},
                link: link
            }
        }
    ])

}) ()
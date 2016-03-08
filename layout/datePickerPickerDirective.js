(function () { "use strict"

angular.module('datePickerPicker', []).directive('datePickerPicker', ['$compile',
    function($compile) {
        function link($scope, element, attributes) {
            var testElement = angular.element('<input type="date"/>')

            if (testElement.prop('type') !== 'date') {
                var groupElement = angular.element('<div class="input-group"></div>')
                var inputElement = angular.element('<input type="text" ' +
                    'uib-datepicker-popup="M!/d!/yyyy" ng-init="pickerIsOpen = false" is-open="pickerIsOpen" ' +
                    'placeholder="ex.: 03/01/2016 or pick --->" ' +
                    'datepicker-options="{showWeeks:false}" show-button-bar="false" popup-placement="top-right"/>')
                var buttonElement = angular.element('<span class="input-group-addon" ng-click="pickerIsOpen=true">' +
                    '<i class="fa fa-calendar"></i></span>')

                angular.forEach(attributes, function(value, key){
                    if (key.substr(0,1) !== '$') {
                        if (key.substr(0,2) === 'ng') {
                            var newKey = key.replace('ng', 'ng-')
                            inputElement.attr(newKey, value)
                        }
                        else inputElement.attr(key, value)
                    }
                })

                groupElement.append(inputElement)
                groupElement.append(buttonElement)

                $compile(groupElement)($scope)
                element.replaceWith(groupElement)


            }
            else {
                angular.forEach(attributes, function(value, key){
                    if (key.substr(0,1) !== '$') {
                        if (key.substr(0,2) === 'ng') {
                            var newKey = key.replace('ng', 'ng-')
                            testElement.attr(newKey, value)
                        }
                        else testElement.attr(key, value)
                    }
                })

                $compile(testElement)($scope)
                element.replaceWith(testElement)
            }
        }

        return {
            restrict: 'E',
            scope: false,
            link: link
        }
    }
])

}) ()
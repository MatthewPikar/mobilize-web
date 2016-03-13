(function () { "use strict"

    var modalImageController = angular.module('modalImageController',['ui.bootstrap'])

    modalImageController.controller('modalImageController', ['$scope', '$uibModalInstance', '$sce', 'currentImage',
        function($scope, $uibModalInstance, $sce, currentImage){
            $scope.error = ''
            var DEFAULT_IMAGE_COUNT = 6
            $scope.slides = []

            for(var i=1, len=DEFAULT_IMAGE_COUNT; i<=len; i++){
                $scope.slides.push({id:i, image:i+'.jpg'})
            }

            if (currentImage) {
                if (currentImage.length < 8) {
                    setActive(currentImage.slice(0, currentImage.length - 4))
                }
                else {
                    $scope.slides.push({id:0, image:currentImage})
                    setActive(0)
                }
            }
            else {
                setActive(1)
            }

            function setActive(slide){
                var slideIndex = ($scope.slides.length >= DEFAULT_IMAGE_COUNT) ? slide-1 : slide
                $scope.slides[slideIndex].active= 'active'
                for(var i = 0, len=$scope.slides.length; i<len; i++){
                    if(i !== slideIndex) $scope.slides[i].active=''
                }
            }
            $scope.setActive = setActive

            $scope.ok = function(){
                for(var i = 0, len=$scope.slides.length; i<len; i++){
                    if($scope.slides[i].active)
                        $uibModalInstance.close($scope.slides[i].image)
                }
            }

            $scope.cancel = function(){
                $uibModalInstance.dismiss('cancel')
            }
        }])

}) ()
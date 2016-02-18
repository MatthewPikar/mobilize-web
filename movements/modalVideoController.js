(function () { "use strict"

var modalVideoController = angular.module('modalVideoController',[])

modalVideoController.controller('modalVideoController', ['$scope', '$uibModalInstance', '$sce', 'currentVideoUrl',
    function($scope, $uibModalInstance, $sce, currentVideoUrl){
        $scope.error = ''
        $scope.url = ''
        $scope.videoResource = ''
        $scope.videoId = currentVideoUrl ? currentVideoUrl.split('/')[4] : ''

        $scope.$watch('videoId', function(){
            if($scope.videoId.length > 11) {
                var videoUrlParts = $scope.videoId.split('/')

                if(videoUrlParts.length > 2) {
                    if (videoUrlParts[2] === 'www.youtube.com') {
                        if(videoUrlParts.length === 4) {
                            var videUrlSubParts = videoUrlParts[3].split(/[?=;]/)
                            $scope.videoId = videUrlSubParts[2]
                        }
                        else if (videoUrlParts.length === 5 && videoUrlParts[3] === 'embed')
                            $scope.videoId = videoUrlParts[4]
                    }
                    else if(videoUrlParts[2] === 'youtu.be')
                        $scope.videoId = videoUrlParts[3]
                    else
                        $scope.error = 'Only YouTube videos are supported at this time.  Please make sure the url you provided is correct and that it point to a YouTube video address.'
                }
                else
                    $scope.error = 'Only YouTube videos are supported at this time.  Please make sure the url you provided is correct and that it point to a YouTube video address.'
            }
            else if($scope.videoId.length === 11) {
                $scope.url = 'https://www.youtube.com/embed/' + $scope.videoId
                $scope.videoResource = $sce.trustAsResourceUrl($scope.url)
            }
        })

        $scope.ok = function(url){
            $uibModalInstance.close(url)
        }

        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel')
        }
    }])

}) ()
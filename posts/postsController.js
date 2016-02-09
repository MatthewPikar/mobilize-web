'use strict'

var postsController = angular.module('postsController', [])

postsController.controller('postsController', ['$scope', '$stateParams', '$state', 'Post',
    function($scope, $stateParams, $state, Post) {
        // State flow
        function State (zones){
            this._zones = {}
            for(var z= 0, len=zones.length; z<len; z++){ this._zones[zones[z]] = false }
        }
        ( function () {
            this.off = function () {
                for (var zone in this._zones)
                    if (this._zones.hasOwnProperty(zone)) this._zones[zone] = false
            }
            this.toggle = function (zone) {
                this._zones[zone] = !this._zones[zone]
            }
            this.set = function (zone) {
                var currentState = this._zones[zone]
                this.off()
                this._zones[zone] = !currentState
            }
            this.get = function (state){ return this._zones[state] }
        }).call(State.prototype)
        $scope.postState = new State(['edit','new','view'])

        // Initialization
        if ($stateParams.postId) {
            $scope.post = loadPost($stateParams.postId, function(response){
                $scope.date = new Date(response.date)
                $scope.postState.set('view')
            })
        }
        else {
            $scope.post = new Post()
            $scope.date = new Date(Date.now())
            $scope.postState.set('new')
            $scope.postState.toggle('edit')
        }

        // Resource Control
        $scope.loadPost = loadPost
        function loadPost (postId, res) {
            var post = new Post()
            Post.get({id: postId}).$promise
                .then(function (response) {
                    angular.extend(post, response)
                    if (res) res(post)
                }).catch(function(error){ $scope.error = error })
            return post
        }
        $scope.queryPosts = function(query) {
            var posts = [], q = query ? {query: query} : {}
            Post.query(q).$promise
                .then(function (response) {
                    if (Array.isArray(response)) {
                        for (var e = 0, len = response.length; e < len; e++) {
                            posts[e] = response[e]
                            posts[e].date = response[e].date ? new Date(response[e].date) : ''
                        }
                        $scope.posts = posts
                    }
                    else  $scope.posts = []
                }).catch(function(error) {
                    console.log(error)
                    $scope.error = error
                })

            return $scope.posts
        }
        $scope.addPost = function () {
            $scope.post.date = $scope.date.toISOString()
            $scope.post.sourceId = $stateParams.movementId
            $scope.post.$add()
                .then(function(response){
                    angular.extend($scope.post, response)
                    $scope.go('movement.overview',{movementId:$stateParams.movementId})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.modifyPost = function () {
            $scope.post.date = $scope.date.toISOString()
            $scope.post.$modify()
                .then(function(response){
                    angular.extend($scope.post, response)
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }
        $scope.deletePost = function () {
            $scope.post.$remove()
                .then(function(response){
                    return true
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }


        // Navigation
        $scope.go = function(state){
            $state.go(state)
        }
    }])
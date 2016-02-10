'use strict'

var API_PATH = "http://localhost:8080/api/0.1/"


var mobilizeApp = angular
    .module('mobilizeApp', [
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'btford.markdown',
        'menuController',
        'searchController',
        'movementService',
        'movementController',
        'modalVideoController',
        'modalImageController',
        'newMovementController',
        'actionsController',
        'actionsService',
        'eventsService',
        'eventsController',
        'postsService',
        'postsController',
        'more'
])

// to make bluebird play nicely with angular
//trackDigests(mobilizeApp);

mobilizeApp.config(['$stateProvider','$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/root")

      $stateProvider
          .state('root', {
              url: "/",
              templateUrl: "root.html",
              controller:"searchController"
          })
          .state('search', {
              url: "/search/:query",
              templateUrl: "search/search.html",
              controller:"searchController"
          })
          .state('newMovement', {
              url: "/m/new",
              templateUrl: "movements/new.html",
              controller: "newMovementController"
          })
          .state('movement', {
              url: "/m/{movementId}",
              abstract: true,
              templateUrl: "movements/movement.html",
              controller: "movementController"
          })
          .state('movement.overview', {
              url: "",
              templateUrl: "movements/overview.html",
              controller: "movementController"
          })
          .state('movement.members', {
              url: "/u",
              templateUrl: "movements/members.html",
              controller: "movementController"
          })
          .state('movement.actions', {
              url: "/a/{actionId}",
              templateUrl: "movements/actions.html",
              controller: "actionController"
          })
          .state('movement.newPost', {
              url:"/p/new",
              templateUrl: "posts/post.html",
              controller: "postsController"
          })
          .state('movement.post', {
              url:"/p/{postId}",
              templateUrl: "posts/post.html",
              controller: "postsController"
          })
          .state('movement.newEvent', {
              url:"/e/new",
              templateUrl: "events/event.html",
              controller: "eventsController"
          })
          .state('movement.event', {
              url:"/e/{eventId}",
              templateUrl: "events/event.html",
              controller: "eventsController"
          })
}])
/*
mobilizeApp.config(
    ['$animateProvider',
        function ($animateProvider) {
            $animateProvider.classNameFilter(/carousel/);
        }]);

/*
mobilizeApp.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push('resourceInterceptor')
}])


function trackDigests(app) {
    app.run(["$rootScope",function ($rootScope) {
        Promise.setScheduler(function (cb) {
            $rootScope.$evalAsync(cb);
        });
    }]);
}*/
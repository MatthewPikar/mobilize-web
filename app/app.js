'use strict';

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
        'more'
]);

// to make bluebird play nicely with angular
//trackDigests(mobilizeApp);

mobilizeApp.config(['$stateProvider','$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/root");

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
              url: "/members",
              templateUrl: "movements/members.html",
              controller: "movementController"
          })
          .state('movement.actions', {
              url: "/action/{actionId}",
              templateUrl: "movements/actions.html",
              controller: "actionController"
          })
          .state('movement.newEvent', {
              url:"/event/new",
              templateUrl: "events/new.html",
              controller: "eventsController"
          })
          .state('movement.event', {
              url:"/event/{eventId}",
              templateUrl: "events/event.html",
              controller: "eventsController"
          });
}]);
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
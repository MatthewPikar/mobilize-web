'use strict';

var mobilizeApp = angular
    .module('mobilizeApp', [
        //'ngRoute',
        'ui.router',
        'menuController',
        'movementController',
        'searchController',
        'actionController',
        'movementService',
        'actionService'
]);

// to make bluebird play nicely with angular
trackDigests(mobilizeApp);

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
              url: "/movement/new",
              templateUrl: "movement/new.html",
              controller: "movementController"
          })
          .state('movement', {
              url: "/movement/{movementId}",
              templateUrl: "movement/movement.html",
              controller: "movementController"
          })
          .state('movement.overview', {
              url: "/overview",
              templateUrl: "movement/overview.html",
              controller: "movementController"
          })
          .state('movement.members', {
              url: "/members",
              templateUrl: "movement/members.html",
              controller: "movementController"
          })
          .state('movement.actions', {
              url: "/action/{actionId}",
              templateUrl: "movement/actions.html",
              controller: "actionController"
          });
}]);

function trackDigests(app) {
    app.run(["$rootScope",function ($rootScope) {
        Promise.setScheduler(function (cb) {
            $rootScope.$evalAsync(cb);
        });
    }]);
}
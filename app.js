(function () { "use strict"

// ----------------------------- Modules -----------------------------
var mobilizeApp = angular
    .module('mobilizeApp', [
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.scrollpoint',
        'ng-showdown',
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
        'more',
        'filters',
        'localStateFactory',
        'datetimeFactory'
])


// ----------------------------- Globals -----------------------------
mobilizeApp.constant('API_PATH', "http://localhost:8080/api/0.1/")

// to make bluebird play nicely with angular
//trackDigests(mobilizeApp);

// ----------------------------- Routing -----------------------------
mobilizeApp.config(['$stateProvider','$urlMatcherFactoryProvider','$urlRouterProvider',
  function($stateProvider,$urlMatcherFactoryProvider, $urlRouterProvider) {
      $urlMatcherFactoryProvider.strictMode(false)  //  makes trailing slash optional

      $stateProvider
          .state('root', {
              url: "/",
              templateUrl: "root.html",
              controller:"searchController",
              resolve: {
                  movements: ['Movement',function (Movement) {
                      return Movement.query().$promise
                  }]
              }
          })
          .state('search', {
              url: "/search/:query",
              templateUrl: "search/search.html",
              controller:"searchController",
              resolve: {
                  movements: ['Movement','$stateParams',function (Movement,$stateParams) {
                      return Movement.query({query: $stateParams.query}).$promise
                  }]
              }
          })
          .state('newMovement', {
              url: "/m/new/",
              templateUrl: "movements/new.html",
              controller: "newMovementController",
              resolve: {
                  movement: ['Movement',function(Movement) {
                      return new Movement()
                  }]
              }
          })
          .state('movement', {
              url: "/m/{movementId}/",
              abstract: true,
              templateUrl: "movements/movement.html",
              controller: "movementController",
              resolve: {
                  movement: ['Movement','$stateParams',function(Movement,$stateParams) {
                      return Movement.get({id: $stateParams.movementId}).$promise
                          .then(function(result){
                              var movement = new Movement()
                              angular.extend(movement, result)
                              return movement
                          })
                  }],
                  posts: ['Post','$stateParams',function (Post,$stateParams) {
                      return Post.query({query: {sourceId:$stateParams.movementId}}).$promise
                  }],
                  events: ['Event','$stateParams',function (Event,$stateParams) {
                      return Event.query({query: {sourceId:$stateParams.movementId}}).$promise
                  }],
                  actions: ['Action','$stateParams',function (Action,$stateParams) {
                      return Action.query({query: {sourceId:$stateParams.movementId}}).$promise
                  }]
              }
          })
          .state('movement.overview', {
              url: "",
              templateUrl: "movements/overview.html"
          })
          .state('movement.members', {
              url: "/u/",
              templateUrl: "movements/members.html"
          })
          .state('movement.admin', {
              url: "/admin/",
              templateUrl: "movements/admin.html"
          })
          .state('movement.newAction', {
              url: "/a/new/",
              templateUrl: "actions/new.html",
              controller: "actionsController",
              resolve: {
                  action: ['Action','$stateParams',function(Action,$stateParams) {
                      return angular.extend({'sourceId':$stateParams.movementId}, new Action())
                  }]
              }
          })
          .state('movement.action', {
              url: "/a/{actionId}/",
              templateUrl: "movements/action.html",
              controller: "actionsController",
              resolve: {
                  action: ['Action','actions','$filter','$stateParams', function (Action,actions,$filter,$stateParams) {
                      var response = new Action()
                      return angular.extend(response,$filter('filter')(actions, {id:$stateParams.actionId},true)[0])
                  }]
              }
          })
          .state('movement.newPost', {
              url:"/p/new/",
              templateUrl: "posts/post.html",
              controller: "postsController",
              resolve: {
                  post: ['Post','$stateParams',function(Post,$stateParams) {
                      return angular.extend({'sourceId':$stateParams.movementId}, new Post())
                  }]
              }
          })
          .state('movement.post', {
              url:"/p/{postId}/",
              templateUrl: "posts/post.html",
              controller: "postsController",
              resolve: {
                  post: ['Post','posts','$filter','$stateParams', function (Post,posts,$filter,$stateParams) {
                      var response = new Post()
                      return angular.extend(response,$filter('filter')(posts, {id:$stateParams.postId},true)[0])
                  }]
              }
          })
          .state('movement.newEvent', {
              url:"/e/new/",
              templateUrl: "events/event.html",
              controller: "eventsController",
              resolve: {
                  event: ['Event','$stateParams',function(Event,$stateParams) {
                      return angular.extend({'sourceId':$stateParams.movementId}, new Event())
                  }]
              }
          })
          .state('movement.event', {
              url:"/e/{eventId}/",
              templateUrl: "events/event.html",
              controller: "eventsController",
              resolve: {
                  event: ['Event','events','$filter','$stateParams', function (Event,events,$filter,$stateParams) {
                      var response = new Event()
                      return angular.extend(response,$filter('filter')(events, {id:$stateParams.eventId},true)[0])
                  }]
              }
          })
          .state('notFound', {
              url:"/errors/not-found/",
              templateUrl: "/errors/notFound.html"
          })

      $urlRouterProvider.otherwise('/errors/not-found/')

  }])

}) ()

// ----------------------------- Globals -----------------------------
Date.prototype.getMonthName = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names[this.getMonth()]
}
Date.locale = {
    en: {
        month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
}


/*
// to make bluebird play nicely with angular
function trackDigests(app) {
    app.run(["$rootScope",function ($rootScope) {
        Promise.setScheduler(function (cb) {
            $rootScope.$evalAsync(cb);
        });
    }]);
}*/
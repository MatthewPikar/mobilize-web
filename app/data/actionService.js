'use strict';

var actionService = angular.module('actionService', ['ngResource']);

actionService.factory('Action', ['$resource',
    function($resource){

        return $resource('data/actions/:id.json', {}, {
            //query: {method:'GET', params:{}, isArray:true}
        });
    }]);
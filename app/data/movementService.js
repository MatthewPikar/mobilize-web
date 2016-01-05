'use strict';

var movementService = angular.module('movementService', ['ngResource']);

var apiPath = "http://localhost:8080/api/0.1/";

movementService.factory('Movement', ['$resource',
    function($resource){
        return $resource(apiPath + 'movements/:id', {}, {
            add: {
                method:'POST'
            },
            modify:{
                method:'PUT'
            },
            query:{
                method:'GET',
                isArray: false
            }
        });
    }]);
'use strict';

var movementService = angular.module('movementService', ['ngResource']);

movementService.factory('Movement', ['$resource','API_PATH',
    function($resource,API_PATH){
        return $resource(API_PATH + 'movements/:id', {id:'@id'}, {
            add: {
                method:'POST',
                interceptor: { response: function(response){ return response.data.resources[0] } }
            },
            modify:{
                method:'PUT',
                interceptor: { response: function(response){ return response.data.resource } }
            },
            query:{
                method:'GET',
                interceptor: { response: function(response){ return response.data.resources } }
            },
            get: {
                method: 'GET',
                interceptor: { response: function(response){ return response.data.resource } }
            }
        });
    }]);
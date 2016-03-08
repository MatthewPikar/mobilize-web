'use strict';

var actionsService = angular.module('actionsService', ['ngResource']);

actionsService.factory('Action', ['$resource','API_PATH',
    function($resource, API_PATH){
        return $resource(API_PATH + 'actions/:id', { id:'@id' },
            {
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
                    params: { query: '@query' },
                    interceptor: { response: function(response){ return response.data.resources } }
                },
                get: {
                    method: 'GET',
                    interceptor: {
                        response: function(response){
                            var resource = response.data.resource
                            resource.suspenseDate = resource.suspenseDate ? new Date(resource.suspenseDate) : false
                            return resource
                        } }
                }
            });
    }]);
'use strict';

var eventsService = angular.module('eventsService', ['ngResource']);

eventsService.factory('Event', ['$resource',
    function($resource){
        return $resource(API_PATH + 'events/:id', { id:'@id' },
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
                    interceptor: { response: function(response){
                        console.log(response)
                        return response.data.resources } }
                },
                get: {
                    method: 'GET',
                    interceptor: { response: function(response){ return response.data.resource } }
                }
        });
    }]);
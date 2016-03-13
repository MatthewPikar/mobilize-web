(function () { "use strict"

    angular.module('usersService', ['ngResource']).factory('User', ['$resource','API_PATH',
        function ($resource, API_PATH){
            return $resource(API_PATH + 'users/:id', { id:'@id' },
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
                            var resources = response.data.resources
                            if (resources) {
                                for (var r = 0, len = resources.length; r < len; r++) {
                                    resources[r].created = resources[r].created ? new Date(resources[r].created) : false
                                }
                            }
                            return resources
                        } }
                    },
                    get: {
                        method: 'GET',
                        interceptor: { response: function(response){
                            var resource = response.data.resource
                            resource.created = resource.created ? new Date(resource.created) : false
                            return resource
                        } }
                    }
                })
        }])
}) ()
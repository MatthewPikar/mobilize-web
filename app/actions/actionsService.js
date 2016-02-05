'use strict';

var actionsService = angular.module('actionsService', ['ngResource']);

actionsService.factory('Action', ['$resource',
    function($resource){

        return $resource('data/actions/:id.json', {}, {
            //query: {method:'GET', params:{}, isArray:true}
        });
    }]);
'use strict';

angular.module('easelfApp')
    .factory('RoomSearch', function ($resource) {
        return $resource('api/_search/rooms/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

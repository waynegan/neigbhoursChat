'use strict';

angular.module('easelfApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });



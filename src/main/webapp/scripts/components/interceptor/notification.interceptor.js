 'use strict';

angular.module('easelfApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-easelfApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-easelfApp-params')});
                }
                return response;
            },
        };
    });
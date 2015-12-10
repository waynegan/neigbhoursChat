'use strict';

angular.module('easelfApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });

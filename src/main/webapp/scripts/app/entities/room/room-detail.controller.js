'use strict';

angular.module('easelfApp')
    .controller('RoomDetailController', function ($scope, $rootScope, $stateParams, entity, Room) {
        $scope.room = entity;
        $scope.load = function (id) {
            Room.get({id: id}, function(result) {
                $scope.room = result;
            });
        };
        $rootScope.$on('easelfApp:roomUpdate', function(event, result) {
            $scope.room = result;
        });
    });

'use strict';

angular.module('easelfApp')
    .controller('RoomController', function ($scope, Room, RoomSearch) {
        $scope.rooms = [];
        $scope.loadAll = function() {
            Room.query(function(result) {
               $scope.rooms = result;
            });
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Room.get({id: id}, function(result) {
                $scope.room = result;
                $('#deleteRoomConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Room.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteRoomConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            RoomSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.rooms = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.room = {roomId: null, roomName: null, isPravate: null, password: null, id: null};
        };
    });

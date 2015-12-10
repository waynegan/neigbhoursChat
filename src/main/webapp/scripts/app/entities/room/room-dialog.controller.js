'use strict';

angular.module('easelfApp').controller('RoomDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Room',
        function($scope, $stateParams, $modalInstance, entity, Room) {

        $scope.room = entity;
        $scope.load = function(id) {
            Room.get({id : id}, function(result) {
                $scope.room = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('easelfApp:roomUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.room.id != null) {
                Room.update($scope.room, onSaveFinished);
            } else {
                Room.save($scope.room, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);

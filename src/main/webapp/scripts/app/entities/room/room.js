'use strict';

angular.module('easelfApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('room', {
                parent: 'entity',
                url: '/rooms',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'easelfApp.room.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/room/rooms.html',
                        controller: 'RoomController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('room');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('room.detail', {
                parent: 'entity',
                url: '/room/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'easelfApp.room.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/room/room-detail.html',
                        controller: 'RoomDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('room');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Room', function($stateParams, Room) {
                        return Room.get({id : $stateParams.id});
                    }]
                }
            })
            .state('room.new', {
                parent: 'room',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/room/room-dialog.html',
                        controller: 'RoomDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {roomId: null, roomName: null, isPravate: null, password: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('room', null, { reload: true });
                    }, function() {
                        $state.go('room');
                    })
                }]
            })
            .state('room.edit', {
                parent: 'room',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/room/room-dialog.html',
                        controller: 'RoomDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Room', function(Room) {
                                return Room.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('room', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });

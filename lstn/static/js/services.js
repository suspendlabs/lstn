(function() {
'use strict';

angular.module('lstn.services', ['ngResource'])

.factory('Room', ['$resource', function($resource) {
  return $resource('/api/room/:id/:action/:target', {
    id: '@id',
    target: '@target'
  },{
    list: {
      method: 'GET'
    },
    roster: {
      method: 'GET',
      params: {
        action: 'roster'
      }
    },
    addQueue: {
      method: 'POST',
      params: {
        action: 'queue'
      }
    },
    removeQueue: {
      method: 'DELETE',
      params: {
        action: 'queue'
      }
    }
  });
}])

.factory('User', ['$resource', function($resource) {
  return $resource('/api/user/:action', {}, {
    playlists: {
      method: 'GET',
      params: {
        action: 'playlists'
      }
    }
  });
}])

.factory('Playlist', ['$resource', function($resource) {
  return $resource('/api/playlist/:id/:action', {
    id: '@id'
  },{
    tracks: {
      method: 'GET',
      params: {
        action: 'tracks'
      }
    }
  });
}]);

})();

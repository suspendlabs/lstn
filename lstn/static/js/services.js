(function() {
'use strict';

angular.module('lstn.services', ['ngResource'])

.factory('Rdio', [
  function() {
    var rdio = {
      status: {
        mute: false,
        visualize: false
      },
      toggleMute: function() {
        this.mute = !this.mute;
        this.apiswf.rdio_setMute(this.mute);
      },
      toggleVisualize: function() {
        this.visualize = !this.visualize;

        if (this.visualize) {
          this.apiswf.rdio_startFrequencyAnalyzer({
            frequencies: '10-band',
            period: 100
          });
        } else {
          this.apiswf.rdio_stopFrequencyAnalyzer();
        }
      }
    };

    return rdio;
  }
])

.factory('socket', ['socketFactory', function(socketFactory) {
  var socket = socketFactory();
  socket.forward('broadcast');
  socket.forward('error');

  socket.releaseControl = function(id, user) {
    console.log('sending room:controller:release');
    this.emit('room:controller:release');
  };
  
  socket.requestControl = function(id, user) {
    console.log('sending room:controller:request');
    this.emit('room:controller:request');
  };
  
  socket.roomConnect = function(id, user) {
    console.log('sending room:connect');
    this.emit('room:connect', {
      id: id,
      user: user
    });
  };

  socket.registerRoom = function(id, user) {
    if (!this.isConnected) {
      return;
    }

    this.roomConnect(id, user);
  };

  socket.updatePosition = function(position) {
    console.log('sending room:controller:playing:position');
    this.emit('room:controller:playing:position', position);
  };

  socket.sendFinished = function() {
    console.log('sending room:controller:playing:finished');
    this.emit('room:controller:playing:finished');
  };

  return socket;
}])

.factory('Room', ['$resource', function($resource) {
  var Room = $resource('/api/room/:id/:action/:target', {
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
    update: {
      method: 'PUT'
    }
  });

  return Room;
}])

.factory('User', ['$resource', function($resource) {
  return $resource('/api/user/:id/:action/:argument', {
    id: '@id'
  },{
    upvote: {
      method: 'POST',
      params: {
        action: 'vote',
        argument: 'upvote'
      }
    },
    downvote: {
      method: 'POST',
      params: {
        action: 'vote',
        argument: 'downvote'
      }
    }
  });
}])

.factory('CurrentUser', ['$resource', function($resource) {
  return $resource('/api/user/:action/:id', {
    id: '@id'
  },{
    playlists: {
      method: 'GET',
      params: {
        action: 'playlists'
      }
    },
    addToQueue: {
      method: 'POST',
      params: {
        action: 'queue'
      }
    },
    removeFromQueue: {
      method: 'DELETE',
      params: {
        action: 'queue'
      }
    },
    updateQueue: {
      method: 'PUT',
      params: {
        action: 'queue'
      }
    },
    search: {
      method: 'GET',
      params: {
        action: 'search'
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

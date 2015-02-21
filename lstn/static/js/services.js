(function() {
'use strict';

angular.module('lstn.services', ['mm.emoji.util', 'ngResource'])

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

.factory('socket', ['config', 'socketFactory', 'emojiToUnicodeFilter', function(config, socketFactory, emojiToUnicodeFilter) {
  var ioSocket = io.connect(config.WS_URL);
  var socket = socketFactory({
    ioSocket: ioSocket
  });

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

  socket.roomUpdate = function(user) {
    console.log('sending room:update');
    this.emit('room:update', user);
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

  socket.sendSkipped = function() {
    console.log('sending room:controller:playing:skipped');
    this.emit('room:controller:playing:skipped');
  };

  socket.sendUpvote = function() {
    console.log('sending room:controller:upvote');
    this.emit('room:controller:upvote');
  };

  socket.sendDownvote = function() {
    console.log('sending room:controller:downvote');
    this.emit('room:controller:downvote');
  };

  socket.sendMessage = function(message) {
    console.log('sending room:chat:message', message);
    message.text = emojiToUnicodeFilter(message.text);
    message.created = moment().format();
    this.emit('room:chat:message', message);
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
}])

.factory('Artist', ['$resource', function($resource) {
  var Artist = $resource('/api/artist/:id/:action', {
    id: '@id'
  },{
    albums: {
      method: 'GET',
      params: {
        action: 'albums'
      }
    }
  });

  Artist.getAlbums = function(artistId) {
    return Artist.albums({
      id: artistId
    }).$promise;
  };

  return Artist;
}])

.factory('Album', ['$resource', function($resource) {
  var Album = $resource('/api/album/:id/:action', {
    id: '@id'
  },{
    albums: {
      method: 'GET',
      params: {
        actions: 'tracks'
      }
    }
  });

  Album.getTracks = function(artistId) {
    return this.albums({
      id: artistId
    });
  };

  return Album;
}]);

})();

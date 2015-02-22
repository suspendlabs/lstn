(function() {
'use strict';

angular.module('lstn.services', ['mm.emoji.util', 'ngResource'])

.factory('Alert', [
  function() {
    var Alert = {
      messages: {
        success: [],
        info: [],
        warning: [],
        error: []
      }
    };

    Alert.dismiss = function(type) {
      this.messages[type].splice(0, 1);
    };

    Alert.success = function(message) {
      this.add(message, 'success');
    };

    Alert.info = function(message) {
      this.add(message, 'info');
    };

    Alert.warning = function(message) {
      this.add(message, 'warning');
    };

    Alert.error = function(message) {
      this.add(message, 'error');
    };

    Alert.add = function(message, type) {
      type = type || 'info';

      if (!(type in Alert.messages)) {
        console.log(type, message);
        return;
      }

      this.messages[type].push(message);
    };

    return Alert;
  }
])

.factory('Queue', ['CurrentUser', 'Alert',
  function(CurrentUser, Alert) {
    var Queue = {
      bitset: '',
      tracks: []
    };
  
    Queue.addTrack = function(track) {
      track.addingToQueue = true;
  
      CurrentUser.addToQueue({
        id: track.key
      }, function(response) {
        track.addingToQueue = false;
        if (!response || !response.success || !response.queue) {
          console.log('CurrentUser.addToQueue', response);

          Alert.error('Something went wrong while trying to add the track to your queue.');
          return;
        }
  
        this.tracks = response.queue;

        $timeout(function() {
          $('#queue').animate({
            scrollTop: $('#queue')[0].scrollHeight
          }, 500);
        }, 10);
      }, function(response) {
        console.log('CurrentUser.addToQueue', response);

        track.addingToQueue = false;
        Alert.error('Something went wrong while trying to add the track to your queue.');
      });
    };
  
    Queue.removeTrack = function(track, index) {
      track.removingFromQueue = true;
      CurrentUser.removeFromQueue({
        id: track.key,
        index: index
      }, function(response) {
        track.removingFromQueue = false;
        if (!response || !response.success || !response.queue) {
          console.log('CurrentUser.removeFromQueue', response);

          Alert.error('Something went wrong while trying to remove the track from your queue.');
          return;
        }

        this.tracks = response.queue;
      }, function(response) {
        console.log('CurrentUser.removeFromQueue', response);

        track.removingFromQueue = false;
        Alert.error('Something went wrong while trying to remove the track from your queue.');
      });
    };
    
    Queue.moveToTop = function(index) {
      var tracks = Queue.tracks.splice(index, 1);
      if (!tracks || tracks.length === 0) {
        console.log('moveToTopOfQueue', 'no tracks to move');

        Alert.error('Something went wrong while trying to move the track to the top of your queue.');
        return;
      }
  
      this.tracks.unshift(tracks[0]);
  
      CurrentUser.updateQueue({
        queue: this.tracks
      }, function(response) {
        if (!response || !response.success) {
          console.log('moveToTopOfQueue', response);

          Alert.error('Something went wrong while trying to move the track to the top of your queue.');
          return;
        }
      }, function(response) {
        console.log('moveToTopOfQueue', response);

        Alert.error('Something went wrong while trying to move the track to the top of your queue.');
      });
    };

    return Queue;
  }
])

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

.factory('CurrentRoom', ['$resource', function($resource) {
  var Room = {
    id: 0,
    name: '',
    slug: ''
  };

  Room.update = function(room) {
    $.extend(this, this, room);
  };

  return Room;
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
  var CurrentUser = $resource('/api/user/:action/:id', {
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

  CurrentUser.getPlaylists = function(type) {
    return CurrentUser.playlists({
      id: type
    }).$promise;
  };

  return CurrentUser;
}])

.factory('Playlist', ['$resource', function($resource) {
  var Playlist = $resource('/api/playlist/:id/:action', {
    id: '@id'
  },{
    tracks: {
      method: 'GET',
      params: {
        action: 'tracks'
      }
    }
  });

  Playlist.getTracks = function(playlist) {
    return this.tracks({
      id: playlist
    }).$promise;
  };

  return Playlist;
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
    tracks: {
      method: 'GET',
      params: {
        action: 'tracks'
      }
    }
  });

  Album.getTracks = function(artistId) {
    return this.tracks({
      id: artistId
    }).$promise;
  };

  return Album;
}]);

})();

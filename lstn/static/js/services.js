(function() {
'use strict';

angular.module('lstn.services', ['mm.emoji.util', 'ngResource'])

.factory('Alert', [
  function() {
    var Alert = {};

    Alert.success = function(message, id) {
      this.add(message, 'success');
    };

    Alert.info = function(message, id) {
      this.add(message, 'info');
    };

    Alert.warning = function(message, id) {
      this.add(message, 'warning');
    };

    Alert.error = function(message, id) {
      this.add(message, 'error', id);
    };

    Alert.add = function(message, type, id) {
      type = type || 'info';

      var options = {
        content: message,
        style: 'snackbar--' + type,
        timeout: 0
      };

      if (id) [
        options.id = id;
      }

      $.snackbar(options);
    };

    Alert.remove = function(id) {
      $('#' + id).snackbar('hide');
    };

    Alert.clear = function() {
      $('.snackbar').each(function() {
        $(this).snackbar('hide');
      });
    };

    return Alert;
  }
])

.factory('Favorite', ['CurrentUser', 'Alert',
  function(CurrentUser, Alert) {
    var Favorite = {
      bitset: []
    };

    Favorite.addTrack = function(track) {
      track.addingToFavorites = true;

      CurrentUser.addToFavorites({
        id: track.key
      }, function(response) {
        track.addingToFavorites = false;
        if (!response || !response.success) {
          console.log('CurrentUser.addToFavorites', response);

          Alert.error('Something went wrong while trying to add the track to your favorites.');
          return;
        }

        Favorite.bitset[track.key] = true;
      }, function(response) {
        console.log('CurrentUser.addToFavorites', response);

        track.addingToFavorites = false;
        Alert.error('Something went wrong while trying to add the track to your favorites.');
      });
    };

    Favorite.removeTrack = function(track) {
      track.removingFromFavorites = true;
      CurrentUser.removeFromFavorites({
        id: track.key
      }, function(response) {
        track.removingFromFavorites = false;
        if (!response || !response.success) {
          console.log('CurrentUser.removeFromFavorites', response);

          Alert.error('Something went wrong while trying to remove the track from your favorites.');
          return;
        }

        delete Favorite.bitset[track.key];
      }, function(response) {
        console.log('CurrentUser.removeFromFavorites', response);

        track.removingFromFavorites = false;
        Alert.error('Something went wrong while trying to remove the track from your favorites.');
      });
    };

    return Favorite;
  }
])

.factory('Queue', ['CurrentUser', 'Alert',
  function(CurrentUser, Alert) {
    var Queue = {
      bitset: '',
      tracks: [],
      shuffle: false,
      loading: true
    };

    Queue.addTrack = function(track, position) {
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

        Queue.tracks = response.queue;

        if (position === 'top') {
          Queue.moveToTop(Queue.tracks.length - 1);
        }
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

        Queue.tracks = response.queue;
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

      Queue.tracks.unshift(tracks[0]);

      CurrentUser.updateQueue({
        queue: Queue.tracks
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

    Queue.moveToBottom = function(index) {
      var tracks = Queue.tracks.splice(index, 1);
      if (!tracks || tracks.length === 0) {
        console.log('moveToBottomOfQueue', 'no tracks to move');

        Alert.error('Something went wrong while trying to move the track to the bottom of your queue.');
        return;
      }

      Queue.tracks.push(tracks[0]);

      CurrentUser.updateQueue({
        queue: Queue.tracks
      }, function(response) {
        if (!response || !response.success) {
          console.log('moveToBottomOfQueue', response);

          Alert.error('Something went wrong while trying to move the track to the bottom of your queue.');
          return;
        }
      }, function(response) {
        console.log('moveToBottomOfQueue', response);

        Alert.error('Something went wrong while trying to move the track to the bottom of your queue.');
      });
    };

    Queue.toggleShuffle = function() {
      Queue.shuffle = !Queue.shuffle;
    };

    Queue.clearTracks = function() {
      if (!confirm('Are you sure you want to clear your queue?')) {
        return;
      }

      Queue.tracks = [];

      CurrentUser.clearQueue({
        queue: Queue.tracks
      }, function(response) {
        if (!response || !response.success) {
          console.log('clearTracks', response);

          Alert.error('Something went wrong while trying to clear your queue.');
          return;
        }
      }, function(response) {
        console.log('clearTracks', response);

        Alert.error('Something went wrong while trying to clear your queue.');
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

  socket.sendSkipped = function(reason) {
    var type = 'room:controller:playing:skipped';
    if (reason) {
      type += ':' + reason;
    }

    console.log('sending ' + type);
    this.emit(type);
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
    name: null,
    slug: null
  };

  Room.update = function(room) {
    $.extend(this, this, room);
  };

  Room.clear = function() {
    this.id = 0;
    this.name = null;
    this.slug = null;
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
    stations: {
      method: 'GET',
      params: {
        action: 'stations'
      }
    },
    favorites: {
      method: 'GET',
      params: {
        action: 'favorites'
      }
    },
    addToFavorites: {
      method: 'POST',
      params: {
        action: 'favorites'
      }
    },
    removeFromFavorites: {
      method: 'DELETE',
      params: {
        action: 'favorites'
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
    clearQueue: {
      method: 'DELETE',
      params: {
        action: 'queue'
      }
    },
    search: {
      method: 'GET',
      params: {
        action: 'search'
      }
    },
    settings: {
      method: 'POST',
      params: {
        action: 'settings'
      }
    }
  });

  CurrentUser.getPlaylists = function(type) {
    return CurrentUser.playlists({
      id: type
    }).$promise;
  };

  CurrentUser.getStations = function(type) {
    return CurrentUser.stations({
      id: type
    }).$promise;
  };

  CurrentUser.getFavorites = function(type) {
    return CurrentUser.favorites({
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
}])

.factory('Station', ['$resource', function($resource) {
  var Station = $resource('/api/station/:id/:action', {
    id: '@id'
  },{
    tracks: {
      method: 'GET',
      params: {
        action: 'tracks'
      }
    }
  });

  Station.getTracks = function(station) {
    return this.tracks({
      id: station
    }).$promise;
  };

  return Station;
}])

.constant('MoreMusic', {
  categories: [
    {
      name: 'Playlists',
      type: 'playlists',
    },{
      name: 'Stations',
      type: 'stations'
    },{
      name: 'Collections',
      type: 'collections'
    }
  ],
  playlistTypes: [
    {
      name: 'Your Playlists',
      key: 'owned'
    },{
      name: 'Collaborative Playlists',
      key: 'collab'
    },{
      name: 'Subscribed Playlists',
      key: 'subscribed'
    },{
      name: 'Favorited Playlists',
      key: 'favorites'
    }
  ],
  stationTypes: [
    {
      name: 'Your Stations',
      key: 'you'
    },{
      name: 'Friends',
      key: 'friends'
    },{
      name: 'Recent Stations',
      key: 'recent'
    },{
      name: 'Genre',
      key: 'genre'
    }
  ],
  genres: [
    {
      name: 'Reggae',
      key: 'Reggae'
    },{
      name: 'Rock',
      key: 'Rock'
    },{
      name: 'Latin',
      key: 'Latin'
    },{
      name: 'Christian Gospel',
      key: 'Christian_Gospel'
    },{
      name: 'World',
      key: 'World'
    },{
      name: 'Classical',
      key: 'Classical'
    },{
      name: 'Dance',
      key: 'Dance'
    },{
      name: 'Country',
      key: 'Country'
    },{
      name: 'Songwriters/Folk',
      key: 'Songwriters_Folk'
    },{
      name: 'Jazz',
      key: 'Jazz'
    },{
      name: 'Pop',
      key: 'Pop'
    },{
      name: 'Indie',
      key: 'Indie'
    },{
      name: 'R&B',
      key: 'R_and_B'
    },{
      name: 'Hip Hop',
      key: 'Hip_Hop'
    },{
      name: 'Alternative',
      key: 'Alternative'
    },{
      name: 'Holiday',
      key: 'Holiday'
    },{
      name: 'Electronic',
      key: 'Electronic'
    },{
      name: 'Blues',
      key: 'Blues'
    },{
      name: 'More',
      key: 'More'
    }
  ]
});

})();

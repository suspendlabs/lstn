(function() {
'use strict';

angular.module('lstn.services', ['mm.emoji.util', 'ngResource'])

.factory('Promise', [function() {
  var Promise = {};
  Promise.cancel = function(promise) {
    if (promise &&
      promise._httpTimeout &&
      promise._httpTimeout.resolve) {

      promise._httpTimeout.resolve();
    }
  };

  return Promise;
}])

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

      if (id) {
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
      track.loading = true;

      return CurrentUser.addToFavorites({
        id: track.key
      }, function(response) {
        track.loading = false;
        if (!response || !response.success) {
          Alert.error('Something went wrong while trying to add the track to your favorites.');
          return;
        }

        Favorite.bitset[track.key] = true;
      }, function(response) {
        track.loading = false;
        Alert.error('Something went wrong while trying to add the track to your favorites.');
      }).$promise;
    };

    Favorite.removeTrack = function(track) {
      track.loading = true;

      return CurrentUser.removeFromFavorites({
        id: track.key
      }, function(response) {
        track.loading = false;
        if (!response || !response.success) {
          Alert.error('Something went wrong while trying to remove the track from your favorites.');
          return;
        }

        delete Favorite.bitset[track.key];
      }, function(response) {
        track.loading = false;
        Alert.error('Something went wrong while trying to remove the track from your favorites.');
      }).$promise;
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

    Queue.addTracks = function(tracks, position) {
      return CurrentUser.addToQueue({
        tracks: tracks
      }, function(response) {
        if (!response || !response.success || !response.queue) {
          Alert.error('Something went wrong while trying to add the tracks to your queue.');
          return;
        }

        Queue.tracks = response.queue;

        if (position === 'top') {
          Queue.moveToTop(Queue.tracks.length - tracks.length, tracks.length);
        }
      }, function(response) {
        Alert.error('Something went wrong while trying to add the track to your queue.');
      }).$promise;
    };

    Queue.addTrack = function(track, position) {
      track.loading = true;

      return CurrentUser.addToQueue({
        id: track.key
      }, function(response) {
        track.loading = false;
        if (!response || !response.success || !response.queue) {
          Alert.error('Something went wrong while trying to add the track to your queue.');
          return;
        }

        Queue.tracks = response.queue;

        if (position === 'top') {
          Queue.moveToTop(Queue.tracks.length - 1);
        }
      }, function(response) {
        track.loading = false;
        Alert.error('Something went wrong while trying to add the track to your queue.');
      }).$promise;
    };

    Queue.removeTrack = function(track, index) {
      track.loading = true;

      return CurrentUser.removeFromQueue({
        id: track.key,
        index: index
      }, function(response) {
        track.loading = false;
        if (!response || !response.success || !response.queue) {
          Alert.error('Something went wrong while trying to remove the track from your queue.');
          return;
        }

        Queue.tracks = response.queue;
      }, function(response) {
        track.loading = false;
        Alert.error('Something went wrong while trying to remove the track from your queue.');
      }).$promise;
    };

    Queue.moveToTop = function(index, length) {
      length = length || 1;

      var tracks = Queue.tracks.splice(index, length);
      if (!tracks || tracks.length === 0) {
        Alert.error('Something went wrong while trying to move the track to the top of your queue.');
        return;
      }

      // Add the splice arguments to the front of the track list
      tracks.splice(0, 0, 0, 0);

      // Add the tracks to the top of the queue
      Array.prototype.splice.apply(Queue.tracks, tracks);

      return CurrentUser.updateQueue({
        queue: Queue.tracks
      }, function(response) {
        if (!response || !response.success) {
          Alert.error('Something went wrong while trying to move the track to the top of your queue.');
          return;
        }
      }, function(response) {
        Alert.error('Something went wrong while trying to move the track to the top of your queue.');
      }).$promise;
    };

    Queue.moveToBottom = function(index) {
      var tracks = Queue.tracks.splice(index, 1);
      if (!tracks || tracks.length === 0) {
        Alert.error('Something went wrong while trying to move the track to the bottom of your queue.');
        return;
      }

      Queue.tracks.push(tracks[0]);

      return CurrentUser.updateQueue({
        queue: Queue.tracks
      }, function(response) {
        if (!response || !response.success) {
          Alert.error('Something went wrong while trying to move the track to the bottom of your queue.');
          return;
        }
      }, function(response) {
        Alert.error('Something went wrong while trying to move the track to the bottom of your queue.');
      }).$promise;
    };

    Queue.toggleShuffle = function() {
      Queue.shuffle = !Queue.shuffle;
    };

    Queue.clearTracks = function() {
      if (!confirm('Are you sure you want to clear your queue?')) {
        return;
      }

      Queue.tracks = [];

      return CurrentUser.clearQueue({
        queue: Queue.tracks
      }, function(response) {
        if (!response || !response.success) {
          Alert.error('Something went wrong while trying to clear your queue.');
          return;
        }
      }, function(response) {
        Alert.error('Something went wrong while trying to clear your queue.');
      }).$promise;
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
    this.emit('room:controller:release');
  };

  socket.requestControl = function(id, user) {
    this.emit('room:controller:request');
  };

  socket.roomConnect = function(id, user) {
    this.emit('room:connect', {
      id: id,
      user: user
    });
  };

  socket.roomUpdate = function(user) {
    this.emit('room:update', user);
  };

  socket.registerRoom = function(id, user) {
    if (!this.isConnected) {
      return;
    }

    this.roomConnect(id, user);
  };

  socket.updatePosition = function(position) {
    this.emit('room:controller:playing:position', position);
  };

  socket.sendFinished = function() {
    this.emit('room:controller:playing:finished');
  };

  socket.sendSkipped = function(reason) {
    var type = 'room:controller:playing:skipped';
    if (reason) {
      type += ':' + reason;
    }

    this.emit(type);
  };

  socket.sendUpvote = function() {
    this.emit('room:controller:upvote');
  };

  socket.sendDownvote = function() {
    this.emit('room:controller:downvote');
  };

  socket.sendMessage = function(message) {
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
    slug: null,
    regions: []
  };

  var regionListeners = {};
  
  Room.update = function(room) {
    $.extend(this, this, room);
  };

  Room.clear = function() {
    this.id = 0;
    this.name = null;
    this.slug = null;
    this.regions = [];
  };

  Room.setRegions = function(regions) {
    regions = regions || [];
    if (regions.indexOf('US') === -1) {
      regions.push('US');
    }

    if (regions.indexOf('CA') === -1) {
      regions.push('CA');
    }

    this.regions = regions;

    Object.keys(regionListeners).forEach(function(id) {
      regionListeners[id]();
    });
  };

  Room.addRegionListener = function(id, callback) {
    regionListeners[id] = callback;
  };

  Room.removeRegionListener = function(id) {
    if (!(id in regionListeners)) {
      return;
    }

    delete regionListeners[id];
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

.factory('Playlist', ['$resource',
  function($resource) {
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
  }
])

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

.constant('RdioType', {
  r: 'artist',
  a: 'album',
  t: 'track',
  p: 'playlist',
  tp: 'station',
  h: 'station',
  gr: 'station',
  rr: 'station'
})

.constant('Category', {
  playlists: 'Playlists',
  stations: 'Stations'
})

.constant('PlaylistType', {
  owned: 'Your Playlists',
  collab: 'Collaborative Playlists',
  subscribed: 'Subscribed Playlists',
  favorites: 'Favorited Playlists'
})

.constant('StationType', {
  you: 'Your Stations',
  friends: 'Friends',
  recent: 'Recent Stations'
})

.factory('Loader', ['$q', 'Alert', 'CurrentUser', 'RdioType', 'Category', 'PlaylistType', 'Playlist', 'StationType', 'Station', 'Artist', 'Album',
  function($q, Alert, CurrentUser, RdioType, Category, PlaylistType, Playlist, StationType, Station, Artist, Album) {
    var Loader = {
      toResponse: function(object, type) {
        var data = [];

        angular.forEach(object, function(value, key) {
          this.push({
            key: key,
            name: value,
            type: type
          });
        }, data);

        return {
          success: true,
          data: data
        };
      },
      search: function(query) {
        if (!query || query.length < 3) {
          var deferred = $q.defer();
          deferred.resolve(Loader.toResponse([], 'searchResult'));
          return deferred.promise;
        }

        return CurrentUser.search({
          query: query
        }).$promise;
      },
      music: function(key) {
        var deferred = $q.defer();
        deferred.resolve(Loader.toResponse(Category, 'category'));
        return deferred.promise;
      },
      category: function(key) {
        var deferred = $q.defer();

        if (key === 'playlists') {
          deferred.resolve(Loader.toResponse(PlaylistType, 'playlistType'));
        } else if (key === 'stations') {
          deferred.resolve(Loader.toResponse(StationType, 'stationType'));
        } else {
          deferred.reject('Category not found');
        }

        return deferred.promise;
      },
      playlistType: function(key) {
        return CurrentUser.getPlaylists(key);
      },
      playlist: function(key) {
        return Playlist.getTracks(key);
      },
      stationType: function(key) {
        return CurrentUser.getStations(key);
      },
      station: function(key) {
        return Station.getTracks(key);
      },
      artist: function(key) {
        return Artist.getAlbums(key);
      },
      album: function(key) {
        return Album.getTracks(key);
      }
    };

    Loader.load = function(item) {
      if (!item) {
        return null;
      }

      if (!item.type || !item.key) {
        Alert.error('Something went wrong while trying to load ' + item.name);
        return null;
      }

      var type = item.type;
      if (item.type in RdioType) {
        type = RdioType[item.type];
      }

      if (!(type in Loader)) {
        Alert.error('Something went wrong while trying to load ' + item.name);
        return null;
      }

      return Loader[type](item.key);
    };

    return Loader;
  }
])

.constant('Genre', {
  Reggae: 'Reggae',
  Rock: 'Rock',
  Latin: 'Latin',
  Christian_Gospel: 'Christian Gospel',
  World: 'World',
  Classical: 'Classical',
  Dance: 'Dance',
  Country: 'Country',
  Songwriters_Folk: 'Songwriters/Folk',
  Jazz: 'Jazz',
  Pop: 'Pop',
  Indie: 'Indie',
  R_and_B: 'R&B',
  Hip_Hop: 'Hip Hop',
  Alternative: 'Alternative',
  Holiday: 'Holiday',
  Electronic: 'Electronic',
  Blues: 'Blues',
  More: 'More'
});

})();

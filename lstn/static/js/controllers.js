(function() {
'use strict';

angular.module('lstn.controllers', [])

.controller('AppController', ['$scope', function($scope) {
  $scope.$on('socket:error', function(ev, data) {
    console.log('socket:error', ev, data);
  });
}])

.controller('RoomsController', ['$scope', '$location', 'Room', function($scope, $location, Room) {
  $scope.loading = true;
  $scope.showCreateRoom = false;

  Room.list({}, function(response) {
    $scope.loading = false;
    if (!response || !response.success || !response.rooms) {
      // TODO: Error
      return;
    }

    $scope.rooms = response.rooms;
  }, function(response) {
    // TODO: Error
    $scope.loading = false;
  });

  $scope.newRoom = {
    name: null
  };

  $scope.createRoom = function() {
    $scope.showCreateRoom = true;
  };

  $scope.saveCreateRoom = function() {
    Room.save({}, $scope.newRoom, function(response) {
      if (!response || !response.success || !response.slug) {
        // TODO: Error
        return false;
      }

      $location.path('/room/' + response.slug);
    }, function(response) {
      // TODO: Error
    });
  };

  $scope.cancelCreateRoom = function() {
    $scope.showCreateRoom = false;
    $scope.newRoom.name = null;
  };

  $scope.editRoom = function(index) {
    $scope.rooms[index].editing = true;
  };

  $scope.saveEditRoom = function(index) {
    console.log(index, $scope.rooms[index]);

    Room.update({
      id: $scope.rooms[index].id
    }, $scope.rooms[index], function(response) {
      if (!response || !response.success || !response.room) {
        // TODO: Error
        return false;
      }

      $scope.rooms[index] = response.room;
    }, function(response) {
      // TODO: Error
    });
  };

  $scope.cancelEditRoom = function(index) {
    $scope.rooms[index].editing = false;
  };

  $scope.deleteRoom = function(index) {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    Room.delete({
      id: $scope.rooms[index].id
    }, function(response) {
      if (!response || !response.success) {
        // TODO: Error
        return;
      }

      $scope.rooms.splice(index, 1);
    }, function(response) {
      // TODO: Error
    });
  };
}])

.controller('RoomController', ['$scope', '$routeParams', '$timeout', 'socket', 'Rdio', 'Room', 'CurrentUser', 'User', 'Playlist',
  function($scope, $routeParams, $timeout, socket, Rdio, Room, CurrentUser, User, Playlist) {
    $scope.playingTrack = null;
    $scope.isController = false;
    $scope.isCurrentController = false;
    $scope.currentController = null;

    $scope.rdioReady = false;
    $scope.rdioPlay = null;

    $scope.mute = false;
    $scope.visualize = false;
    $scope.voting = false;

    $scope.playingSomewhereElse = false;
    $scope.hasRemaining = false;
    $scope.remaining = 0;
    $scope.hideRemaining = false;

    // Setup sockets
    socket.on('connect', function() {
      console.log('connect');
      socket.isConnected = true;

      if ($scope.room && $scope.room.id) {
        socket.registerRoom($scope.room.id, $scope.current_user);
      }
    });

    socket.on('room:connect:error', function(data) {
      console.log('room:connect:error', data);
      console.error('Unable to connect to room', data);
    });

    socket.on('room:roster:update', function(data) {
      console.log('room:roster:update', data);
      $scope.roster = data;
      $scope.roster.controllersCount = $scope.roster.controllerOrder.length;
      $scope.roster.usersCount = Object.keys($scope.roster.users).length;
    });

    socket.on('room:controller:playing:request', function(data) {
      console.log('room:controller:playing:request', data);

      $scope.isCurrentController = true;
      if ($scope.queue && $scope.queue.length > 0) {
        var song = $scope.queue[0];

        console.log('room:controller:playing', song);
        socket.emit('room:controller:playing', song);

        $scope.removeSongFromQueue(song.key, 0);
      } else {
        $scope.isController = false;
        console.log('room:controller:empty');
        socket.emit('room:controller:empty', {});
      }
    });

    socket.on('room:playing', function(data) {
      console.log('room:playing', data);

      if (!$scope.rdioReady) {
        $scope.rdioPlay = data;
        return;
      }

      $scope.playSong(data);
    });

    // TODO: Move these to Room service (badjokeeel) if possible
    $scope.playSong = function(data) {
      if (!$scope.rdioReady) {
        $scope.rdioPlay = data;
        return;
      }

      if (!data || !data.key) {
        $scope.isCurrentController = false;
        $scope.playing = null;
        apiswf.rdio_stop();

        return;
      }

      // Play the track through Rdio
      apiswf.rdio_play(data.key, {
        initialPosition: data.position || 0
      });

      // Update the current controller
      $scope.currentController = data.controller || null;

      // If we're not the controller, return
      if (!$scope.isCurrentController) {
        return;
      }

      // Cancel the update timeout
      if ($scope.updateTimeout) {
        $timeout.cancel($scope.updateTimeout);
      }

      // Create a new update timeout
      $scope.updateTimeout = $timeout($scope.updatePosition, 1 * 2000, false);
    };

    $scope.songFinished = function() {
      $scope.isCurrentController = false;
      socket.sendFinished();
    };

    $scope.updatePosition = function() {
      if (!$scope.playing) {
        return;
      }

      if (window.playingPosition >= $scope.playing.song.duration) {
        return;
      }

      socket.updatePosition(window.playingPosition);

      $scope.updateTimeout = $timeout($scope.updatePosition, 1 * 1000, false);
    };
  
    $scope.toggleBroadcast = function() {
      $scope.isController = !$scope.isController;

      if ($scope.isController) {
        socket.requestControl($scope.room.id, $scope.current_user.id);
      } else {
        socket.releaseControl($scope.room.id, $scope.current_user.id);
      }
    };
  
    $scope.toggleMute = function() {
      $scope.mute = !$scope.mute;
      apiswf.rdio_setMute($scope.mute);
    };
  
    $scope.toggleVisualize = function() {
      $scope.visualize = !$scope.visualize;
  
      if ($scope.visualize) {
        apiswf.rdio_startFrequencyAnalyzer({
          frequencies: '10-band',
          period: 100
        });
      } else {
        apiswf.rdio_stopFrequencyAnalyzer();
      }
    };
  
    $scope.upvote = function() {
      if (!$scope.playing ||
        $scope.playing.voted ||
        $scope.voting ||
        !$scope.currentController ||
        $scope.isCurrentController) {

        return;
      }

      var remaining = Math.floor($scope.playing.song.duration - window.playingPosition);
      if (remaining <= 0) {
        return;
      }

      $scope.voting = true;

      User.upvote({
        id: $scope.currentController,
        room: $scope.room.id,
        song: $scope.playing.song.key,
        remaining: remaining
      }, function(response) {
        $scope.voting = false;
        if (!response || !response.success) {
          // TODO: Error
          return false;
        }

        if (!$scope.playing) {
          return;
        }

        $scope.playing.voted = true;
        $scope.playing.upvoted = true;
      }, function(response) {
        // TODO: Error
        $scope.voting = false;
      });
    };

    $scope.downvote = function() {
      if (!$scope.playing ||
        $scope.playing.voted ||
        $scope.voting ||
        !$scope.currentController ||
        $scope.isCurentController) {

        return;
      }

      var remaining = Math.floor($scope.playing.song.duration - window.playingPosition);
      if (remaining <= 0) {
        return;
      }

      $scope.voting = true;

      User.downvote({
        id: $scope.currentController,
        room: $scope.room.id,
        song: $scope.playing.song.key,
        remaining: remaining
      }, function(response) {
        $scope.voting = false;
        if (!response || !response.success) {
          // TODO: Error
          return false;
        }

        if (!$scope.playing) {
          return;
        }

        $scope.playing.voted = true;
        $scope.playing.downvoted = true;
      }, function(response) {
        // TODO: Error
        $scope.voting = false;
      });
    };
  
    $scope.skipSong = function() {
      if (!$scope.isCurrentController) {
        return;
      }

      $scope.songFinished();
    };

    $scope.rdioToLstn = function(rdioSong) {
      var lstnSong = {
        key: rdioSong.key,
        link: rdioSong.shortUrl,
        image: rdioSong.icon,
        title: rdioSong.name,
        artist: rdioSong.artist,
        album: rdioSong.album,
        position: 0,
        duration: rdioSong.duration,
        user: 0
      };

      return lstnSong;
    };


    // Watches
    $scope.$watch('rdioReady', function(newVal, oldVal) {
      console.log('rdioReady', newVal, oldVal);
      if (newVal === oldVal) {
        return;
      }

      // If Rdio isn't ready yet, return
      if (!newVal) {
        return;
      }

      // If we don't have a song to play, return
      if (!$scope.rdioPlay) {
        return;
      }

      // Play the song
      $scope.playSong($scope.rdioPlay);

      // Clear the rdioPlay variable
      $scope.rdioPlay = null;
    });
  
    $scope.$watch('playingTrack', function(newVal, oldVal) {
      console.log('playingTrack', newVal, oldVal);
      if (newVal === oldVal) {
        return;
      }

      // Signal that the song is finished
      if (!newVal) {
        $scope.playing = null;

        // If we're the current controller, tell the server we finished
        if (oldVal && $scope.isCurrentController) {
          $scope.songFinished(oldVal.key);
        }

        return;
      }

      // Skip auto play songs from Rdio
      if (newVal.type === 'ap') {
        $scope.playing = null;
        return;
      }
  
      $scope.playing = {
        status: 'playing',
        song: $scope.rdioToLstn(newVal),
        voted: 0,
        upvoted: 0,
        downvoted: 0
      };
    }, true);

    // Rdio Callback (TODO: Move to Rdio service?)
    var initPlayback = function() {
      window.playbackHandler = {
        ready: function(user) {
          window.apiswf = $('#apiswf').get(0);
  
          var scope = angular.element(document.body).scope();
          scope.$evalAsync(function() {
            $scope.rdioReady = true;
            $scope.rdioUser = user;
          });
        },
        freeRemainingChanged: function(remaining) {
          var scope = angular.element(document.body).scope();
          scope.$evalAsync(function() {
            $scope.hasRemaining = true;
            $scope.remaining = remaining;
          });
        },
        playStateChanged: function(playState) {
          console.log('play state changed', playState);

          var scope = angular.element(document.body).scope();
          scope.$evalAsync(function() {
            $scope.playState = playState;
          });
        },
        playingTrackChanged: function(playingTrack, sourcePosition) {
          console.log('playing track changed', playingTrack);

          var scope = angular.element(document.body).scope();
          scope.$evalAsync(function() {
            $scope.playingTrack = playingTrack;
            $scope.sourcePosition = sourcePosition;
          });
        },
        playingSourceChanged: function(playingSource) {
          console.log('playing source changed', playingSource);

          var scope = angular.element(document.body).scope();
          scope.$evalAsync(function() {
            $scope.playingSource = $scope.playingSource;
          });
        },
        volumeChanged: function(volume) {},
        muteChanged: function(mute) {},
        positionChanged: function(position) {
          window.playingPosition = position;
  
          var progressBar = $('#progress');
  
          var maxValue = parseInt(progressBar.attr('aria-valuemax'), 10);
          var currentValue = parseInt(position, 10);
          var percentage = Math.ceil((currentValue / maxValue) * 100);
  
          var currentSeconds = currentValue % 60;
          var currentMinutes = (currentValue - currentSeconds) / 60;
  
          var maxSeconds = maxValue % 60;
          var maxMinutes = (maxValue - maxSeconds) / 60;
  
          var time = currentMinutes + ':';
          time += (currentSeconds < 10) ? '0' + currentSeconds : currentSeconds;
          time += ' / ' + maxMinutes + ':';
          time += (maxSeconds < 10) ? '0' + maxSeconds : maxSeconds;
  
          $('#time').html(time);
  
          progressBar.attr('aria-valuenow', currentValue);
          progressBar.css('width', percentage + '%');
        },
        queueChanged: function(newQueue) {
          console.log('new queue', newQueue);
        },
        shuffleChanged: function(shuffle) {},
        repeatChanged: function(repeatMode) {},
        playingSomewhereElse: function() {
          var scope = angular.element(document.body).scope();
          scope.$evalAsync(function() {
            $scope.playingSomewhereElse = true;
          });
        },
        updateFrequencyData: function(data) {
          var frequencies = data.split(',');
  
          $('.playing__visualization div').each(function(i) {
            var height = Math.max(0, Math.min(parseInt(parseFloat(frequencies[i]) * 175, 10), 175));
            var marginTop = 175 - height;
  
            $(this).height(height);
            $(this).css('margin-top', marginTop + 'px');
          });
        }
      };
  
      var flashVars = {
        playbackToken: $scope.playback,
        domain: document.domain,
        listener: 'playbackHandler'
      };
  
      var params = {
        allowScriptAccess: 'always'
      };
  
      swfobject.embedSWF('http://www.rdio.com/api/swf/',
        'apiswf', 1, 1, '9.0.0', 'expressInstall.swf',
        flashVars, params, {});
    };
  
    $scope.addSongToQueue = function(song_id) {
      CurrentUser.addToQueue({
        id: song_id
      }, function(response) {
        if (!response || !response.success || !response.queue) {
          return;
        }
  
        $scope.queue = response.queue;
  
        $timeout(function() {
          $('#queue').animate({
            scrollTop: $('#queue')[0].scrollHeight
          }, 500);
        }, 10);
      });
    };
  
    $scope.removeSongFromQueue = function(song_id, index, callback) {
      console.log('removing song from queue', song_id, index);

      CurrentUser.removeFromQueue({
        id: song_id,
        index: index
      }, function(response) {
        console.log('song removed from queue', response);

        if (!response || !response.success || !response.queue) {
          return;
        }
  
        $scope.queue = response.queue;

        if (typeof callback === 'function') {
          callback();
        }
      });
    };
  
    Room.get({
      id: $routeParams.id
    }, function(response) {
      if (!response || !response.success || !response.room) {
        // TODO: Error
        return;
      }
  
      $scope.room = response.room;
      $scope.playback = response.playback;

      $scope.queue = [];
      if (response.queue) {
        $scope.queue = response.queue;
      }
  
      socket.registerRoom($scope.room.id, $scope.current_user);
      initPlayback();
    });
  
    CurrentUser.playlists({}, function(response) {
      if (!response || !response.success || !response.playlists) {
        // TODO: Error
        return;
      }

      $scope.playlists = response.playlists;
    });
  }
])

.controller('UserController', ['$scope', function($scope) {
}]);

})();

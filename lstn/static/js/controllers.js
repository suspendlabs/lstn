(function() {
'use strict';

angular.module('lstn.controllers', [])

.controller('AppController', ['$scope', 'Alert', 'CurrentRoom',
  function($scope, Alert, CurrentRoom) {
    $scope.$on('socket:error', function(ev, data) {
      console.log('socket:error', ev, data);
    });

    $scope.alerts = Alert;
    $scope.currentRoom = CurrentRoom;
  }
])

.controller('RoomsController', ['$scope', '$location', 'Room', function($scope, $location, Room, Alert) {
  $scope.loading = true;
  $scope.showCreateRoom = false;

  Room.list({}, function(response) {
    $scope.loading = false;
    if (!response || !response.success || !response.rooms) {
      console.log('Room.list', response);

      Alert.error('Something went wrong while trying to load the rooms list.');
      return;
    }

    $scope.rooms = response.rooms;
  }, function(response) {
    console.log('Room.list', response);

    $scope.loading = false;
    Alert.error('Something went wrong while trying to load the rooms list.');
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
        console.log('Room.save', response);

        Alert.error('Something went wrong while trying to create the new room.');
        return false;
      }

      $location.path('/room/' + response.slug);
    }, function(response) {
      console.log('Room.save', response);

      Alert.error('Something went wrong while trying to create the new room.');
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
        console.log('Room.update', response);

        Alert.error('Something went wrong while trying to save the room.');
        return false;
      }

      $scope.rooms[index] = response.room;
    }, function(response) {
      console.log('Room.update', response);

      Alert.error('Something went wrong while trying to save the room.');
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
        console.log('Room.delete', response);

        Alert.error('Something went wrong while trying to delete the room.');
        return;
      }

      $scope.rooms.splice(index, 1);
    }, function(response) {
      console.log('Room.delete', response);

      Alert.error('Something went wrong while trying to delete the room.');
    });
  };
}])

.controller('RoomController', ['$scope', '$routeParams', '$timeout', 'socket', 'Rdio', 'CurrentRoom', 'Room', 'CurrentUser', 'User', 'Playlist', 'Queue', 'Alert',
  function($scope, $routeParams, $timeout, socket, Rdio, CurrentRoom, Room, CurrentUser, User, Playlist, Queue, Alert) {
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

    $scope.flashEnabled = false;

    $scope.chat = {
      loading: true,
      messages: []
    };

    $scope.queue = Queue;
    $scope.room = CurrentRoom;

    $scope.$watch('queue.tracks', function() {
      var set = {};
      for (var i = 0; i < $scope.queue.tracks.length; i++) {
        set[$scope.queue.tracks[i].key] = true;
      }

      $scope.queue.bitset = set;
    });

    // Notifications
    $scope.notificationPermission = 'default';
    if (window.Notification) {
      Notification.requestPermission(function(status) {
        console.log(status);
        $scope.notificationPermission = status;

        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
    }

    $scope.sendNotification = function(title, body, icon, timeout, handler) {
      if (!window.Notification || $scope.notificationPermission !== 'granted') {
        return;
      }

      if (!title) {
        return;
      }

      var options = {};
      if (body) {
        options.body = body;
      }

      if (icon) {
        options.icon = icon;
      }

      var notification = new Notification(title + ' on Lstn.fm', options);

      if (timeout) {
        notification.onshow = function() {
          setTimeout(notification.close.bind(notification), timeout);
        };
      }

      if (handler) {
        notification.onclick = handler;
      }
    };

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

      Alert.error('Something went wrong while trying to connect to the room.');
    });

    socket.on('room:chat:history', function(data) {
      console.log('room:chat:history', data);
      $scope.chat.messages = data;
      $scope.chat.loading = false;

      $timeout(function() {
        $('#messages').animate({
          scrollTop: $('#messages')[0].scrollHeight
        }, 200);
      }, 10);
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
      if (!$scope.queue.tracks || $scope.queue.tracks.length === 0) {
        console.log('room:controller:empty');

        $scope.isController = false;
        socket.emit('room:controller:empty');

        Alert.info("You've been made a listener because your queue ran out of music.");
        return;
      }

      var track = $scope.queue.tracks.shift();
      $scope.queue.tracks.push(track);

      console.log('room:controller:playing', track);
      socket.emit('room:controller:playing', track);

      CurrentUser.updateQueue({
        queue: $scope.queue.tracks
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
    });

    socket.on('room:playing', function(data) {
      console.log('room:playing', data);

      if (!$scope.rdioReady) {
        $scope.rdioPlay = data;
        return;
      }

      $scope.playTrack(data);
    });

    socket.on('room:upvote', function(upvote) {
      if ($scope.playing) {
        if (!$scope.playing.upvotes) {
          $scope.playing.upvotes = {};
        }

        $scope.playing.upvotes[upvote.user] = true;
      }

      if (!$scope.isCurrentController) {
        return;
      }

      CurrentUser.get({}, function(response) {
        if (!response || !response.success || !response.user) {
          console.log('CurrentUser.get', response);

          Alert.warning('Something went wrong while trying to get your latest score.');
          return;
        }

        socket.roomUpdate(response.user);
      }, function(response) {
        console.log('CurrentUser.get', response);

        Alert.warning('Something went wrong while trying to get your latest score.');
      });
    });

    socket.on('room:downvote', function(downvote) {
      if ($scope.playing) {
        if (!$scope.playing.downvotes) {
          $scope.playing.downvotes = {};
        }

        $scope.playing.downvotes[downvote.user] = true;
      }

      if (!$scope.isCurrentController) {
        return;
      }

      CurrentUser.get({}, function(response) {
        if (!response || !response.success || !response.user) {
          console.log('CurrentUser.get', response);

          Alert.warning('Something went wrong while trying to get your latest score.');
          return;
        }

        socket.roomUpdate(response.user);
      }, function(response) {
        console.log('CurrentUser.get', response);

        Alert.warning('Something went wrong while trying to get your latest score.');
      });

      if (downvote.votes <= -2) {
        $scope.skipTrack();
      }
    });

    socket.on('room:chat:message', function(message) {
      console.log(message);

      $scope.chat.messages.push(message);

      if (message &&
        message.mentionNames &&
        message.mentionedNames.indexOf($scope.current_user.mention.toLowerCase()) !== -1) {

        console.log('mentioned');
        $scope.sendNotification(message.user, message.text, message.picture, 5000);
        $scope.$broadcast('mentioned', true);
      }

      $timeout(function() {
        $('#messages').animate({
          scrollTop: $('#messages')[0].scrollHeight
        }, 200);
      }, 10);
    });

    // TODO: Move these to Room service (badjokeeel) if possible
    $scope.playTrack = function(data) {
      if (!$scope.rdioReady) {
        $scope.rdioPlay = data;
        return;
      }

      console.log('playTrack', data);

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

    $scope.trackFinished = function() {
      console.log('trackFinished');

      $scope.isCurrentController = false;
      socket.sendFinished();
    };

    $scope.updatePosition = function() {
      if (!$scope.playing) {
        return;
      }

      if (window.playingPosition >= $scope.playing.track.duration) {
        return;
      }

      socket.updatePosition(window.playingPosition);

      $scope.updateTimeout = $timeout($scope.updatePosition, 1 * 1000, false);
    };

    window.toggleBroadcast = $scope.toggleBroadcast = function() {
      $scope.isController = !$scope.isController;

      if ($scope.isController) {
        console.log('become a broadcaster');
        socket.requestControl($scope.room.id, $scope.current_user.id);
      } else {
        console.log('become a listener');
        socket.releaseControl($scope.room.id, $scope.current_user.id);
      }
    };

    window.toggleMute = $scope.toggleMute = function() {
      $scope.mute = !$scope.mute;
      apiswf.rdio_setMute($scope.mute);
    };

    window.toggleVisualize = $scope.toggleVisualize = function() {
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

    window.upvote = $scope.upvote = function() {
      if (!$scope.playing ||
        $scope.playing.voted ||
        $scope.voting ||
        !$scope.currentController ||
        $scope.isCurrentController) {

        return;
      }

      var remaining = Math.floor($scope.playing.track.duration - window.playingPosition);
      if (remaining <= 0) {
        return;
      }

      $scope.voting = true;

      User.upvote({
        id: $scope.currentController,
        room: $scope.room.id,
        track: $scope.playing.track.key,
        remaining: remaining
      }, function(response) {
        $scope.voting = false;

        if (!response || !response.success) {
          console.log('User.upvote', response);

          Alert.error('Something went wrong while trying to upvote the track.');
          return;
        }

        if (!$scope.playing) {
          return;
        }

        $scope.playing.voted = true;
        $scope.playing.upvoted = true;

        socket.sendUpvote();
      }, function(response) {
        console.log('User.upvote', response);

        $scope.voting = false;
        Alert.error('Something went wrong while trying to upvote the track.');
      });
    };

    window.downvote = $scope.downvote = function() {
      if (!$scope.playing ||
        $scope.playing.voted ||
        $scope.voting ||
        !$scope.currentController ||
        $scope.isCurentController) {

        return;
      }

      // This is to give us a target expiration for the Redis key
      var remaining = Math.floor($scope.playing.track.duration - window.playingPosition);
      if (remaining <= 0) {
        return;
      }

      $scope.voting = true;

      User.downvote({
        id: $scope.currentController,
        room: $scope.room.id,
        track: $scope.playing.track.key,
        remaining: remaining
      }, function(response) {
        $scope.voting = false;

        if (!response || !response.success) {
          console.log('User.downvote', response);

          Alert.error('Something went wrong while trying to downvote the track.');
          return false;
        }

        if (!$scope.playing) {
          return;
        }

        $scope.playing.voted = true;
        $scope.playing.downvoted = true;

        socket.sendDownvote();
      }, function(response) {
        console.log('User.downvote', response);

        $scope.voting = false;
        Alert.error('Something went wrong while trying to downvote the track.');
      });
    };

    window.skipTrack = $scope.skipTrack = function() {
      if (!$scope.isCurrentController) {
        return;
      }

      console.log('skipTrack');
      $scope.isCurrentController = false;
      socket.sendSkipped();
    };

    $scope.rdioToLstn = function(rdioTrack) {
      var lstnTrack = {
        key: rdioTrack.key,
        link: rdioTrack.shortUrl,
        image: rdioTrack.icon,
        title: rdioTrack.name,
        artist: rdioTrack.artist,
        album: rdioTrack.album,
        position: 0,
        duration: rdioTrack.duration,
        canStream: rdioTrack.canStream,
        user: 0
      };

      if (rdioTrack.icon400) {
        lstnTrack.image = rdioTrack.icon400;
      }

      return lstnTrack;
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

      // If we don't have a track to play, return
      if (!$scope.rdioPlay) {
        return;
      }

      // Play the track
      $scope.playTrack($scope.rdioPlay);
    });

    $scope.$watch('playingTrack', function(newVal, oldVal) {
      console.log('playingTrack', newVal, oldVal);
      if (newVal === oldVal) {
        return;
      }

      // Signal that the track is finished
      if (!newVal) {
        $scope.playing = null;

        // If we're the current controller, tell the server we finished
        if (oldVal && $scope.isCurrentController) {
          $scope.trackFinished(oldVal.key);
        }

        return;
      }

      // Skip auto play tracks from Rdio
      if (newVal.type === 'ap') {
        console.log('trying to play auto-play track', newVal);
        $scope.playing = null;
        return;
      }

      $scope.playing = {
        status: 'playing',
        track: $scope.rdioToLstn(newVal),
        voted: 0,
        upvoted: 0,
        downvoted: 0
      };

      if ($scope.rdioPlay) {
        $scope.playing.voted = $scope.rdioPlay.voted || 0;
        $scope.playing.upvoted = $scope.rdioPlay.upvoted || 0;
        $scope.playing.downvoted = $scope.rdioPlay.downvoted || 0;

        // Clear the rdioPlay variable
        $scope.rdioPlay = null;
      }
    }, true);

    // Rdio Callback (TODO: Move to Rdio service? Redo with jQuery)
    var initPlayback = function() {
      window.playbackHandler = {
        ready: function(user) {
          window.apiswf = $('#apiswf').get(0);

          $scope.$evalAsync(function() {
            $scope.flashEnabled = true;
            $scope.rdioReady = true;
            $scope.rdioUser = user;
          });
        },
        freeRemainingChanged: function(remaining) {
          $scope.$evalAsync(function() {
            Alert.info('You have ' + remaining + ' remaining tracks left on your free account.');
          });
        },
        playStateChanged: function(playState) {
          console.log('play state changed', playState);

          $scope.$evalAsync(function() {
            $scope.playState = playState;
          });
        },
        playingTrackChanged: function(playingTrack, sourcePosition) {
          console.log('playing track changed', playingTrack);

          $scope.$evalAsync(function() {
            $scope.playingTrack = playingTrack;
            $scope.sourcePosition = sourcePosition;
          });
        },
        playingSourceChanged: function(playingSource) {
          console.log('playing source changed', playingSource);

          $scope.$evalAsync(function() {
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
          $scope.$evalAsync(function() {
            Alert.error("You're playing music from a different source. Rdio only allows one source to play music at a time.");
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

      var flashCheck = function(e) {
        $timeout(function() {
            if ($scope.flashEnabled === false) {
              Alert.error('Flash doesn\'t appear to be enabled. Make sure it\'s installed and you\'ve enabled it.');
            }
          }, 5000
        );
      };

      swfobject.embedSWF('//www.rdio.com/api/swf/',
        'apiswf', 1, 1, '9.0.0', 'expressInstall.swf',
        flashVars, params, {}, flashCheck);

    };

    Room.get({
      id: $routeParams.id
    }, function(response) {
      if (!response || !response.success || !response.room) {
        console.log('Room.get', response);

        Alert.error('Something went wrong while trying to load the room data.');
        return;
      }

      $scope.room.update(response.room);
      $scope.playback = response.playback;

      if (response.queue) {
        $scope.queue.tracks = response.queue;
      }

      socket.registerRoom($scope.room.id, $scope.current_user);
      initPlayback();
    }, function(response) {
      console.log('Room.get', response);

      Alert.error('Something went wrong while trying to load the room data.');
    });
  }
])

.controller('UserController', ['$scope', function($scope) {
}]);

})();

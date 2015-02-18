(function() {
'use strict';

angular.module('lstn.controllers', [])

.controller('AppController', ['$scope', function($scope) {
  $scope.$on('socket:error', function(ev, data) {
    console.log('socket:error', ev, data);
  });

  $scope.alerts = {
    success: [],
    info: [],
    warning: [],
    danger: []
  };

  $scope.dismissAlert = function(type) {
    $scope.alerts[type].splice(0, 1);
    console.log($scope.alerts);
  };

  $scope.addAlert = function(message, type) {
    type = type || 'info';

    if (!(type in $scope.alerts)) {
      console.log(type, message);
      return;
    }

    $scope.alerts[type].push(message);
  };
}])

.controller('RoomsController', ['$scope', '$location', 'Room', function($scope, $location, Room) {
  $scope.loading = true;
  $scope.showCreateRoom = false;

  Room.list({}, function(response) {
    $scope.loading = false;
    if (!response || !response.success || !response.rooms) {
      $scope.addAlert('Something went wrong while trying to load the rooms list.', 'danger');
      console.log('Room.list', response);
      return;
    }

    $scope.rooms = response.rooms;
  }, function(response) {
    $scope.loading = false;

    $scope.addAlert('Something went wrong while trying to load the rooms list.', 'danger');
    console.log('Room.list', response);
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
        $scope.addAlert('Something went wrong while trying to create the new room.', 'danger');
        console.log('Room.save', response);
        return false;
      }

      $location.path('/room/' + response.slug);
    }, function(response) {
      $scope.addAlert('Something went wrong while trying to create the new room.', 'danger');
      console.log('Room.save', response);
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
        $scope.addAlert('Something went wrong while trying to save the room.', 'danger');
        console.log('Room.update', response);
        return false;
      }

      $scope.rooms[index] = response.room;
    }, function(response) {
      $scope.addAlert('Something went wrong while trying to save the room.', 'danger');
      console.log('Room.update', response);
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
        $scope.addAlert('Something went wrong while trying to delete the room.', 'danger');
        console.log('Room.delete', response);
        return;
      }

      $scope.rooms.splice(index, 1);
    }, function(response) {
      $scope.addAlert('Something went wrong while trying to delete the room.', 'danger');
      console.log('Room.delete', response);
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

    $scope.queue = [];    
    $scope.roomQueue = [];

    $scope.chat = {
      messages: []
    };

    $scope.trackUnseenChatMessages = true;
    $scope.unseenChatMessages = 0;

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
      $scope.addAlert('Something went wrong while trying to connect to the room.', 'danger');
      console.log('room:connect:error', data);
    });

    socket.on('room:chat:history', function(data) {
      console.log('room:chat:history', data);
      $scope.chat.messages = data;

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
      if (!$scope.queue || $scope.queue.length === 0) {
        $scope.addAlert("You've been made a listener because your queue ran out of music.", 'info');
        $scope.isController = false;
        console.log('room:controller:empty');
        socket.emit('room:controller:empty');
        return;
      }

      var song = $scope.queue.shift();
      $scope.queue.push(song);

      console.log('room:controller:playing', song);
      socket.emit('room:controller:playing', song);

      CurrentUser.updateQueue({
        queue: $scope.queue
      }, function(response) {
        if (!response || !response.success) {
          $scope.addAlert('Something went wrong while trying to move the song to the bottom of your queue.', 'danger');
          console.log('moveToBottomOfQueue', response);
          return;
        }
      }, function(response) {
        $scope.addAlert('Something went wrong while trying to move the song to the bottom of your queue.', 'danger');
        console.log('moveToBottomOfQueue', response);
      });
    });

    socket.on('room:playing', function(data) {
      console.log('room:playing', data);

      if (!$scope.rdioReady) {
        $scope.rdioPlay = data;
        return;
      }

      $scope.playSong(data);
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
          $scope.addAlert('Something went wrong while trying to get your latest score.', 'warning');
          console.log('CurrentUser.get', response);
          return;
        }

        socket.roomUpdate(response.user);
      }, function(response) {
        $scope.addAlert('Something went wrong while trying to get your latest score.', 'warning');
        console.log('CurrentUser.get', response);
      });
    });

    socket.on('room:downvote', function(downvote) {
      if ($scope.playing) {
        if (!$scope.playing.downvotes) {
          $scope.playing.downvotes = {};
        }

        $scope.playing.downvotes[upvote.user] = true;
      }

      if (!$scope.isCurrentController) {
        return;
      }

      CurrentUser.get({}, function(response) {
        if (!response || !response.success || !response.user) {
          $scope.addAlert('Something went wrong while trying to get your latest score.', 'warning');
          console.log('CurrentUser.get', response);
          return;
        }

        socket.roomUpdate(response.user);
      }, function(response) {
        $scope.addAlert('Something went wrong while trying to get your latest score.', 'warning');
        console.log('CurrentUser.get', response);
      });

      if (score <= -2) {
        $scope.skipSong();
      }
    });

    socket.on('room:chat:message', function(message) {
      console.log(message);
      
      $scope.chat.messages.push(message);
      if ($scope.trackUnseenChatMessages) {
        $scope.unseenChatMessages += 1;
      }

      if (message.mentionedNames.indexOf($scope.current_user.mention.toLowerCase()) !== -1) {
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
    $scope.playSong = function(data) {
      if (!$scope.rdioReady) {
        $scope.rdioPlay = data;
        return;
      }

      console.log('playSong', data);

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
      console.log('songFinished');

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
        console.log('become a broadcaster');
        socket.requestControl($scope.room.id, $scope.current_user.id);
      } else {
        console.log('become a listener');
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
          $scope.addAlert('Something went wrong while trying to upvote the song.', 'danger');
          console.log('User.upvote', response);
          return;
        }

        if (!$scope.playing) {
          return;
        }

        $scope.playing.voted = true;
        $scope.playing.upvoted = true;

        socket.sendUpvote();
      }, function(response) {
        $scope.voting = false;

        $scope.addAlert('Something went wrong while trying to upvote the song.', 'danger');
        console.log('User.upvote', response);
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

      // This is to give us a target expiration for the Redis key
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
          $scope.addAlert('Something went wrong while trying to downvote the song.', 'danger');
          console.log('User.downvote', response);
          return false;
        }

        if (!$scope.playing) {
          return;
        }

        $scope.playing.voted = true;
        $scope.playing.downvoted = true;

        socket.sendDownvote();
      }, function(response) {
        $scope.voting = false;

        $scope.addAlert('Something went wrong while trying to downvote the song.', 'danger');
        console.log('User.downvote', response);
      });
    };
  
    $scope.skipSong = function() {
      if (!$scope.isCurrentController) {
        return;
      }

      console.log('skipSong');
      $scope.isCurrentController = false;
      socket.sendSkipped();
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
        canStream: rdioSong.canStream,
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
        console.log('trying to play auto-play song', newVal);
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
            $scope.rdioReady = true;
            $scope.rdioUser = user;
          });
        },
        freeRemainingChanged: function(remaining) {
          $scope.$evalAsync(function() {
            $scope.addAlert('You have ' + remaining + ' remaining songs left on your free account.', 'info');
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
            $scope.addAlert("You're playing music from a different source. Rdio only allows one source to play music at a time.", 'danger');
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
  
      swfobject.embedSWF('//www.rdio.com/api/swf/',
        'apiswf', 1, 1, '9.0.0', 'expressInstall.swf',
        flashVars, params, {});
    };
  
    $scope.addSongToQueue = function(song) {
      song.addingToQueue = true;
      CurrentUser.addToQueue({
        id: song.key
      }, function(response) {
        song.addingToQueue = false;
        if (!response || !response.success || !response.queue) {
          $scope.addAlert('Something went wrong while trying to add the song to your queue.', 'danger');
          console.log('CurrentUser.addToQueue', response);
          return;
        }
  
        $scope.queue = response.queue;
        $timeout(function() {
          $('#queue').animate({
            scrollTop: $('#queue')[0].scrollHeight
          }, 500);
        }, 10);
      }, function(response) {
        song.addingToQueue = false;
        $scope.addAlert('Something went wrong while trying to add the song to your queue.', 'danger');
        console.log('CurrentUser.addToQueue', response);
      });
    };

    $scope.$watch('queue', function() {
      var set = {};
      for (var i = 0; i < $scope.queue.length; i++) {
        set[$scope.queue[i].key] = true;
      }
      $scope.queueBitset = set;
    });
  
    $scope.removeSongFromQueue = function(song, index) {
      song.removingFromQueue = true;
      CurrentUser.removeFromQueue({
        id: song.key,
        index: index
      }, function(response) {
        song.removingFromQueue = false;
        if (!response || !response.success || !response.queue) {
          $scope.addAlert('Something went wrong while trying to remove the song from your queue.', 'danger');
          console.log('CurrentUser.removeFromQueue', response);
          return;
        }
        $scope.queue = response.queue;
      }, function(response) {
        song.removingFromQueue = false;
        $scope.addAlert('Something went wrong while trying to remove the song from your queue.', 'danger');
        console.log('CurrentUser.removeFromQueue', response);
      });
    };

    
    $scope.moveToTopOfQueue = function(index) {
      var tracks = $scope.queue.splice(index, 1);
      if (!tracks || tracks.length === 0) {
        $scope.addAlert('Something went wrong while trying to move the song to the top of your queue.', 'danger');
        console.log('moveToTopOfQueue', 'no tracks to move');
        return;
      }

      $scope.queue.unshift(tracks[0]);

      CurrentUser.updateQueue({
        queue: $scope.queue
      }, function(response) {
        if (!response || !response.success) {
          $scope.addAlert('Something went wrong while trying to move the song to the top of your queue.', 'danger');
          console.log('moveToTopOfQueue', response);
          return;
        }

        $timeout(function() {
          $('#queue').animate({
            scrollTop: 0
          }, 500);
        }, 10);
      }, function(response) {
        $scope.addAlert('Something went wrong while trying to move the song to the top of your queue.', 'danger');
        console.log('moveToTopOfQueue', response);
      });
    };
  
    Room.get({
      id: $routeParams.id
    }, function(response) {
      if (!response || !response.success || !response.room) {
        $scope.addAlert('Something went wrong while trying to load the room data.', 'danger');
        console.log('Room.get', response);
        return;
      }
  
      $scope.room = response.room;
      $scope.playback = response.playback;

      if (response.queue) {
        $scope.queue = response.queue;
      }
  
      socket.registerRoom($scope.room.id, $scope.current_user);
      initPlayback();
    }, function(response) {
      $scope.addAlert('Something went wrong while trying to load the room data.', 'danger');
      console.log('Room.get', response);
    });
  
    CurrentUser.playlists({}, function(response) {
      if (!response || !response.success || !response.playlists) {
        $scope.addAlert('Something went wrong while trying to load your playlists.', 'danger');
        console.log('CurrentUser.playlists', response);
        return;
      }

      $scope.playlists = response.playlists;
    }, function(response) {
      $scope.addAlert('Something went wrong while trying to load your playlists.', 'danger');
      console.log('CurrentUser.playlists', response);
    });
  }
])

.controller('UserController', ['$scope', function($scope) {
}]);

})();

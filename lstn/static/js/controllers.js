(function() {
'use strict';

angular.module('lstn.controllers', [])

.controller('AppController', ['$scope', function($scope) {
}])

.controller('RoomsController', ['$scope', 'Room', function($scope, Room) {
  Room.list({}, function(response) {
    if (!response || !response.success || !response.rooms) {
      // TODO: Error
      return;
    }

    $scope.rooms = response.rooms;
  });
}])

.controller('RoomController', ['$scope', '$routeParams', '$timeout', 'Room', 'User', 'Playlist', function($scope, $routeParams, $timeout, Room, User, Playlist) {
  $scope.mute = false;
  $scope.visualize = false;

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
    if ($scope.playing
      && $scope.playing.song
      && typeof $scope.playing.song.voted !== 'undefined'
      && $scope.playing.song.voted) {
      
      return;
    }
      
    $scope.playing.song.voted = 1;
  };

  $scope.downvote = function() {
    if ($scope.playing
      && $scope.playing.song
      && typeof $scope.playing.song.voted !== 'undefined'
      && $scope.playing.song.voted) {
      
      return;
    }

    $scope.playing.song.voted = 1;
  }

  $scope.$watch('playingTrack', function(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }

    if (!newVal) {
      $scope.playing = null;
      return;
    }

    $scope.playing = {
      status: 'playing',
      song: {
        key: newVal.key,
        link: newVal.shortUrl,
        image: newVal.icon,
        title: newVal.name,
        artist: newVal.artist,
        album: newVal.album,
        position: 0,
        duration: newVal.duration,
        voted: 0,
        user: 0
      }
    };
  });

  $scope.$watch('playState', function(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }

    if (!newVal) {
      return;
    }

    var state = parseInt(newVal, 10);
    if (!isNaN(state)) {
      return;
    }

    var states = ['paused', 'playing', 'stopped', 'buffering', 'paused']
    if (state < 0 || state > 4) {
      return;
    }

    $scope.playing.status = states[state];
  });

  $scope.muteAudio = function() {
  };

  $scope.initPlayback = function() {
    window.playbackHandler = {
      ready: function(user) {
        window.apiswf = $('#apiswf').get(0);

        var scope = angular.element(document.body).scope();
        scope.$evalAsync(function() {
          $scope.rdioUser = user;
        });
      },
      freeRemainingChanged: function(remaining) {
        var scope = angular.element(document.body).scope();
        scope.$evalAsync(function() {
          $scope.remaining = remaining;
        });
      },
      playStateChanged: function(playState) {
        var scope = angular.element(document.body).scope();
        scope.$evalAsync(function() {
          $scope.playState = playState;
        });
      },
      playingTrackChanged: function(playingTrack, sourcePosition) {
        if (!playingTrack) {
          return;
        }

        var scope = angular.element(document.body).scope();
        scope.$evalAsync(function() {
          $scope.playingTrack = playingTrack;
          $scope.sourcePosition = sourcePosition;
        });
      },
      playingSourceChanged: function(playingSource) {
        var scope = angular.element(document.body).scope();
        scope.$evalAsync(function() {
          $scope.playingSource = $scope.playingSource;
        });
      },
      volumeChanged: function(volume) {},
      muteChanged: function(mute) {},
      positionChanged: function(position) {
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
        console.log('playing somewhere else');
      },
      updateFrequencyData: function(data) {
        var frequencies = data.split(',');

        $('.playing__visualization div').each(function(i) {
          var height = Math.max(0, Math.min(parseInt(parseFloat(frequencies[i]) * 175, 10), 175))
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

    //enableLogging: 1

    var params = {
      allowScriptAccess: 'always'
    };

    swfobject.embedSWF('http://www.rdio.com/api/swf/',
      'apiswf', 1, 1, '9.0.0', 'expressInstall.swf',
      flashVars, params, {});
  };

  $scope.playSong = function(id) {
    apiswf.rdio_play(id);
  };

  $scope.stopSong = function() {
    apiswf.rdio_stop();
  };

  $scope.pauseSong = function() {
    apiswf.rdio_pause();
  };

  $scope.previousSong = function() {
    apiswf.rdio_previous();
  };

  $scope.nextSong = function() {
    apiswf.rdio_next();
  };

  $scope.addSongToQueue = function(room_id, song_id) {
    Room.addQueue({
      id: room_id,
      song_id: song_id
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

  $scope.removeSongFromQueue = function(room_id, track_id) {
    Room.removeQueue({
      id: room_id,
      target: track_id
    }, function(response) {
      if (!response || !response.success || !response.queue) {
        return;
      }

      $scope.queue = response.queue;
    });
  };

  Room.get({
    id: $routeParams.id
  }, function(response) {
    if (!response || !response.success || !response.room || !response.roster || !response.queue) {
      // TODO: Error
      return;
    }

    $scope.room = response.room;
    $scope.roster = response.roster;
    $scope.queue = response.queue;
    $scope.playback = response.playback;

    $scope.initPlayback();
  });

  User.playlists({}, function(response) {
    if (!response || !response.success || !response.playlists) {
      // TODO: Error
      return;
    }

    $scope.playlists = response.playlists;
  });

}])

.controller('UserController', ['$scope', function($scope) {
}]);

})();

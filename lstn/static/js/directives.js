(function() {
'use strict';

angular.module('lstn.directives', ['sc.twemoji'])
.config(['twemojiProvider', function(twemojiProvider) {
  twemojiProvider.setOptions({ size: 16 });
}])

.directive('lstnEnter', function() {
  return function($scope, $element, $attrs) {
    $element.bind('keydown keypress', function(event) {
      if (event.which !== 13) {
        return;
      }

      var mentionMenuVisible = $('#mention-menu').is(':visible');
      var emoticonMenuVisible = $('#emoticon-menu').is(':visible');

      if (!mentionMenuVisible && !emoticonMenuVisible) {
        $scope.$apply(function() {
          $scope.$eval($attrs.lstnEnter);
        });
      }

      event.preventDefault();
    });
  };
})

.directive('lstnRoomRoster', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-roster.html'
    };
  }
])

.directive('lstnRoomPlaying', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-playing.html'
    };
  }
])

.directive('lstnRoomActivity', ['socket', 'emojiMap',
  function(socket, emojiMap) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-activity.html',
      link: function($scope, $element, $attrs) {
        $scope.mentionNames = [];
        $scope.emoticons = [];
        $scope.mentioned = false;

        $scope.$on('mentioned', function(e) {
          $scope.mentioned = true;
        });

        $scope.message = {
          sender: $scope.current_user.id,
          user: $scope.current_user,
          text: null,
          type: 'message'
        };

        $scope.sendMessage = function() {
          if (!$scope.message || !$scope.message.text) {
            return;
          }

          socket.sendMessage($scope.message);
          $scope.message.text = null;
        };

        $scope.searchRoster = function(term) {
          if (!$scope.roster || !$scope.roster.mentionNames) {
            return;
          }

          var mentionNames = [];
          if (term) {
            angular.forEach($scope.roster.mentionNames, function(user) {
              if (user &&
                user.label &&
                user.label.toUpperCase().indexOf(term.toUpperCase()) >= 0) {

                this.push(user);
              }
            }, mentionNames);
          }

          $scope.mentionNames = mentionNames;
        };

        $scope.getUser = function(user) {
          return '@' + user.label;
        };

        $scope.searchEmoticons = function(term) {
          var emoticons = [];

          if (term && term.length > 2) {
            angular.forEach(emojiMap, function(value, text) {
              var name = text.substr(1, text.length - 2).toUpperCase();

              if (name && name.indexOf(term.toUpperCase()) >= 0) {
                this.push({
                  text: text,
                  value: value
                });
              }
            }, emoticons);
          }

          $scope.emoticons = emoticons;
        };

        $scope.getEmoticon = function(emoticon) {
          return emoticon.text;
        };
      }
    };
  }
])

.directive('lstnRoomMusic', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-music.html'
    };
  }
])

.directive('lstnPlayingImage', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/playing-image.html'
    };
  }
])

.directive('lstnPlayingInfo', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/playing-info.html',
      link: function($scope, $element, $attrs) {
        $scope.playingStyle = '';
      }
    };
  }
])

.directive('lstnRoomControls', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-controls.html'
    };
  }
])

.directive('lstnRoomControlSkip', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-control-skip.html'
    };
  }
])

.directive('lstnRoomControlVolume', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-control-volume.html'
    };
  }
])

.directive('lstnRoomControlUpvote', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-control-upvote.html'
    };
  }
])

.directive('lstnRoomControlDownvote', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-control-downvote.html'
    };
  }
])

.directive('lstnRoomControlFavorite', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-control-favorite.html'
    };
  }
])

.directive('lstnRoomQueue', ['$timeout', 'Promise', 'Alert', 'CurrentUser',
  function($timeout, Promise, Alert, CurrentUser) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-queue.html',
      link: function($scope, $element, $attrs) {
        var request = null;

        $scope.oldQueue = null;

        $scope.sortableOptions = {
          'ui-floating': false,
          axis: 'y',
          start: function(e, ui) {
            $scope.oldQueue = angular.copy($scope.queue);
          },
          stop: function(e, ui) {
            if (angular.equals($scope.oldQueue, $scope.queue)) {
              $scope.oldQueue = null;
              return;
            }

            $scope.oldQueue = null;

            request = CurrentUser.updateQueue({
              queue: $scope.queue.tracks
            }, function(response) {
              if (!response || !response.success) {
                Alert.error('Something went wrong while updating your queue');
                return;
              }
            }, function(response) {
              Alert.error('Something went wrong while updating your queue');
            });
          }
        };

        $scope.$on('$destroy', function() {
          Promise.cancel(request);
        });
      }
    };
  }
])

.directive('lstnMoreMusic', ['$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/more-music.html',
      link: function($scope, $element, $attrs) {
        var timeout = null;

        $scope.musicRoot = {
          key: 'category',
          name: 'Room',
          type: 'music',
          position: 0
        };

        $scope.searchRoot = {
          key: 's',
          name: 'Search Results',
          type: 'search',
          position: 0,
          clear: function() {
            $scope.searchQuery = '';
          }
        };

        $scope.$watch('searchQuery', function(newVal, oldVal) {
          if (timeout) {
            $timeout.cancel(timeout);
          }

          if (newVal === oldVal) {
            return;
          }

          if (!newVal) {
            $scope.searchRoot.key = 's';
            return;
          }

          timeout = $timeout(function() {
            $scope.searchRoot.key = newVal;
          }, 300);
        });

        $scope.$on('$destroy', function() {
          if (!timeout) {
            return;
          }

          $timeout.cancel(timeout);
        });
      }
    };
  }
])

.directive('lstnDrilldownBack', ['RdioType', 'RdioName',
  function(RdioType, RdioName) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        current: '=',
        clickHandler: '=?',
        refreshHandler: '=?',
        bulkAddHandler: '=?'
      },
      templateUrl: '/static/partials/directives/drilldown-back.html',
      link: function($scope, $element, $attrs) {
        $scope.name = '';
        if ($scope.current.type in RdioName) {
          $scope.name = RdioName[$scope.current.type];
        }

        $scope.status = {
          open: false
        };

        $scope.showMenu = function() {
          if (!$scope.current) {
            return false;
          }

          if (!$scope.bulkAddHandler) {
            return;
          }

          var type = $scope.current.type;
          if (type in RdioType) {
            type = RdioType[type];
          }

          return type === 'playlist' || type === 'album' || type === 'station';
        };

        $scope.toggleDropdown = function(event) {
          event.preventDefault();
          event.stopPropagation();

          $scope.status.open = !$scope.status.open;
        };
      }
    };
  }
])

.directive('lstnCategory', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        category: '=',
        load: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/category.html'
    };
  }
])

.directive('lstnPlaylistType', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        playlistType: '=',
        load: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/playlist-type.html'
    };
  }
])

.directive('lstnPlaylist', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        playlist: '=',
        load: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/playlist.html'
    };
  }
])

.directive('lstnArtist', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        artist: '=',
        load: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/artist.html'
    };
  }
])

.directive('lstnAlbum', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        album: '=',
        load: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/album.html'
    };
  }
])

.directive('lstnTrack', ['Queue', 'Favorite', 'CurrentRoom',
  function(Queue, Favorite, CurrentRoom) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        track: '=',
        index: '=',
        context: '@',
        count: '='
      },
      templateUrl: '/static/partials/directives/track.html',
      link: function($scope, $element, $attrs) {
        $scope.queue = Queue;
        $scope.favorites = Favorite;

        // Init the restricted regions flag
        var initRegions = function() {
          if (!$scope.track.streamRegions) {
            return;
          }

          var missing = $(CurrentRoom.regions).not($scope.track.streamRegions).get();
          $scope.track.restrictedRegions = missing.length > 0;
        };

        initRegions();

        // Registery to get region updates from the room service
        var listenerId = $scope.$id;
        CurrentRoom.addRegionListener(listenerId, $.proxy(function() {
          initRegions();
        }, this));

        // Handle the Track dropdown
        $scope.status = {
          open: false
        };

        $scope.toggleDropdown = function(event) {
          event.preventDefault();
          event.stopPropagation();

          var dropdown = $element.find('.dropdown');
          if (!dropdown || dropdown.length === 0) {
            return;
          }

          if (!$scope.status.open) {
            if (($(window).scrollTop() + $(window).height()) - $element.offset().top < 200) {
              dropdown.addClass('dropup');
            } else {
              dropdown.removeClass('dropup');
            }
          } else {
            dropdown.removeClass('dropup');
          }

          $scope.status.open = !$scope.status.open;
        };

        // Handle the destroy event
        $scope.$on('$destory', function() {
          CurrentRoom.removeRegionListener(listenerId);
        });
      }
    };
  }
])

.directive('lstnStationType', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        stationType: '=',
        load: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/station-type.html'
    };
  }
])

.directive('lstnStation', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        load: '=',
        context: '@',
        station: '=?',
        radio: '=?'
      },
      templateUrl: '/static/partials/directives/station.html',
      link: function($scope, $element, $attrs) {
        $scope.station  = $scope.station  || {};
        $scope.radio    = $scope.radio    || {};

        $scope.station.key  = $scope.station.key  || $scope.radio.radioKey;
        $scope.station.name = $scope.station.name || $scope.radio.name;
        $scope.station.icon = $scope.station.icon || $scope.radio.icon;

        if ($scope.radio && $scope.radio.name) {
          $scope.station.name = $scope.radio.name + ' Radio';
        }
      }
    };
  }
])

.directive('lstnRoomList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-list.html'
    };
  }
])

.directive('lstnChatMessage', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        message: '='
      },
      templateUrl: '/static/partials/directives/chat-message.html',
      link: function($scope, $element, $attrs) {
        $scope.getMessageClass = function() {
          if (!$scope.message) {
            return null;
          }

          return 'chat__message--' + $scope.message.type;
        };
      }
    };
  }
])

.directive('albumCoverBackground', [function() {
  return {
    link: function($scope, $element) {
      $scope.$watch('playing.track.image', function(imageUrl) {
        if (!imageUrl) {
          return;
        }

        $element.css('background-image', 'url(' + imageUrl + ')');
        $element.css('background-size', 'cover');
      });
    }
  };
}])

.directive('timeFromNow', ['$timeout', '$filter',
  function($timeout, $filter) {
    return {
      scope: {
        timeFromNow: '='
      },
      link: function($scope, element) {
        var timeoutId;
        var intervalLength = 1000 * 60;
        var filter = $filter('timeFromNow');

        function updateTime() {
          element.text(filter($scope.timeFromNow));
        }

        function updateLater() {
          timeoutId = $timeout(function() {
            updateTime();
            updateLater();
          }, intervalLength);
        }

        element.bind('$destroy', function() {
          $timeout.cancel(timeoutId);
        });

        updateTime();
        updateLater();
      }
    };
  }
])

.directive('lstnCarousel', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      root: '=',
      context: '@'
    },
    templateUrl: '/static/partials/directives/carousel.html',
    link: function($scope, $element, $attrs) {
      var slidesContainer = $('.slides', $element);

      var init = function(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }

        if (!newVal) {
          return;
        }

        $scope.slides = [newVal];
        slidesContainer.css('left', '0%');
      };

      $scope.$watch('root', init, true);
      init($scope.root, null);

      $scope.load = function(item) {
        item.position = $scope.slides.length + 1;
        $scope.slides.push(item);

        $timeout(function() {
          item.promise.then(function() {
            $scope.next();
          });
        }, 100);
      };

      $scope.close = function() {
        $scope.prev();
        $timeout(function() {
          $scope.slides.pop();
        }, 400);
      };

      $scope.next = function() {
        var offset = Math.max(0, $scope.slides.length - 1) * -100;
        slidesContainer.css('left', offset + '%');
      };

      $scope.prev = function() {
        var offset = Math.max(0, $scope.slides.length - 2) * -100;
        slidesContainer.css('left', offset + '%');
      };
    }
  };
}])

.directive('lstnSlide', ['Promise', 'Alert', 'Loader', 'RdioType', 'Queue',
  function(Promise, Alert, Loader, RdioType, Queue) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        load: '=',
        close: '=',
        current: '=',
        context: '@'
      },
      templateUrl: '/static/partials/directives/slide.html',
      link: function($scope, $element, $attrs) {
        var request = null;

        $scope.addTracks = function(tracks, position) {
          $scope.current.loading = true;
          request = Queue.addTracks(tracks, position).then(function(response) {
            $scope.current.loading = false;
          }, function(response) {
            $scope.current.loading = false;
          });
        };

        // If the current slide's key changes, reload the data
        $scope.$watch('current.key', function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }

          if (!newVal) {
            return;
          }

          $scope.refresh();
        });

        // Reload the data
        $scope.refresh = function() {
          if (!$scope.current) {
            return;
          }

          $scope.current.loading = true;

          // Cancel the current request
          if (request) {
            Promise.cancel(request);
          }

          request = $scope.current.promise = Loader.load($scope.current);
          if (!request) {
            Alert.error('Something when wrong when trying to load "' + $scope.current.name + '"');
            return;
          }

          request.then(function(response) {
            $scope.current.loading = false;

            if (!response || !response.success || !response.data) {
              Alert.error('Something when wrong when trying to load "' + $scope.current.name + '"');
              return;
            }

            $scope.data = response.data;

            $scope.current.keys = [];
            if (response.data) {
              response.data.forEach(function(entry) {
                if (!entry || !entry.key) {
                  return;
                }

                if ('canStream' in entry && !entry.canStream) {
                  return;
                }

                $scope.current.keys.push(entry.key);
              });
            }
          }, function(response) {
            $scope.current.loading = false;
            Alert.error('Something when wrong when trying to load "' + $scope.current.name + '"');
            return;
          });
        };

        $scope.refresh();

        // Translate the Rdio type to a Lstn type
        $scope.getType = function(type) {
          if (!(type in RdioType)) {
            return type;
          }

          return RdioType[type];
        };

        $scope.$on('$destroy', function() {
          Promise.cancel(request);
        });
      }
    };
  }
]);

})();

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
        $scope.$apply(function(){
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
          type: 'message',
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

.directive('lstnMusicSearch', ['$timeout', 'Alert', 'CurrentUser', 'Artist', 'Album',
  function($timeout, Alert, CurrentUser, Artist, Album) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/music-search.html',
      link: function($scope, $element, $attrs) {
        // Build a map of slide names to indices
        $scope.searchSlides = {};

        angular.element('#search-carousel .carousel-inner div.item').each(function(index) {
          var id = this.getAttribute('id');
          $scope.searchSlides[id] = index;
        });

        $scope.searchResults = [];
        $scope.searchQuery = null;

        $scope.clearSearchResults = function() {
          $scope.searchResults = [];
          $scope.searchQuery = null;
        };

        $scope.currentArtist = null;

        $scope.albums = [];
        $scope.loadAlbums = function(artist) {
          artist.loadingAlbums = true;

          Artist.getAlbums(artist.key).then(function(response) {
            if (!response || !response.albums) {
              artist.loadingAlbums = false;
              Alert.error('Something happened while trying to load albums for the artist.');
              return;
            }

            $scope.albums = response.albums;
            $scope.currentArtist = artist;

            $timeout(function() {
              artist.loadingAlbums = false;

              var controller = angular.element('#search-carousel')
                .controller('carousel');

              var nextSlide = controller.slides[$scope.searchSlides.search_albums];
              controller.select(nextSlide, 'next');
            }, 100);
          }, function(response) {
            artist.loadingAlbums = false;
            Alert.error('Something happened while trying to load albums for the artist.');
          });
        };

        $scope.closeArtist = function() {
          var controller = angular.element('#search-carousel')
            .controller('carousel');

          var prevSlide = controller.slides[$scope.searchSlides.search_results];
          controller.select(prevSlide, 'prev');

          $scope.currentArtist = null;
        };

        $scope.currentAlbum = null;

        $scope.tracks = [];
        $scope.loadAlbumTracks = function(album) {
          album.loadingTracks = true;

          Album.getTracks(album.key).then(function(response) {
            if (!response || !response.tracks) {
              album.loadingTracks = false;
              Alert.error('Something happened while trying to load tracks for the album.');
              return;
            }

            $scope.tracks = response.tracks;
            $scope.currentAlbum = album;

            $timeout(function() {
              album.loadingTracks = false;

              var controller = angular.element('#search-carousel')
                .controller('carousel');

              var nextSlide = controller.slides[$scope.searchSlides.search_tracks];
              controller.select(nextSlide, 'next');
            }, 100);
          }, function(response) {
            album.loadingTracks = false;
            Alert.error('Something happened while trying to load tracks for the album.');
          });
        };

        $scope.closeAlbum = function() {
          var controller = angular.element('#search-carousel')
            .controller('carousel');

          var targetSlide = $scope.searchSlides.search_albums;
          if (!$scope.currentArtist) {
            targetSlide = $scope.searchSlides.search_results;
          }

          var prevSlide = controller.slides[targetSlide];
          controller.select(prevSlide, 'prev');

          $scope.currentAlbum = null;
        };

        $scope.$watch('searchQuery', function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }

          if (!newVal) {
            $scope.searchResults = [];
            return;
          }

          if (newVal.length < 3) {
            return;
          }

          CurrentUser.search({
            query: newVal
          }, function(response) {
            if (!response || !response.success || !response.results) {
              // TODO: Error
              return;
            }

            $scope.searchResults = response.results;
          }, function(response) {
            // TODO: Error
          });
        });
      }
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

.directive('lstnVisualizer', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/visualizer.html',
      link: function($scope, $element, $attrs) {
        $scope.bands = 10;
        $scope.getNumber = function(num) {
          return new Array(num);
        };
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

.directive('lstnRoomQueue', ['$timeout', 'Alert', 'CurrentUser',
  function($timeout, Alert, CurrentUser) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-queue.html',
      link: function($scope, $element, $attrs) {
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

            CurrentUser.updateQueue({
              queue: $scope.queue
            }, function(response) {
              if (!response || !response.success) {
                console.log('CurrentUser.updateQueue', response);

                Alert.error('Something went wrong while updating your queue');
                return;
              }
            }, function(response) {
              console.log('CurrentUser.updateQueue', response);

              Alert.error('Something went wrong while updating your queue');
            });
          }
        };
      }
    };
  }
])

.directive('lstnMoreMusic', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/more-music.html'
    };
  }
])

.directive('lstnMusicCategories', ['$timeout', 'Alert', 'CurrentUser', 'Playlist',
  function($timeout, Alert, CurrentUser, Playlist) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/music-categories.html',
      link: function($scope, $element, $attrs) {
        // Build a map of slide names to indices
        $scope.musicSlides = {};

        angular.element('#category-carousel .carousel-inner div.item').each(function(index) {
          var id = this.getAttribute('id');
          $scope.musicSlides[id] = index;
        });

        // Categories
        $scope.categories = [{
          name: 'Playlists',
          type: 'playlists',
        },{
          name: 'Stations',
          type: 'stations'
        },{
          name: 'Collections',
          type: 'collections'
        }];

        $scope.currentCategory = null;

        $scope.loadChildren = function(category) {
          category.loading = true;

          if (category.type == 'playlists') {
            $scope.loadPlaylistTypes(category);
          } else if (category.type == 'stations') {
            $scope.loadStationTypes(category);
          } else if (category.type == 'collections') {
            $scope.loadCollectionTypes(category);
          }
        };

        // Playlist Types
        $scope.playlistTypes = [{
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
        }];

        $scope.loadPlaylistTypes = function(category) {
          category.loading = false;
          $scope.currentCategory = category;

          var controller = angular.element('#category-carousel')
            .controller('carousel');

          var nextSlide = controller.slides[$scope.musicSlides.playlist_types];
          controller.select(nextSlide, 'next');
        };

        $scope.closeCategory = function() {
          var controller = angular.element('#category-carousel')
            .controller('carousel');

          var prevSlide = controller.slides[$scope.musicSlides.categories];
          controller.select(prevSlide, 'prev');

          $scope.currentCategory = null;
        };

        // Playlists
        $scope.currentPlaylistType = null;
        $scope.playlists = [];

        $scope.loadPlaylists = function(playlistType) {
          console.log('loadPlaylists', playlistType);
          playlistType.loadingPlaylists = true;

          CurrentUser.getPlaylists(playlistType.key).then(function(response) {
            if (!response || !response.playlists || !response.playlists[playlistType.key]) {
              console.log('LoadPlaylists', response);

              playlistType.loadingPlaylists = false;
              Alert.error('Something went wrong while trying to load the playlists.');
              return;
            }

            $scope.playlists = response.playlists[playlistType.key];
            $scope.currentPlaylistType = playlistType;

            $timeout(function() {
              playlistType.loadingPlaylists = false;

              var controller = angular.element('#category-carousel')
                .controller('carousel');

              var nextSlide = controller.slides[$scope.musicSlides.playlists];
              controller.select(nextSlide, 'next');
            }, 100);
          }, function(response) {
            playlistType.loadingPlaylists = false;
            Alert.error('Something went wrong while trying to load the playlists.');
          });
        };

        $scope.closePlaylistType = function() {
          var controller = angular.element('#category-carousel')
            .controller('carousel');

          var prevSlide = controller.slides[$scope.musicSlides.playlist_types];
          controller.select(prevSlide, 'prev');

          $scope.currentPlaylistType = null;
        };

        // Playlist Tracks
        $scope.currentPlaylist = null;
        $scope.tracks = [];

        $scope.loadPlaylistTracks = function(playlist) {
          playlist.loadingTracks = true;

          Playlist.getTracks(playlist.key).then(function(response) {
            if (!response || !response.tracks) {
              console.log('LoadTracks', response);

              playlist.loadingTracks = false;
              Alert.error('Something went wrong while trying to load the playlist tracks.');
              return;
            }

            $scope.tracks = response.tracks;
            $scope.currentPlaylist = playlist;

            $timeout(function() {
              playlist.loadingTracks = false;

              var controller = angular.element('#category-carousel')
                .controller('carousel');

              var nextSlide = controller.slides[$scope.musicSlides.playlist_tracks];
              controller.select(nextSlide, 'next');
            }, 100);
          }, function(response) {
            playlist.loadingTracks = false;
            Alert.error('Something went wrong while trying to load the playlist tracks.');
          });
        };

        $scope.closePlaylist = function() {
          var controller = angular.element('#category-carousel')
            .controller('carousel');

          var prevSlide = controller.slides[$scope.musicSlides.playlists];
          controller.select(prevSlide, 'prev');

          $scope.currentPlaylist = null;
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
        loadChildren: '=',
        index: '=',
        context: '='
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
        loadPlaylists: '=',
        index: '=',
        context: '='
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
        loadPlaylistTracks: '=',
        index: '=',
        context: '='
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
        loadAlbums: '=',
        index: '=',
        context: '='
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
        loadAlbumTracks: '=',
        index: '=',
        context: '='
      },
      templateUrl: '/static/partials/directives/album.html'
    };
  }
])

.directive('lstnTrack', ['Queue',
  function(Queue) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        track: '=',
        index: '=',
        context: '='
      },
      templateUrl: '/static/partials/directives/track.html',
      link: function($scope, $element, $attrs) {
        $scope.queue = Queue;
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
        message: '=',
        index: '='
      },
      templateUrl: '/static/partials/directives/chat-message.html',
      link: function($scope, $element, $attrs) {
        var messageClasses = {
          playing: 'list-group-item-warning',
          skipped: 'list-group-item-danger',
          upvote: 'list-group-item-success',
          downvote: 'list-group-item-danger'
        };

        $scope.getMessageClass = function() {
          if (!$scope.message) {
            return null;
          }

          if ($scope.message.sender === $scope.current_user.id && $scope.message.type === 'message') {
            return 'list-group-item-info';
          }

          if (!($scope.message.type in messageClasses)) {
            return null;
          }

          return messageClasses[$scope.message.type];
        };
      }
    };
  }
])

.directive('albumCoverBackground', [function() {
  return {
    link: function($scope, $element) {
      $scope.$watch('playing.track.image', function(imageUrl) {
        if (imageUrl) {
          $element.css('background-image', 'url(' + imageUrl + ')');
          $element.css('background-size', 'cover');
        } else {

        }
      });
    }
  };
}])

.directive('timeFromNow', ['$timeout', '$filter', function($timeout, $filter) {
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
]);
})();

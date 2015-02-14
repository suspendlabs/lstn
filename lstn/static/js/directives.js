(function() {
'use strict';

angular.module('lstn.directives', [])
.directive('lstnEnter', function() {
  return function($scope, $element, $attrs) {
    $element.bind('keydown keypress', function(event) {
      if (event.which !== 13) {
        return;
      }

      $scope.$apply(function(){
        $scope.$eval($attrs.lstnEnter);
      });

      event.preventDefault();
    });
  };
})

.directive('holder', [
  function() {
    return {
      link: function(scope, element, attrs) {
        attrs.$set('data-src', attrs.holder);
        Holder.run({images:element[0]});
      }
    };
  }
])

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

.directive('lstnRoomMusic', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-music.html'
    };
  }
])

.directive('lstnMusicSearch', ['CurrentUser',
  function(CurrentUser) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/music-search.html',
      link: function($scope, $element, $attrs) {
        $scope.searchResults = [];
        $scope.searchQuery = null;

        $scope.clearSearchResults = function() {
          $scope.searchResults = [];
          $scope.searchQuery = null;
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

.directive('lstnMusicCategories', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/music-categories.html'
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
      templateUrl: '/static/partials/directives/playing-info.html'
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

.directive('lstnRoomQueue', ['CurrentUser', 'socket',
  function(CurrentUser, socket) {
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
                // TODO: Error
                return;
              }
            }, function(response) {
              // TODO: Error
            });
          }
        };

        $scope.message = {
          sender: $scope.current_user.id,
          user: $scope.current_user.name,
          text: null
        };

        $scope.sendMessage = function() {
          if (!$scope.message || !$scope.message.text) {
            return;
          }

          socket.sendMessage($scope.message);
          $scope.message.text = null;
        };
      }
    };
  }
])

.directive('lstnCategory', ['$parse', 'CurrentUser',
  function($parse, CurrentUser) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      templateUrl: '/static/partials/directives/category.html',
      link: function($scope, $element, $attrs) {
        $scope.name = $parse($attrs.name)($scope);
        $scope.type = $parse($attrs.type)($scope);
        $scope.open = $parse($attrs.open)($scope);

        // TODO: We should consider passing this in
        $scope.group = $element.parent().attr('id');

        $scope.categoryId = Date.now();
        $scope.refreshingList = false;

        $scope.categoryStatus = {
          open: $scope.open || false
        };

        $scope.toggleCategoryOpen = function() {
          $scope.categoryStatus.open = !$scope.categoryStatus.open;
        };

        $scope.refreshList = function() {
          console.log('refreshList', $scope.type);

          $scope.refreshingList = true;
          $scope.categoryStatus.open = false;

          CurrentUser.playlists({
            id: $scope.type
          }, function(response) {
            $scope.refreshingList = false;

            if (!response || !response.success || !response.playlists) {
              // TODO: Error
              return;
            }

            $scope.playlists[type] = response.playlists[type];

            $scope.categoryStatus.open = true;
          }, function(response) {
            $scope.refreshingList = false;
            // TODO: Error
          });
        };
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

.directive('lstnTrack', ['$parse',
  function($parse) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/track.html',
      link: function($scope, $element, $attrs) {
        $scope.cutoff  = $parse($attrs.cutoff || 25)($scope);
        $scope.context = $attrs.context || 'playlist';
        
      }
    };
  }
])

.directive('lstnTrackList', ['$parse',
  function($parse) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/track-list.html',
      link: function($scope, $element, $attrs) {
        $scope.cutoff = $parse($attrs.cutoff || 25)($scope);
      }
    };
  }
])

.directive('lstnPlaylist', ['$timeout', 'Playlist',
  function($timeout, Playlist) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/playlist.html',
      link: function($scope, $element, $attrs) {
        $scope.category = $element.parent().attr('id');

        $scope.status = {
          open: false
        };

        $scope.toggleOpen = function() {
          // Prevent a double click of the toggle
          if ($scope.showLoading) {
            return;
          }

          if (typeof $scope.tracks === 'undefined') {
            $scope.showLoading = true;

            Playlist.tracks({
              id: $scope.playlist.key
            }, function(response) {
              $scope.showLoading = false;

              if (!response || !response.success || !response.tracks) {
                // TODO: Error
                return;
              }

              $scope.tracks = response.tracks;

              $timeout(function() {
                $scope.status.open = !$scope.status.open;
              }, 100);
            }, function(response) {
              $scope.showLoading = false;
              // TODO: Error
            });
          } else {
            $scope.status.open = !$scope.status.open;
          }
        };
      }
    };
  }
]);

})();

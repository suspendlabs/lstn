(function() {
'use strict';

angular.module('lstn.directives', [])
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

.directive('lstnMusicSearch', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/music-search.html'
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

.directive('lstnRoomQueue', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/room-queue.html'
    };
  }
])

.directive('lstnCategory', [
  function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        name: '=',
        open: '='
      },
      templateUrl: '/static/partials/directives/category.html',
      link: function($scope, $element, $attrs) {
        $scope.group = $element.parent().attr('id');

        $scope.categoryId = Date.now();
        $scope.categoryStatus = {
          open: $scope.open || false
        };

        $scope.toggleCategoryOpen = function() {
          $scope.categoryStatus.open = !$scope.categoryStatus.open;
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

.directive('lstnTrack', ['$parse',
  function($parse) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/static/partials/directives/track.html',
      link: function($scope, $element, $attrs) {
        $scope.cutoff = $parse($attrs.cutoff || 25)($scope);
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

.directive('lstnPlaylist', ['Playlist', 
  function(Playlist) {
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

              $scope.status.open = !$scope.status.open;
            }, function(response) {
              $scope.showLoading = false;
              // TODO: Error
            });
          } else {
            $scope.status.open = !$scope.status.open;
          }
        }
      }
    };
  }
]);

})();

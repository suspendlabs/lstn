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
      templateUrl: '/static/partials/room-list.html'
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
          $scope.status.open = !$scope.status.open;

          if (typeof $scope.tracks === 'undefined') {
            Playlist.tracks({
              id: $scope.playlist.key
            }, function(response) {
              if (!response || !response.success || !response.tracks) {
                return;
              }

              $scope.tracks = response.tracks;
            });
          }
        }
      }
    };
  }
]);

})();

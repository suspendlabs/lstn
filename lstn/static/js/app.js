(function() {
'use strict';

angular.module('lstn', [
  'ngRoute',
  'ui.bootstrap',
  'ui.sortable',
  'btford.socket-io',
  'lstn.services',
  'lstn.controllers',
  'lstn.filters',
  'lstn.directives',
  'lstn.templates'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  var routes = {
    '/': {
      templateUrl: 'static/partials/index.html',
      controller: 'AppController',
      controllerAs: 'appCtrl'
    },
    '/rooms': {
      templateUrl: 'static/partials/rooms.html',
      controller: 'RoomsController',
      controllerAs: 'roomsCtrl'
    },
    '/room/:id': {
      templateUrl: 'static/partials/room.html',
      controller: 'RoomController',
      controllerAs: 'roomCtrl'
    },
    '/profile': {
      templateUrl: 'static/partials/profile.html',
      controller: 'UserController',
      controllerAs: 'userCtrl'
    }
  };

  for (var path in routes) {
    $routeProvider.when(path, routes[path]);
  }

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(false);
}])

.run(['$rootScope', function($rootScope) {
  // Publish the user on the root scope.
  var user = document.getElementById('user');
  if (user) {
    user = angular.element(user);
    $rootScope.current_user = angular.fromJson(user.html());
  }

  // Turn on debugging for SocketIO
  /*
  if (window.localStorage) {
    window.localStorage.debug = '*';
  }
  */
}]);

})();

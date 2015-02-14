angular.module('lstn.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/static/partials/directives/category.html',
    "<div id=\"category{{ $id }}\" class=\"category panel panel-primary\">\n" +
    "  <div class=\"panel-heading\" role=\"tab\" id=\"heading{{ $id }}\">\n" +
    "    <h4 class=\"panel-title\">\n" +
    "      <a data-ng-click=\"toggleCategoryOpen()\" aria-expanded=\"{{ categoryStatus.open }}\" aria-controls=\"content{{ $id }}\" data-parent=\"#{{ group }}\">\n" +
    "        <span data-ng-bind=\"name | truncate:28\" title=\"{{ name }}\"></span>\n" +
    "        <span class=\"pull-right glyphicon glyphicon-chevron-right\" data-ng-class=\"{'glyphicon-chevron-down': categoryStatus.open, 'glyphicon-chevron-right': !categoryStatus.open}\"></span>\n" +
    "      </a>\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "  <div id=\"content{{ $id }}\" class=\"panel-collapse\" collapse=\"!categoryStatus.open\" role=\"tabpanel\" aria-labeledby=\"heading{{ $id }}\">\n" +
    "    <div class=\"category__contents panel-body\">\n" +
    "      <div id=\"categoryContents{{ $id }}\" ng-transclude></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/music-categories.html',
    "<div id=\"categories\" class=\"categories\">\n" +
    "  <div class=\"search__container category panel panel-primary\" data-ng-show=\"searchResults && searchResults.length > 0\">\n" +
    "    <div class=\"panel-heading\" role=\"tab\" id=\"search-heading\">\n" +
    "      <h4 class=\"panel-title\">\n" +
    "        <a data-ng-click=\"clearSearchResults()\">\n" +
    "          Search Results\n" +
    "          <span class=\"pull-right glyphicon glyphicon-remove-circle\"></span>\n" +
    "        </a>\n" +
    "      </h4>\n" +
    "    </div>\n" +
    "    <div id=\"search-content\" class=\"tabpanel\" aria-labeledby=\"search-heading\">\n" +
    "      <div class=\"search__contents panel-body\">\n" +
    "        <ul class=\"track__list\">\n" +
    "          <lstn-track data-ng-class-even=\"'track--even'\" data-ng-class-odd=\"'track--odd'\" data-ng-repeat=\"song in searchResults\" data-cutoff=\"28\"></lstn-track>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <lstn-category data-ng-show=\"playlists.owned && playlists.owned.length > 0\" data-name=\"'Your Playlists'\" data-type=\"'owned'\" data-open=\"true\">\n" +
    "    <lstn-playlist data-ng-repeat=\"playlist in playlists.owned\"></lstn-playlist>\n" +
    "  </lstn-category>\n" +
    "  <lstn-category data-ng-show=\"playlists.collab && playlists.collab.length > 0\" data-name=\"'Collaborative Playlists'\" data-type=\"'collab'\">\n" +
    "    <lstn-playlist data-ng-repeat=\"playlist in playlists.collab\"></lstn-playlist>\n" +
    "  </lstn-category>\n" +
    "  <lstn-category data-ng-show=\"playlists.subscribed && playlists.subscribed.length > 0\" data-name=\"'Subscribed Playlists'\" data-type=\"'subscribed'\">\n" +
    "    <lstn-playlist data-ng-repeat=\"playlist in playlists.subscribed\"></lstn-playlist>\n" +
    "  </lstn-category>\n" +
    "  <lstn-category data-ng-show=\"playlists.favorites && playlists.favorites.length > 0\" data-name=\"'Favorited Playlists'\" data-type=\"'favorites'\">\n" +
    "    <lstn-playlist data-ng-repeat=\"playlist in playlists.favorites\"></lstn-playlist>\n" +
    "  </lstn-category>\n" +
    "  <lstn-category data-name=\"'Collections'\" data-type=\"'collections'\">\n" +
    "    Albums / Tracks\n" +
    "    Artists / Tracks\n" +
    "  </lstn-category>\n" +
    "  <lstn-category data-name=\"'Stations'\" data-type=\"'stations'\">\n" +
    "    Stations\n" +
    "  </lstn-category>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/music-search.html',
    "<div>\n" +
    "  <input type=\"text\" class=\"form-control\" data-ng-model=\"searchQuery\" placeholder=\"Search music...\">\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playing-image.html',
    "<div class=\"playing__art col-md-5\">\n" +
    "  <img data-ng-show=\"playing.song.image\" data-ng-src=\"{{ playing.song.image }}\" alt=\"{{ playing.song.title }} - {{ playing.song.artist }}\">\n" +
    "  <div data-ng-show=\"!playing.song.image\"><i class=\"glyphicon glyphicon-music playing__placeholder\"></i></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playing-info.html',
    "<div>\n" +
    "  <div data-ng-show=\"!visualize && !playing.song\" class=\"playing__info playing__info--stopped col-md-7 text-center\">\n" +
    "    <h3>Add music to your queue and click Broadcast to start playing</h3>\n" +
    "  </div>\n" +
    "  <div data-ng-show=\"!visualize && playing.song\" class=\"playing__info playing__info--playing col-md-7 text-center\">\n" +
    "    <h3 class=\"playing__title\" data-ng-bind=\"playing.song.title | truncate:28\"></h3>\n" +
    "    <h4 class=\"playing__artist\" data-ng-bind=\"playing.song.artist | truncate:35\"></h4>\n" +
    "    <p class=\"playing__album\" data-ng-bind=\"playing.song.album | truncate: 40\"></p>\n" +
    "    <div class=\"progress\" data-ng-show=\"playing.song.duration\">\n" +
    "      <div id=\"progress\" class=\"progress-bar progress-bar-info progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"{{ playing.song.duration }}\"></div>\n" +
    "      <span id=\"time\" class=\"time\"></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playlist.html',
    "<div id=\"playlist{{ $id }}\" class=\"playlist panel panel-success\">\n" +
    "  <div class=\"panel-heading\" role=\"tab\" id=\"heading{{ $id }}\">\n" +
    "    <h4 class=\"panel-title\">\n" +
    "      <a data-ng-click=\"toggleOpen()\" aria-expanded=\"{{ status.open }}\" aria-controls=\"content{{ $id }}\" data-parent=\"#{{ category }}\">\n" +
    "        <span data-ng-bind=\"playlist.name | truncate:28\" title=\"{{ playlist.name }}\"></span>\n" +
    "        <span class=\"pull-right glyphicon glyphicon-chevron-right\" data-ng-class=\"{'glyphicon-chevron-down': status.open && !showLoading, 'glyphicon-chevron-right': !status.open && !showLoading, 'glyphicon-refresh spinning': showLoading}\"></span>\n" +
    "      </a>\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "  <div id=\"content{{ $id }}\" class=\"panel-collapse\" collapse=\"!status.open\" role=\"tabpanel\" aria-labeledby=\"heading{{ $id }}\">\n" +
    "    <div class=\"playlist__tracks panel-body\">\n" +
    "      <lstn-track-list data-cutoff=\"28\"></lstn-track-list>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-controls.html',
    "<div class=\"playing__actions col-md-12 text-center\">\n" +
    "  <div class=\"playing__actions__container panel panel-default\">\n" +
    "    <button data-ng-show=\"!mute\" data-ng-disabled=\"!playing.song.key\" type=\"button\" class=\"btn btn-default btn-lg\" aria-label=\"Unmute\" data-ng-click=\"toggleMute()\" title=\"Unmute\">\n" +
    "      <span class=\"glyphicon glyphicon-volume-off\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"mute\" data-ng-disabled=\"!playing.song.key\" type=\"button\" class=\"btn btn-default btn-lg\" aria-label=\"Mute\" data-ng-click=\"toggleMute()\" title=\"Mute\">\n" +
    "      <span class=\"glyphicon glyphicon-volume-up\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"!playing.downvoted && !isCurrentController\" type=\"button\" data-ng-disabled=\"!playing.song.key || playing.song.voted\" class=\"btn btn-danger btn-lg\" aria-label=\"Downvote\" data-ng-click=\"downvote()\" title=\"Downvote\">\n" +
    "      <span class=\"glyphicon glyphicon-thumbs-down\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"playing.downvoted\" type=\"button\" disabled=\"disabled\" class=\"btn btn-danger btn-lg\" aria-label=\"Downvoted\" title=\"Downvoted\">\n" +
    "      <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"isCurrentController\" type=\"button\" data-ng-disabled=\"!playing.song.key\" class=\"btn btn-danger btn-lg\" aria-label=\"Skip Song\" data-ng-click=\"skipSong()\" title=\"Skip Song\">\n" +
    "      <span class=\"glyphicon glyphicon-step-forward\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"isController\" type=\"button\" class=\"btn btn-primary btn-lg\" aria-label=\"Stop Broadcasting\" data-ng-click=\"toggleBroadcast()\" title=\"Stop Broadcasting\">\n" +
    "      <span class=\"glyphicon glyphicon-headphones\" aria-hidden=\"true\"></span>\n" +
    "    </button>\n" +
    "    <button data-ng-show=\"!isController\" data-ng-disabled=\"!queue || queue.length === 0\" type=\"button\" class=\"btn btn-primary btn-lg\" aria-label=\"Start Broadcasting\" data-ng-click=\"toggleBroadcast()\" title=\"Start Broadcasting\">\n" +
    "      <span class=\"glyphicon glyphicon-cd\" aria-hidden=\"true\"></span>\n" +
    "    </button>\n" +
    "    <button data-ng-show=\"!playing.upvoted\" type=\"button\" data-ng-disabled=\"!playing.song.key || isCurrentController || playing.song.voted\" class=\"btn btn-success btn-lg\" aria-label=\"Upvote\" data-ng-click=\"upvote()\" title=\"Upvote\">\n" +
    "      <span class=\"glyphicon glyphicon-thumbs-up\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"playing.upvoted\" type=\"button\" disabled=\"disabled\" class=\"btn btn-success btn-lg\" aria-label=\"Upvoted\" title=\"Upvoted\">\n" +
    "      <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "\n" +
    "    <button data-ng-show=\"visualize\" data-ng-disabled=\"!playing.song.key\" type=\"button\" class=\"btn btn-default btn-lg\" aria-label=\"Show Visualizer\" data-ng-click=\"toggleVisualize()\" title=\"Show Visualizer\">\n" +
    "      <span class=\"glyphicon glyphicon-eye-close\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "    <button data-ng-show=\"!visualize\" data-ng-disabled=\"!playing.song.key\" type=\"button\" class=\"btn btn-default btn-lg\" aria-label=\"Hide Visualizer\" data-ng-click=\"toggleVisualize()\" title=\"Hide Visualizer\">\n" +
    "      <span class=\"glyphicon glyphicon-eye-open\" aria-hidden=\"true\"></span> \n" +
    "    </button>\n" +
    "   </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-list.html',
    "<div class=\"rooms__container\">\n" +
    "  <table class=\"table table-striped rooms\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th class=\"name\">Name</th>\n" +
    "        <th class=\"owner\">Owner</th>\n" +
    "        <th>Actions</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr data-ng-show=\"(!rooms || rooms.length === 0) && !showCreateRoom && !loading\" class=\"rooms__empty\">\n" +
    "        <td colspan=\"3\" class=\"text-center\">\n" +
    "          <h3>\n" +
    "            You don't have any rooms yet. <a data-ng-click=\"createRoom()\">Create one</a> now.\n" +
    "          </h3>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr data-ng-repeat=\"room in rooms\" data-ng-show=\"rooms && rooms.length > 0 && !loading\">\n" +
    "        <td data-ng-show=\"!room.editing\"><a data-ng-href=\"/room/{{ room.slug }}\" data-ng-bind=\"room.name\"></a></td>\n" +
    "        <td data-ng-show=\"room.editing\" class=\"form-inline\">\n" +
    "          <label for=\"room-name\" class=\"sr-only\">Room Name</label>\n" +
    "          <input type=\"text\" id=\"room-name\" data-ng-model=\"room.name\" class=\"form-control\" placeholder=\"Room Name\" />\n" +
    "        </td>\n" +
    "        <td data-ng-bind=\"room.owner.name\"></div>\n" +
    "        <td data-ng-show=\"!room.editing\">\n" +
    "          <button class=\"btn btn-default\" data-ng-click=\"editRoom($index)\">Edit</button>\n" +
    "          <button class=\"btn btn-default\" data-ng-click=\"deleteRoom($index)\">Delete</button>\n" +
    "        </td>\n" +
    "        <td data-ng-show=\"room.editing\">\n" +
    "          <button class=\"btn btn-primary\" data-ng-click=\"saveEditRoom($index)\">Save</button>\n" +
    "          <button class=\"btn btn-default\" data-ng-click=\"cancelEditRoom($index)\">Cancel</button>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr data-ng-show=\"showCreateRoom\">\n" +
    "        <td class=\"form-inline\">\n" +
    "          <label for=\"room-name\" class=\"sr-only\">Room Name</label>\n" +
    "          <input type=\"text\" id=\"room-name\" data-ng-model=\"newRoom.name\" class=\"form-control\" placeholder=\"Room Name\" />\n" +
    "        </td>\n" +
    "        <td></td>\n" +
    "        <td>\n" +
    "          <button class=\"btn btn-primary\" data-ng-click=\"saveCreateRoom()\">Create</button>\n" +
    "          <button class=\"btn btn-default\" data-ng-click=\"cancelCreateRoom()\">Cancel</button>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-music.html',
    "<div class=\"music__container room__container\">\n" +
    "  <lstn-music-search></lstn-music-search>\n" +
    "  <lstn-music-categories></lstn-music-categories\">\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-playing.html',
    "<div class=\"playing__container room__container\">\n" +
    "  <div class=\"row\">\n" +
    "    <lstn-playing-image></lstn-playing-image>\n" +
    "    <lstn-playing-info></lstn-playing-info>\n" +
    "    <lstn-visualizer data-ng-show=\"visualize && playing.song\"></lstn-visualizer>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <lstn-room-controls></lstn-room-controls>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <lstn-room-queue></lstn-room-queue>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-queue.html',
    "<div class=\"playing__queue col-md-12\">\n" +
    "  <div class=\"playing__queue__container panel panel-success\">\n" +
    "    <tabset class=\"queue__tabs\">\n" +
    "      <tab heading=\"Your Queue\">\n" +
    "        <ul id=\"queue\" class=\"queue queue--full track__list\" data-ng-show=\"queue && queue.length > 0\" data-ui-sortable=\"sortableOptions\" ng-model=\"queue\">\n" +
    "          <lstn-track \n" +
    "            data-ng-class-even=\"'track--even'\" \n" +
    "            data-ng-class-odd=\"'track--odd'\" \n" +
    "            data-ng-repeat=\"song in queue\" \n" +
    "            data-context=\"queue\"\n" +
    "            data-cutoff=\"50\"></lstn-track>\n" +
    "        </ul>\n" +
    "        <div class=\"queue--empty alert alert-info text-center\" data-ng-show=\"!queue || queue.length === 0\">\n" +
    "          <h3>Select songs from your playlists on the left to add songs to your queue</h3>\n" +
    "        </div>\n" +
    "      </tab>\n" +
    "      <tab heading=\"Room Queue\">\n" +
    "        <ul id=\"room-queue\" class=\"queue queue--full track__list\" data-ng-show=\"roomQueue && roomQueue.length > 0\">\n" +
    "          <lstn-track \n" +
    "            data-ng-class-even=\"'track--even'\" \n" +
    "            data-ng-class-odd=\"'track--odd'\" \n" +
    "            data-ng-repeat=\"song in roomQueue\" \n" +
    "            data-context=\"queue\"\n" +
    "            data-cutoff=\"50\"></lstn-track>\n" +
    "        </ul>\n" +
    "        <div class=\"queue--empty alert alert-info text-center\" data-ng-show=\"!roomQueue || roomQueue.length === 0\">\n" +
    "          <h3>See the upcoming songs from each broadcaster</h3>\n" +
    "        </div>\n" +
    "      </tab>\n" +
    "      <tab heading=\"Chat\">\n" +
    "        <ul id=\"messages\" class=\"messages list-group\">\n" +
    "          <li class=\"list-group-item\" data-ng-repeat=\"message in chat.messages\" data-ng-class=\"{'list-group-item-info': message.sender === current_user.id, 'list-group-item-warning': message.type === 'system', 'list-group-item-success': message.type === 'upvote', 'list-group-item-danger': message.type === 'downvote'}\">\n" +
    "            <div class=\"chat__user\" data-ng-bind=\"message.user\"></div>\n" +
    "            <div class=\"chat__message\" data-ng-bind=\"message.text\"></div>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "        <input class=\"form-control\" type=\"text\" data-ng-model=\"message.text\" data-lstn-enter=\"sendMessage()\" placeholder=\"Send message...\"></input>\n" +
    "      </tab>\n" +
    "    </tabset>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-roster.html',
    "<div class=\"roster__container room__container\">\n" +
    "  <div class=\"panel panel-primary\">\n" +
    "    <div class=\"panel-heading\">Broadcasters</div>\n" +
    "    <ul class=\"roster roster--controllers list-group\">\n" +
    "      <li class=\"list-group-item\" data-ng-show=\"!roster || roster.controllersCount === 0\">\n" +
    "        <div class=\"text-center\"><strong>No Broadcasters</strong></div>\n" +
    "      </li>\n" +
    "      <li data-ng-show=\"roster && roster.controllersCount > 0\" data-ng-repeat=\"user_id in roster.controllerOrder\" class=\"list-group-item\" data-ng-class=\"{'list-group-item-success': current_user.id === user_id}\">\n" +
    "        <span class=\"badge\" data-ng-bind=\"roster.controllers[user_id].points\" data-ng-show=\"user_id !== currentController\"></span>\n" +
    "        <a data-ng-href=\"http://www.rdio.com{{ roster.controllers[user_id].profile }}\" data-ng-bind=\"roster.controllers[user_id].name\" target=\"_blank\"></a>\n" +
    "        <span class=\"glyphicon glyphicon-music pull-right\" aria-hidden=\"true\" data-ng-show=\"user_id === currentController\"></span>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">Listeners</div>\n" +
    "    <ul class=\"roster list-group\">\n" +
    "      <li class=\"list-group-item\" data-ng-show=\"!roster || roster.usersCount === 0\">\n" +
    "        <div class=\"text-center\"><strong>No Listeners</strong></div>\n" +
    "      </li>\n" +
    "      <li data-ng-show=\"roster && roster.usersCount > 0\" data-ng-repeat=\"(user_id, user) in roster.users | orderBy:name\" class=\"list-group-item\" data-ng-class=\"{'list-group-item-success': current_user.id === user.id}\">\n" +
    "        <span class=\"badge\" data-ng-bind=\"user.points\"></span>\n" +
    "        <a data-ng-href=\"http://www.rdio.com{{ user.profile }}\" data-ng-bind=\"user.name\" target=\"_blank\"></a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/track-list.html',
    "<ul class=\"track__list\">\n" +
    "  <lstn-track data-ng-class-even=\"'track--even'\" data-ng-class-odd=\"'track--odd'\" data-ng-repeat=\"song in tracks\" data-cutoff=\"cutoff\"></lstn-track>\n" +
    "</ul>\n"
  );


  $templateCache.put('/static/partials/directives/track.html',
    "<li id=\"track-{{ $id }}-{{ $index }}-{{ song.key }}\" class=\"track\">\n" +
    "  <div class=\"track__image\">\n" +
    "    <img data-ng-src=\"{{ song.icon }}\" alt=\"{{ song.album }}\" title=\"{{ song.album }}\">\n" +
    "    <div class=\"overlay\"></div>\n" +
    "    <i data-ng-hide=\"song.in_queue || queueBitset[song.key]\" class=\"glyphicon glyphicon-plus-sign\" data-ng-click=\"addSongToQueue(song.key)\"></i>\n" +
    "    <i data-ng-show=\"(song.in_queue || queueBitset[song.key]) && context === 'queue'\" \n" +
    "      class=\"glyphicon glyphicon-minus-sign\" data-ng-click=\"removeSongFromQueue(song.key, $index)\"></i>\n" +
    "    <i data-ng-show=\"queueBitset[song.key] && context === 'playlist'\" \n" +
    "      class=\"glyphicon glyphicon-ok\" title=\"This song is already in your queue.\"></i>\n" +
    "  </div>\n" +
    "  <div class=\"track__info\">\n" +
    "    <div class=\"track__title\" data-ng-class=\"{'text-muted': context === 'playlist' && queueBitset[song.key]}\" \n" +
    "      title=\"{{ song.name }}\" data-ng-bind=\"song.name | truncate:cutoff\"></div>\n" +
    "    <div class=\"track__artist\" data-ng-class=\"{'text-muted': context === 'playlist' && queueBitset[song.key]}\"\n" +
    "      data-ng-bind=\"song.artist | truncate:cutoff\" title=\"{{ song.artist }}\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"clear\"></div>\n" +
    "</li>\n"
  );


  $templateCache.put('/static/partials/directives/visualizer.html',
    "<div class=\"playing__visualization col-md-7 text-center\">\n" +
    "  <div ng-repeat=\"i in getNumber(bands) track by $index\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/index.html',
    "<div>\n" +
    "  <div class=\"hero jumbotron\">\n" +
    "    <div class=\"container\">\n" +
    "      <h1><span class=\"lstn\">Lstn</span> to <span class=\"rdio\">Rdio</span> with Friends</h1>\n" +
    "      <p>Create a room and start listening to Rdio with your friends.</p>\n" +
    "      <p>\n" +
    "        <a data-ng-show=\"!current_user.id\" class=\"btn btn-primary btn-lg\" href=\"/login\" role=\"button\" target=\"_self\">Get Started</a>\n" +
    "        <a data-ng-show=\"current_user.id\" class=\"btn btn-primary btn-lg\" href=\"/rooms\" role=\"button\">Get Started</a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"front__info__container container\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"front__info col-xs-4\">\n" +
    "        <div><i class=\"glyphicon glyphicon-headphones\"></i></div>\n" +
    "        <h4>Simple to get started</h4>\n" +
    "        <p>Login with your Rdio account and create a room to start listening</p>\n" +
    "      </div>\n" +
    "      <div class=\"front__info col-xs-4\">\n" +
    "        <div><i class=\"glyphicon glyphicon-list\"></i></div>\n" +
    "        <h4>Sharing is caring</h4>\n" +
    "        <p>Share your favorite music by using your playlists, collections, and stations from Rdio</p>\n" +
    "      </div>\n" +
    "      <div class=\"front__info col-xs-4\">\n" +
    "        <div><i class=\"glyphicon glyphicon-transfer\"></i></div>\n" +
    "        <h4>Stay in sync</h4>\n" +
    "        <p>Music playback is synced between room members so you can listen and discover music together</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/room.html',
    "<div>\n" +
    "  <div class=\"page-header\">\n" +
    "    <h1>\n" +
    "      {{ room.name }}\n" +
    "      <div data-ng-show=\"playingSomewhereElse\" class=\"pull-right alert alert-danger alert-dismissable\" role=\"alert\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\" data-ng-click=\"playingSomewhereElse = 0\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        You appear to be playing music from a different source. Rdio only allows one source to play music at a time.\n" +
    "      </div>\n" +
    "      <div data-ng-show=\"remaining && !playingSomethingElse && !hideRemaining\" class=\"pull-right alert alert-info alert-dismissable\" role=\"alert\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\" data-ng-click=\"hideRemaining = 1\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        You have <strong data-ng-bind=\"remaining\"></strong> remaining songs left on your free account.\n" +
    "      </div>\n" +
    "    </h1>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"room row\">\n" +
    "    <div class=\"room__left col-md-3\">\n" +
    "      <div class=\"column__header\">Room Users</div>\n" +
    "      <lstn-room-roster></lstn-room-roster>\n" +
    "    </div>\n" +
    "    <div class=\"room__middle col-md-6\">\n" +
    "      <lstn-room-playing></lstn-room-playing>\n" +
    "    </div>\n" +
    "    <div class=\"room__right col-md-3\">\n" +
    "      <div class=\"column__header\">Music</div>\n" +
    "      <lstn-room-music></lstn-room-music>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/rooms.html',
    "<div class=\"page-header\">\n" +
    "  <h1>\n" +
    "    Your Rooms\n" +
    "    <button class=\"btn btn-success pull-right\" data-ng-click=\"createRoom()\">Create Room</button>\n" +
    "  </h1>\n" +
    " </div>\n" +
    "<lstn-room-list></lstn-room-list>\n"
  );

}]);

angular.module('lstn.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/static/partials/directives/album.html',
    "<div id=\"album-{{ $id }}-{{ index }}-{{ album.key }}\" class=\"drilldown__item album clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ album.icon }}\" alt=\"{{ album.album }}\" title=\"{{ album.album }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      title=\"{{ album.name }}\"\n" +
    "      data-ng-bind=\"album.name\"></div>\n" +
    "    <div\n" +
    "      class=\"item__artist\"\n" +
    "      title=\"{{ album.artist }}\"\n" +
    "      data-ng-bind=\"album.artist\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!album.loadingTracks\"\n" +
    "      data-ng-click=\"loadAlbumTracks(album)\"\n" +
    "      title=\"View Tracks\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"album.loadingTracks\"\n" +
    "      title=\"Loading Tracks\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/artist.html',
    "<div id=\"artist-{{ $id }}-{{ index }}-{{ artist.key }}\" class=\"drilldown__item artist clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ artist.icon }}\" alt=\"{{ artist.artist }}\" title=\"{{ artist.artist }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      title=\"{{ artist.name }}\"\n" +
    "      data-ng-bind=\"artist.name\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!artist.loadingAlbums\"\n" +
    "      data-ng-click=\"loadAlbums(artist)\"\n" +
    "      title=\"View Albums\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"artist.loadingAlbums\"\n" +
    "      title=\"Loading Albums\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/category.html',
    "<div id=\"category{{ $id }}\" class=\"drilldown__item category clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <i class=\"fa fa-fw fa-music fa-3x\"></i>\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      title=\"{{ category.name }}\"\n" +
    "      data-ng-bind=\"category.name\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!category.loadingLists\"\n" +
    "      data-ng-click=\"loadLists(category)\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"category.loadingLists\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/chat-message.html',
    "<li>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"chat__message__photo col-xs-3\">\n" +
    "      <img data-ng-src=\"{{ message.picture }}\" class=\"avatar sm\" src=\"http://rdio3img-a.akamaihd.net/user/no-user-image-square.jpg\" />\n" +
    "    </div>\n" +
    "    <div class=\"chat__message__body col-xs-7\">\n" +
    "      <div class=\"chat__message__headline row\">\n" +
    "        <span class=\"chat__message__user\" data-ng-bind=\"message.user\"></span>\n" +
    "        <span data-ng-switch=\"message.type\">\n" +
    "          <span class=\"chat__message--playing\" data-ng-switch-when=\"playing\">started playing</span>\n" +
    "          <span class=\"chat__message--upvoted\" data-ng-switch-when=\"upvote\">upvoted</span>\n" +
    "          <span class=\"chat__message--downvoted\" data-ng-switch-when=\"downvote\">downvoted</span>\n" +
    "          <span class=\"chat__message--skipped\" data-ng-switch-when=\"skipped\">skipped</span>\n" +
    "          <span class=\"chat__message--said\" data-ng-switch-when=\"message\">said</span>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"chat__message__message row\" data-ng-if=\"message.type === 'message'\">\n" +
    "        <div class=\"wordwrap\" data-ng-bind-html=\"message.text|twemoji\"></div>\n" +
    "      </div>\n" +
    "      <div class=\"chat__message__track-info row\" data-ng-if=\"message.type !== 'message'\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-xs-12\" data-ng-bind=\"message.track\"></div>\n" +
    "          </div>\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-xs-12\" data-ng-bind=\"message.artist\"></div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"chat__message__timestamp col-xs-2\">\n" +
    "      <div class=\"chat__timestamp text-muted\" data-time-from-now=\"message.created\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</li>\n"
  );


  $templateCache.put('/static/partials/directives/emoticon-list.html',
    "<ul class=\"list-group emoticon-list\">\n" +
    "  <li data-mentio-menu-item=\"emoticon\" data-ng-repeat=\"emoticon in items\" class=\"list-group-item\">\n" +
    "    <span tooltip-placement=\"bottom\" tooltip=\"{{ emoticon.text }}\" data-ng-bind-html=\"emoticon.value|twemoji\"></span>\n" +
    "  </li>\n" +
    "</ul>\n"
  );


  $templateCache.put('/static/partials/directives/more-music.html',
    "<div class=\"more-music\">\n" +
    "  <lstn-music-search></lstn-music-search>\n" +
    "  <lstn-music-categories data-ng-show=\"!searchResults || searchResults.length === 0\"></lstn-music-categories>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/music-categories.html',
    "<div class=\"playlist__container\">\n" +
    "  <carousel id=\"category-carousel\" interval=\"false\">\n" +
    "    <slide>\n" +
    "      <ul class=\"categories categories--full category__list drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in categories\">\n" +
    "          <lstn-category\n" +
    "            data-category=\"item\"\n" +
    "            data-load-lists=\"loadLists\"></lstn-category>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "    <slide>\n" +
    "      <div class=\"carousel__back text-left\">\n" +
    "        <a data-ng-click=\"closeCategory()\">\n" +
    "          <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"currentCategory.name\"></span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "      <ul class=\"playlists drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in playlists\">\n" +
    "          <lstn-playlist\n" +
    "            data-context=\"'category'\"\n" +
    "            data-playlist=\"item\"\n" +
    "            data-index=\"$index\"\n" +
    "            data-load-playlist-tracks=\"loadPlaylistTracks\"></lstn-playlist>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "    <slide>\n" +
    "      <div class=\"carousel__back text-left\">\n" +
    "        <a data-ng-click=\"closePlaylist()\">\n" +
    "          <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"currentPlaylist.name\"></span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "      <ul class=\"tracks drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in tracks\">\n" +
    "          <lstn-track\n" +
    "            data-context=\"'playlist'\"\n" +
    "            data-track=\"item\"\n" +
    "            data-index=\"$index\"></lstn-track>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "  </carousel>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/music-search.html',
    "<div>\n" +
    "  <div>\n" +
    "    <input type=\"search\" class=\"search__box form-control\" data-ng-model=\"searchQuery\" placeholder=\"Search music...\">\n" +
    "  </div>\n" +
    "  <div class=\"search__container\" data-ng-show=\"searchResults && searchResults.length > 0\">\n" +
    "    <div class=\"search__contents\">\n" +
    "      <carousel id=\"search-carousel\" interval=\"false\">\n" +
    "        <slide>\n" +
    "          <div class=\"carousel__back text-left\">\n" +
    "            <a data-ng-click=\"clearSearchResults()\">\n" +
    "              <i class=\"fa fa-fw fa-times-circle-o\"></i> Clear Search Results\n" +
    "            </a>\n" +
    "          </div>\n" +
    "          <ul class=\"search search--full track__list drilldown__list text-left\">\n" +
    "            <li data-ng-repeat=\"item in searchResults\">\n" +
    "              <div data-ng-switch=\"item.type\">\n" +
    "                <lstn-album\n" +
    "                  data-ng-switch-when=\"a\"\n" +
    "                  data-context=\"'search'\"\n" +
    "                  data-album=\"item\"\n" +
    "                  data-index=\"$index\"\n" +
    "                  data-load-album-tracks=\"loadAlbumTracks\"></lstn-album>\n" +
    "\n" +
    "                <lstn-artist\n" +
    "                  data-ng-switch-when=\"r\"\n" +
    "                  data-context=\"'search'\"\n" +
    "                  data-artist=\"item\"\n" +
    "                  data-index=\"$index\"\n" +
    "                  data-load-albums=\"loadAlbums\"></lstn-artist>\n" +
    "\n" +
    "                <lstn-track\n" +
    "                  data-ng-switch-when=\"t\"\n" +
    "                  data-context=\"'search'\"\n" +
    "                  data-track=\"item\"\n" +
    "                  data-index=\"$index\"></lstn-track>\n" +
    "              </div>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </slide>\n" +
    "        <slide>\n" +
    "          <div class=\"carousel__back text-left\">\n" +
    "            <a data-ng-click=\"closeArtist()\">\n" +
    "              <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"currentArtist.name\"></span>\n" +
    "            </a>\n" +
    "          </div>\n" +
    "          <ul class=\"albums album--full album__list drilldown__list text-left\">\n" +
    "            <li data-ng-repeat=\"item in albums\">\n" +
    "              <lstn-album\n" +
    "                data-context=\"'artist'\"\n" +
    "                data-album=\"item\"\n" +
    "                data-index=\"$index\"\n" +
    "                data-load-album-tracks=\"loadAlbumTracks\"></lstn-album>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </slide>\n" +
    "        <slide>\n" +
    "          <div class=\"carousel__back text-left\">\n" +
    "            <a data-ng-click=\"closeAlbum()\">\n" +
    "              <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"currentAlbum.name\"></span>\n" +
    "            </a>\n" +
    "          </div>\n" +
    "          <ul class=\"tracks track--full track__list drilldown__list text-left\">\n" +
    "            <li data-ng-repeat=\"item in tracks\">\n" +
    "              <lstn-track\n" +
    "                data-context=\"'album'\"\n" +
    "                data-track=\"item\"\n" +
    "                data-index=\"$index\"></lstn-track>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </slide>\n" +
    "      </carousel>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playing-image.html',
    "<div class=\"playing__art\" class=\"text-center\">\n" +
    "  <img data-ng-show=\"playing.track.image\" data-ng-src=\"{{ playing.track.image }}\" alt=\"{{ playing.track.title }} - {{ playing.track.artist }}\">\n" +
    "  <div data-ng-show=\"!playing.track.image\" class=\"text-center\">\n" +
    "    <i class=\"glyphicon glyphicon-music playing__placeholder text-muted\"></i>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playing-info.html',
    "<div class=\"playing__info-container\">\n" +
    "  \n" +
    "  <div data-ng-hide=\"playing\" class=\"playing__info--stopped\">\n" +
    "    <a data-ng-show=\"queue.length\" href=\"\" data-ng-click=\"toggleBroadcast()\">\n" +
    "      <i class=\"fa fa-play-circle\" />\n" +
    "    </a>\n" +
    "    <p data-ng-show=\"!queue.length\">Waiting for a broadcaster&hellip;</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div data-ng-show=\"playing\" class=\"playing__info playing__info--playing\" data-album-cover-background>\n" +
    "    <div class=\"playing__meta\">\n" +
    "      <h3 class=\"playing__title\" data-ng-bind=\"playing.track.title | truncate:28\"></h3>\n" +
    "      <h4 class=\"playing__artist\" data-ng-bind=\"playing.track.artist | truncate:35\"></h4>\n" +
    "    </div>\n" +
    "    <lstn-room-controls></lstn-room-controls>\n" +
    "  </div>\n" +
    "  <!-- TOOD: why is there a gap here? (fixed by negative top margin). -->\n" +
    "  <div style=\"margin-top:-10px\" class=\"progress\" data-ng-show=\"playing.track.duration && playing.track.canStream\">\n" +
    "    <div id=\"progress\" class=\"progress-bar progress-bar-info progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"{{ playing.track.duration }}\"></div>\n" +
    "    <span id=\"time\" class=\"time\"></span>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playlist.html',
    "<div id=\"playlist{{ $id }}\" class=\"drilldown__item playlist clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ playlist.icon }}\" alt=\"{{ playlist.name }}\" title=\"{{ playlist.name }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      title=\"{{ playlist.name }}\"\n" +
    "      data-ng-bind=\"playlist.name\"></div>\n" +
    "    <div\n" +
    "      class=\"item__length\">{{ playlist.length }} items</div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!playlist.loadingTracks\"\n" +
    "      data-ng-click=\"loadPlaylistTracks(playlist)\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"playlist.loadingTracks\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-activity.html',
    "<div class=\"room-activity\">\n" +
    "  <ul id=\"messages\" class=\"messages list-group\">\n" +
    "    <lstn-chat-message\n" +
    "      class=\"list-group-item chat__message\"\n" +
    "      data-ng-repeat=\"message in chat.messages\"></lstn-chat-message>\n" +
    "  </ul>\n" +
    "  <input data-mentio data-mentio-id=\"'chat-input'\" ng-trim=\"false\" class=\"form-control\" type=\"text\" data-ng-model=\"message.text\" data-lstn-enter=\"sendMessage()\" placeholder=\"Send message...\"></input>\n" +
    "  <mentio-menu\n" +
    "    id=\"mention-menu\"\n" +
    "    mentio-for=\"'chat-input'\"\n" +
    "    mentio-trigger-char=\"'@'\"\n" +
    "    mentio-items=\"mentionNames\"\n" +
    "    mentio-template-url=\"/static/partials/directives/roster-mention.html\"\n" +
    "    mentio-search=\"searchRoster(term)\"\n" +
    "    mentio-select=\"getUser(item)\"></mentio-menu>\n" +
    "\n" +
    "  <mentio-menu\n" +
    "    id=\"emoticon-menu\"\n" +
    "    class=\"emoticon-menu\"\n" +
    "    mentio-for=\"'chat-input'\"\n" +
    "    mentio-trigger-char=\"':'\"\n" +
    "    mentio-items=\"emoticons\"\n" +
    "    mentio-template-url=\"/static/partials/directives/emoticon-list.html\"\n" +
    "    mentio-search=\"searchEmoticons(term)\"\n" +
    "    mentio-select=\"getEmoticon(item)\"></mentio-menu>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-downvote.html',
    "<span>\n" +
    "  <button data-ng-show=\"!playing.downvoted && !isCurrentController\" type=\"button\" data-ng-disabled=\"!playing.track.key || playing.track.voted\" class=\"control__button btn btn-danger btn-lg\" aria-label=\"Downvote\" data-ng-click=\"downvote()\" title=\"Downvote\">\n" +
    "    <i class=\"fa fa-thumbs-down\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button data-ng-show=\"playing.downvoted\" type=\"button\" disabled=\"disabled\" class=\"control__button btn btn-danger btn-lg\" aria-label=\"Downvoted\" title=\"Downvoted\">\n" +
    "    <i class=\"fa fa-check\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-skip.html',
    "<span>\n" +
    "  <button data-ng-show=\"isCurrentController\" type=\"button\" data-ng-disabled=\"!playing.track.key\" class=\"control__button btn btn-danger btn-lg\" aria-label=\"Skip Song\" data-ng-click=\"skipSong()\" title=\"Skip Song\">\n" +
    "    <span class=\"fa fa-step-forward\" aria-hidden=\"true\"></span>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-upvote.html',
    "<span>\n" +
    "  <button type=\"button\" data-ng-hide=\"playing.upvoted || isCurrentController\" data-ng-disabled=\"!playing.track.key || isCurrentController || playing.track.voted\" class=\"control__button btn btn-success btn-lg\" aria-label=\"Upvote\" data-ng-click=\"upvote()\" title=\"Upvote\">\n" +
    "    <i class=\"fa fa-thumbs-up\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button data-ng-show=\"playing.upvoted\" type=\"button\" disabled=\"disabled\" class=\"control__button btn btn-success btn-lg\" aria-label=\"Upvoted\" title=\"Upvoted\">\n" +
    "    <i class=\"fa fa-check\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-volume.html',
    "<span>\n" +
    "  <button data-ng-show=\"!mute\" data-ng-disabled=\"!playing.track.key\" type=\"button\" class=\"control__button btn btn-default btn-lg\" aria-label=\"Mute\" data-ng-click=\"toggleMute()\" title=\"Mute\">\n" +
    "    <i class=\"fa fa-volume-off\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button data-ng-show=\"mute\" data-ng-disabled=\"!playing.track.key\" type=\"button\" class=\"control__button btn btn-default btn-lg\" aria-label=\"Unmute\" data-ng-click=\"toggleMute()\" title=\"Unmute\">\n" +
    "    <i class=\"fa fa-lg fa-volume-up\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-controls.html',
    "<div>\n" +
    "  <lstn-room-control-volume></lstn-room-control-volume>\n" +
    "  <lstn-room-control-downvote></lstn-room-control-downvote>\n" +
    "  <lstn-room-control-skip></lstn-room-control-skip>\n" +
    "  <lstn-room-control-upvote></lstn-room-control-upvote>\n" +
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


  $templateCache.put('/static/partials/directives/room-queue.html',
    "<div>\n" +
    "  <ul id=\"queue\" class=\"queue queue--full track__list drilldown__list\" data-ng-show=\"queue.tracks && queue.tracks.length > 0\" data-ui-sortable=\"sortableOptions\" ng-model=\"queue.tracks\">\n" +
    "    <li data-ng-repeat=\"track in queue.tracks\">\n" +
    "      <lstn-track\n" +
    "        data-track=\"track\"\n" +
    "        data-context=\"'queue'\"\n" +
    "        data-index=\"$index\"></lstn-track>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <div class=\"queue--empty text-center\" data-ng-show=\"!queue.tracks || queue.tracks.length === 0\">\n" +
    "    <p>My Queue</p>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-roster.html',
    "<div class=\"roster__container room__container\">\n" +
    "\n" +
    "  <div class=\"roster__category\">\n" +
    "    <div class=\"roster__category-label\">Broadcasters \n" +
    "      <a href=\"\" data-ng-click=\"toggleBroadcast();\">\n" +
    "        <i class=\"fa\" data-ng-class=\"{'fa-play-circle': !isController, 'fa-stop': isController }\"></i>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <ul class=\"roster roster--controllers\">\n" +
    "      <li class=\"empty\" data-ng-show=\"!roster || roster.controllersCount === 0\">\n" +
    "        No Broadcasters\n" +
    "      </li>\n" +
    "      <li data-ng-show=\"roster && roster.controllersCount > 0\" data-ng-repeat=\"user_id in roster.controllerOrder\">\n" +
    "        <a data-ng-href=\"http://www.rdio.com{{ roster.controllers[user_id].profile }}\" target=\"_blank\"\n" +
    "          tooltip=\"{{ roster.controllers[user_id].name }}\" data-tooltip-placement=\"bottom\">\n" +
    "          <img data-ng-src=\"{{ roster.controllers[user_id].picture }}\" class=\"avatar xs\"\n" +
    "            data-ng-class=\"{upvoted: playing.upvotes[user_id], downvoted: playing.downvotes[user_id]}\"\n" +
    "            alt=\"{{ roster.controllers[user_id].name }}\" />\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"roster__category\">\n" +
    "    <div class=\"roster__category-label\">Listeners</div>\n" +
    "    <ul class=\"roster roster--listeners\" data-ng-show=\"roster && roster.usersCount > 0\">\n" +
    "      <li class=\"empty\" data-ng-show=\"!roster || roster.users.length === 0\">\n" +
    "        No one is listening\n" +
    "      </li>\n" +
    "      <li data-ng-repeat=\"(user_id, user) in roster.users | orderBy:name\">\n" +
    "      <a class=\"roster__user\"\n" +
    "        data-ng-href=\"http://www.rdio.com{{ user.profile }}\"\n" +
    "        target=\"_blank\"\n" +
    "        tooltip=\"{{ user.name }}\" data-tooltip-placement=\"bottom\">\n" +
    "        <img data-ng-src=\"{{ user.picture }}\"\n" +
    "        data-ng-class=\"{upvoted: playing.upvotes[user_id], downvoted: playing.downvotes[user_id]}\"\n" +
    "        class=\"avatar xs\" alt=\"{{ user.name }}\" />\n" +
    "      </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/roster-mention.html',
    "<ul class=\"list-group user-search\">\n" +
    "  <li data-mentio-menu-item=\"person\" data-ng-repeat=\"person in items\" class=\"list-group-item\">\n" +
    "    <img data-ng-src=\"{{ person.picture }}\" class=\"user-photo\">\n" +
    "    <span class=\"text-primary\" data-ng-bind-html=\"person.name | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></span>\n" +
    "  </li>\n" +
    "</ul>\n"
  );


  $templateCache.put('/static/partials/directives/track.html',
    "<div id=\"track-{{ $id }}-{{ index }}-{{ track.key }}\" class=\"drilldown__item track clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ track.icon }}\" alt=\"{{ track.album }}\" title=\"{{ track.album }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      data-ng-class=\"{'text-muted': context !== 'queue' && queue.bitset[track.key]}\"\n" +
    "      title=\"{{ track.name }}\"\n" +
    "      data-ng-bind=\"track.name\"></div>\n" +
    "    <div\n" +
    "      class=\"item__artist\"\n" +
    "      data-ng-class=\"{'text-muted': context !== 'queue' && queue.bitset[track.key]}\"\n" +
    "      title=\"{{ track.artist }}\"\n" +
    "      data-ng-bind=\"track.artist\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-up\"\n" +
    "      data-ng-show=\"track.in_queue && context === 'queue'\"\n" +
    "      data-ng-click=\"queue.moveToTop(index)\"\n" +
    "      title=\"Move to Top of Queue\"></a>\n" +
    "    <i\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"track.addingToQueue || track.removingFromQueue\"></i>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-plus\"\n" +
    "      data-ng-hide=\"track.addingToQueue || track.in_queue || queue.bitset[track.key]\"\n" +
    "      data-ng-click=\"queue.addTrack(track)\"\n" +
    "      title=\"Add to Queue\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-minus\"\n" +
    "      data-ng-show=\"(track.in_queue || queue.bitset[track.key]) && context === 'queue' && !track.removingFromQueue\"\n" +
    "      data-ng-click=\"queue.removeTrack(track, index)\"\n" +
    "      title=\"Remove from Queue\"></a>\n" +
    "    <i\n" +
    "      class=\"fa fa-fw fa-check\"\n" +
    "      data-ng-show=\"(track.in_queue || queue.bitset[track.key]) && context !== 'queue'\"\n" +
    "      title=\"This track is already in your queue\"></i>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/visualizer.html',
    "<div class=\"playing__visualization text-center\">\n" +
    "  <div data-ng-repeat=\"i in getNumber(bands) track by $index\"></div>\n" +
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
    "<div class=\"room row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <lstn-playing-info></lstn-playing-info>\n" +
    "    <lstn-room-roster></lstn-room-roster>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-5\">\n" +
    "    <tabset class=\"queue__tabs\">\n" +
    "      <tab id=\"my-queue-tab\" data-select=\"selectQueueTab('queue')\">\n" +
    "        <tab-heading>MY QUEUE</tab-heading>\n" +
    "        <lstn-room-queue></lstn-room-queue>\n" +
    "      </tab>\n" +
    "      <tab>\n" +
    "        <tab-heading>MORE MUSIC</tab-heading>\n" +
    "        <lstn-more-music></lstn-more-music>\n" +
    "        </tab-heading>\n" +
    "      </tab>\n" +
    "    </tabset>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-4\">\n" +
    "    <lstn-room-activity></lstn-room-activity>\n" +
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

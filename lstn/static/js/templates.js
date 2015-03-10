angular.module('lstn.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/static/partials/directives/album.html',
    "<div id=\"album-{{ $id }}-{{ index }}-{{ album.key }}\" class=\"drilldown__item album clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ album.icon }}\" alt=\"{{ album.album }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      data-ng-bind=\"album.name\"></div>\n" +
    "    <div\n" +
    "      class=\"item__artist\"\n" +
    "      data-ng-bind=\"album.artist\"></div>\n" +
    "    <div class=\"item__count\" data-ng-pluralize count=\"album.length\" when=\"{'one': '{} track', 'other': '{} tracks'}\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!album.loadingTracks\"\n" +
    "      data-ng-click=\"loadAlbumTracks(album)\"\n" +
    "      data-tooltip=\"Load Tracks\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"album.loadingTracks\"\n" +
    "      data-tooltip=\"Loading Tracks\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/artist.html',
    "<div id=\"artist-{{ $id }}-{{ index }}-{{ artist.key }}\" class=\"drilldown__item artist clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ artist.icon }}\" alt=\"{{ artist.artist }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      data-ng-bind=\"artist.name\"></div>\n" +
    "    <div class=\"item__count\" data-ng-pluralize count=\"artist.albumCount\" when=\"{'one': '{} album', 'other': '{} albums'}\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!artist.loadingAlbums\"\n" +
    "      data-ng-click=\"loadAlbums(artist)\"\n" +
    "      data-tooltip=\"Load Albums\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"artist.loadingAlbums\"\n" +
    "      data-tooltip=\"Loading Albums\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/category.html',
    "<div id=\"category{{ $id }}\" class=\"drilldown__item category\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <i class=\"fa fa-fw fa-music fa-3x\"></i>\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title item__title--single\"\n" +
    "      data-ng-bind=\"category.name\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!category.loading\"\n" +
    "      data-ng-click=\"loadChildren(category)\"\n" +
    "      data-tooltip=\"Load\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"category.loading\"\n" +
    "      data-tooltip=\"Loading\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/chat-message.html',
    "<div id=\"message-{{ $id }}-{{ index }}-{{ message.user }}\" class=\"chat__message\">\n" +
    "  <div class=\"chat__image item__image\">\n" +
    "    <img data-ng-src=\"{{ message.user.picture }}\" src=\"http://rdio3img-a.akamaihd.net/user/no-user-image-square.jpg\" />\n" +
    "  </div>\n" +
    "  <div class=\"chat__user-info item__info\">\n" +
    "    <div class=\"item__title\">\n" +
    "      <span class=\"chat__message__user\" data-ng-bind=\"message.user.name\"></span>&nbsp;\n" +
    "      <span data-ng-switch=\"message.type\" class=\"chat__message__message-type\">\n" +
    "        <span class=\"chat__message--playing\" data-ng-switch-when=\"playing\">started playing</span>\n" +
    "        <span class=\"chat__message--upvoted\" data-ng-switch-when=\"upvote\">upvoted</span>\n" +
    "        <span class=\"chat__message--downvoted\" data-ng-switch-when=\"downvote\">downvoted</span>\n" +
    "        <span class=\"chat__message--skipped\" data-ng-switch-when=\"skipped\">skipped</span>\n" +
    "        <span class=\"chat__message--skipped\" data-ng-switch-when=\"skipped:downvoted\">skipped (downvoted)</span>\n" +
    "        <span class=\"chat__message--said\" data-ng-switch-when=\"message\">said</span>\n" +
    "      </span>\n" +
    "      <div class=\"chat__timestamp text-muted\" data-time-from-now=\"message.created\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"chat__message__message\" data-ng-if=\"message.type === 'message'\">\n" +
    "      <div class=\"wordwrap\" data-ng-bind-html=\"message.text|linkify|twemoji\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"chat__track-info text-muted\" data-ng-if=\"message.type !== 'message'\">\n" +
    "      <div class=\"chat__track text-truncate\">\n" +
    "        <a data-ng-href=\"http://rdio.com{{ message.track.url }}\" data-ng-bind=\"message.track.name\" target=\"_blank\"></a>\n" +
    "      </div>\n" +
    "      <div class=\"chat__artist text-truncate\">\n" +
    "        <a data-ng-href=\"http://rdio.com{{ message.track.artistUrl }}\" data-ng-bind=\"message.track.artist\" target=\"_blank\"></a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/drilldown-back.html',
    "<div class=\"carousel__back text-left\">\n" +
    "  <a data-ng-click=\"clickHandler()\">\n" +
    "    <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"text\" data-tooltip=\"{{ tooltipText }}\" data-tooltip-placement=\"right\"></span>\n" +
    "  </a>\n" +
    "  <a class=\"carousel__refresh pull-right\" data-ng-click=\"refreshHandler()\" data-ng-show=\"refreshHandler\">\n" +
    "    <i\n" +
    "      class=\"fa fa-fw fa-refresh\"\n" +
    "      data-ng-show=\"!loading\"\n" +
    "      data-tooltip=\"{{ refreshText }}\"\n" +
    "      data-tooltip-placement=\"left\"></i>\n" +
    "    <i\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"loading\"\n" +
    "      data-tooltip=\"{{ loadingText }}\"\n" +
    "      data-tooltip-placement=\"left\"></i>\n" +
    "  </a>\n" +
    "</div>\n"
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
    "  <div class=\"search__box\">\n" +
    "    <input type=\"search\" class=\"form-control\" data-ng-model=\"searchQuery\" placeholder=\"Search music...\">\n" +
    "  </div>\n" +
    "  <lstn-music-search></lstn-music-search>\n" +
    "  <lstn-music-categories data-ng-show=\"!searchResults || searchResults.length === 0\"></lstn-music-categories>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/music-categories.html',
    "<div class=\"playlist__container\">\n" +
    "  <carousel id=\"category-carousel\" interval=\"false\">\n" +
    "    <slide id=\"categories\">\n" +
    "      <ul class=\"categories categories--full category__list drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in categories\">\n" +
    "          <lstn-category\n" +
    "            data-category=\"item\"\n" +
    "            data-load-children=\"loadChildren\"></lstn-category>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "\n" +
    "    <slide id=\"playlist_types\">\n" +
    "      <lstn-drilldown-back\n" +
    "        data-text=\"currentCategory.name\"\n" +
    "        data-tooltip-text=\"'Back to Categories'\"\n" +
    "        data-click-handler=\"closeCategory\"></lstn-drilldown-back>\n" +
    "      <ul class=\"playlist-types playlist-types--full playlist-type__list drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in playlistTypes\">\n" +
    "          <lstn-playlist-type\n" +
    "            data-playlist-type=\"item\"\n" +
    "            data-load-playlists=\"loadPlaylists\"></lstn-playlist-type>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "\n" +
    "    <slide id=\"playlists\">\n" +
    "      <lstn-drilldown-back\n" +
    "        data-text=\"currentPlaylistType.name\"\n" +
    "        data-tooltip-text=\"'Back to Playlist Types'\"\n" +
    "        data-click-handler=\"closePlaylistType\"\n" +
    "        data-refresh-handler=\"refreshPlaylistType\"\n" +
    "        data-refresh-text=\"'Refresh Playlists'\"\n" +
    "        data-loading=\"currentPlaylistType.loadingPlaylists\"\n" +
    "        data-loading-text=\"'Refreshing Playlists'\"></lstn-drilldown-back>\n" +
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
    "\n" +
    "    <slide id=\"playlist_tracks\">\n" +
    "      <lstn-drilldown-back\n" +
    "        data-text=\"currentPlaylist.name\"\n" +
    "        data-tooltip-text=\"'Back to Playlists'\"\n" +
    "        data-click-handler=\"closePlaylist\"\n" +
    "        data-refresh-handler=\"refreshPlaylist\"\n" +
    "        data-refresh-text=\"'Refresh Playlist'\"\n" +
    "        data-loading=\"currentPlaylist.loadingTracks\"\n" +
    "        data-loading-text=\"'Refreshing Playlist'\"></lstn-drilldown-back>\n" +
    "      <ul class=\"tracks drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in tracks\">\n" +
    "          <lstn-track\n" +
    "            data-context=\"'playlist'\"\n" +
    "            data-track=\"item\"\n" +
    "            data-index=\"$index\"></lstn-track>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "\n" +
    "    <slide id=\"station_types\">\n" +
    "      <lstn-drilldown-back\n" +
    "        data-text=\"currentCategory.name\"\n" +
    "        data-tooltip-text=\"'Back to Categories'\"\n" +
    "        data-click-handler=\"closeCategory\"></lstn-drilldown-back>\n" +
    "      <ul class=\"station-types station-types--full station-type__list drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in stationTypes\">\n" +
    "          <lstn-station-type\n" +
    "            data-station-type=\"item\"\n" +
    "            data-load-stations=\"loadStations\"></lstn-station-type>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "\n" +
    "    <slide id=\"stations\">\n" +
    "      <lstn-drilldown-back\n" +
    "        data-text=\"currentStationType.name\"\n" +
    "        data-tooltip-text=\"'Back to Station Types'\"\n" +
    "        data-click-handler=\"closeStationType\"\n" +
    "        data-refresh-handler=\"refreshStationType\"\n" +
    "        data-refresh-text=\"'Refresh Stations'\"\n" +
    "        data-loading=\"currentStationType.loadingStations\"\n" +
    "        data-loading-text=\"'Refreshing Stations'\"></lstn-drilldown-back>\n" +
    "      <ul class=\"stations drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in stations\">\n" +
    "          <lstn-playlist\n" +
    "            data-context=\"'category'\"\n" +
    "            data-playlist=\"item\"\n" +
    "            data-index=\"$index\"\n" +
    "            data-load-playlist-tracks=\"loadStationTracks\"></lstn-playlist>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "\n" +
    "    <slide id=\"station_tracks\">\n" +
    "      <lstn-drilldown-back\n" +
    "        data-text=\"currentStation.name\"\n" +
    "        data-tooltip-text=\"'Back to Stations'\"\n" +
    "        data-click-handler=\"closeStation\"\n" +
    "        data-refresh-handler=\"refreshStation\"\n" +
    "        data-refresh-text=\"'Refresh Station'\"\n" +
    "        data-loading=\"currentStation.loadingTracks\"\n" +
    "        data-loading-text=\"'Refreshing Station'\"></lstn-drilldown-back>\n" +
    "      <ul class=\"tracks drilldown__list text-left\">\n" +
    "        <li data-ng-repeat=\"item in tracks\">\n" +
    "          <lstn-track\n" +
    "            data-context=\"'station'\"\n" +
    "            data-track=\"item\"\n" +
    "            data-index=\"$index\"></lstn-track>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </slide>\n" +
    "  </carousel>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/music-search.html',
    "<div class=\"search__container\" data-ng-show=\"searchResults && searchResults.length > 0\">\n" +
    "  <div class=\"search__contents\">\n" +
    "    <carousel id=\"search-carousel\" interval=\"false\">\n" +
    "      <slide id=\"search_results\">\n" +
    "        <div class=\"carousel__back text-left\">\n" +
    "          <a data-ng-click=\"clearSearchResults()\">\n" +
    "            <i class=\"fa fa-fw fa-times-circle-o\"></i> Clear Search Results\n" +
    "          </a>\n" +
    "        </div>\n" +
    "        <ul class=\"search search--full track__list drilldown__list text-left\">\n" +
    "          <li data-ng-repeat=\"item in searchResults\">\n" +
    "            <div data-ng-switch=\"item.type\">\n" +
    "              <lstn-album\n" +
    "                data-ng-switch-when=\"a\"\n" +
    "                data-context=\"'search'\"\n" +
    "                data-album=\"item\"\n" +
    "                data-index=\"$index\"\n" +
    "                data-load-album-tracks=\"loadAlbumTracks\"></lstn-album>\n" +
    "\n" +
    "              <lstn-artist\n" +
    "                data-ng-switch-when=\"r\"\n" +
    "                data-context=\"'search'\"\n" +
    "                data-artist=\"item\"\n" +
    "                data-index=\"$index\"\n" +
    "                data-load-albums=\"loadAlbums\"></lstn-artist>\n" +
    "\n" +
    "              <lstn-track\n" +
    "                data-ng-switch-when=\"t\"\n" +
    "                data-context=\"'search'\"\n" +
    "                data-track=\"item\"\n" +
    "                data-index=\"$index\"></lstn-track>\n" +
    "            </div>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </slide>\n" +
    "\n" +
    "      <slide id=\"search_albums\">\n" +
    "        <div class=\"carousel__back text-left\">\n" +
    "          <a data-ng-click=\"closeArtist()\">\n" +
    "            <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"currentArtist.name\"></span>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "        <ul class=\"albums album--full album__list drilldown__list text-left\">\n" +
    "          <li data-ng-repeat=\"item in albums\">\n" +
    "            <lstn-album\n" +
    "              data-context=\"'artist'\"\n" +
    "              data-album=\"item\"\n" +
    "              data-index=\"$index\"\n" +
    "              data-load-album-tracks=\"loadAlbumTracks\"></lstn-album>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </slide>\n" +
    "\n" +
    "      <slide id=\"search_tracks\">\n" +
    "        <div class=\"carousel__back text-left\">\n" +
    "          <a data-ng-click=\"closeAlbum()\">\n" +
    "            <i class=\"fa fa-fw fa-chevron-left\"></i><span data-ng-bind=\"currentAlbum.name\"></span>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "        <ul class=\"tracks track--full track__list drilldown__list text-left\">\n" +
    "          <li data-ng-repeat=\"item in tracks\">\n" +
    "            <lstn-track\n" +
    "              data-context=\"'album'\"\n" +
    "              data-track=\"item\"\n" +
    "              data-index=\"$index\"></lstn-track>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </slide>\n" +
    "    </carousel>\n" +
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
    "\n" +
    "  <div data-ng-hide=\"playing\" class=\"playing__info--stopped\">\n" +
    "    <a data-ng-show=\"queue.tracks.length\" data-ng-click=\"toggleBroadcast()\">\n" +
    "      <i class=\"playing__info--ready fa fa-play-circle\" />\n" +
    "    </a>\n" +
    "    <p class=\"playing__info--waiting\" data-ng-show=\"!queue.tracks.length\">Waiting for a broadcaster&hellip;</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div data-ng-show=\"playing\" class=\"playing__info playing__info--playing\" data-album-cover-background>\n" +
    "    <div class=\"playing__meta\">\n" +
    "      <h3 class=\"playing__title text-truncate\" data-ng-bind=\"playing.track.title\"></h3>\n" +
    "      <h4 class=\"playing__artist text-truncate\" data-ng-bind=\"playing.track.artist\"></h4>\n" +
    "      <lstn-room-controls></lstn-room-controls>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"progress\" data-ng-show=\"playing.track.duration && playing.track.canStream\">\n" +
    "    <div id=\"progress\" class=\"progress-bar progress-bar-info progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"{{ playing.track.duration }}\"></div>\n" +
    "    <span id=\"time\" class=\"time\"></span>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playlist-type.html',
    "<div id=\"playlist-type{{ $id }}\" class=\"drilldown__item playlist-type\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <i class=\"fa fa-fw fa-music fa-3x\"></i>\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title item__title--single\"\n" +
    "      data-ng-bind=\"playlistType.name\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!playlistType.loadingPlaylists\"\n" +
    "      data-ng-click=\"loadPlaylists(playlistType)\"\n" +
    "      data-tooltip=\"Load Playlists\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"playlistType.loadingPlaylists\"\n" +
    "      data-tooltip=\"Loading Playlists\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/playlist.html',
    "<div id=\"playlist{{ $id }}\" class=\"drilldown__item playlist clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ playlist.icon }}\" alt=\"{{ playlist.name }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title item__title--couple\"\n" +
    "      data-ng-bind=\"playlist.name\"></div>\n" +
    "    <div class=\"item__count\" data-ng-pluralize count=\"playlist.length\" when=\"{'one': '{} track', 'other': '{} tracks'}\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!playlist.loadingTracks\"\n" +
    "      data-ng-click=\"loadPlaylistTracks(playlist)\"\n" +
    "      data-tooltip=\"Load Tracks\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"playlist.loadingTracks\"\n" +
    "      data-tooltip=\"Loading Tracks\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-activity.html',
    "<div class=\"room-activity\">\n" +
    "  <input\n" +
    "    id=\"chat-input\"\n" +
    "    data-mentio\n" +
    "    data-mentio-id=\"'chat-input'\"\n" +
    "    ng-trim=\"false\"\n" +
    "    class=\"form-control chat__input\"\n" +
    "    type=\"text\"\n" +
    "    data-ng-show=\"!chat.loading\"\n" +
    "    data-ng-model=\"message.text\"\n" +
    "    data-lstn-enter=\"sendMessage()\"\n" +
    "    placeholder=\"Send message...\"></input>\n" +
    "\n" +
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
    "\n" +
    "  <ul id=\"messages\" class=\"messages list-group\" data-ng-show=\"!chat.loading && chat.messages && chat.messages.length > 0\">\n" +
    "    <li data-ng-repeat=\"item in chat.messages\">\n" +
    "      <lstn-chat-message\n" +
    "        data-message=\"item\"\n" +
    "        data-index=\"$index\"></lstn-chat-message>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <div class=\"messages--empty\" data-ng-show=\"!chat.loading && (!chat.messages || chat.messages.length === 0)\"></div>\n" +
    "  <div class=\"messages--loading\" data-ng-show=\"chat.loading\">\n" +
    "    <i class=\"fa fa-circle-o-notch fa-spin\"></i>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-downvote.html',
    "<span>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-show=\"!playing.downvoted && !isCurrentController\"\n" +
    "    data-ng-disabled=\"!playing.track.key || playing.track.voted\"\n" +
    "    class=\"control__button btn btn-danger\"\n" +
    "    aria-label=\"Downvote\"\n" +
    "    data-ng-click=\"downvote()\"\n" +
    "    data-tooltip=\"Downvote\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-thumbs-down\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-show=\"playing.downvoted\"\n" +
    "    disabled=\"disabled\"\n" +
    "    class=\"control__button btn btn-danger\"\n" +
    "    aria-label=\"Downvoted\"\n" +
    "    data-tooltip=\"Downvoted\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-check\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-favorite.html',
    "<span>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-hide=\"favorites.bitset[playing.track.key]\"\n" +
    "    class=\"control__button btn btn-default\"\n" +
    "    aria-label=\"Favorite\"\n" +
    "    data-ng-click=\"favorites.addTrack(playing.track)\"\n" +
    "    data-tooltip=\"Favorite\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-heart-o text-danger\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-show=\"favorites.bitset[playing.track.key]\"\n" +
    "    class=\"control__button btn btn-default\"\n" +
    "    aria-label=\"Unfavorite\"\n" +
    "    data-ng-click=\"favorites.removeTrack(playing.track)\"\n" +
    "    data-tooltip=\"Unfavorite\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-heart text-danger\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-skip.html',
    "<span>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-show=\"isCurrentController\"\n" +
    "    data-ng-disabled=\"!playing.track.key\"\n" +
    "    class=\"control__button btn btn-danger\"\n" +
    "    aria-label=\"Skip Song\"\n" +
    "    data-ng-click=\"skipTrack()\"\n" +
    "    data-tooltip=\"Skip Song\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <span class=\"fa fa-step-forward\" aria-hidden=\"true\"></span>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-upvote.html',
    "<span>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-hide=\"playing.upvoted || isCurrentController\"\n" +
    "    data-ng-disabled=\"!playing.track.key || isCurrentController || playing.track.voted\"\n" +
    "    class=\"control__button btn btn-success\"\n" +
    "    aria-label=\"Upvote\"\n" +
    "    data-ng-click=\"upvote()\"\n" +
    "    data-tooltip=\"Upvote\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-thumbs-up\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button\n" +
    "    type=\"button\"\n" +
    "    data-ng-show=\"playing.upvoted\"\n" +
    "    disabled=\"disabled\"\n" +
    "    class=\"control__button btn btn-success\"\n" +
    "    aria-label=\"Upvoted\"\n" +
    "    data-tooltip=\"Upvoted\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-check\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-control-volume.html',
    "<span>\n" +
    "  <button\n" +
    "    data-ng-show=\"!mute\"\n" +
    "    data-ng-disabled=\"!playing.track.key\"\n" +
    "    type=\"button\"\n" +
    "    class=\"control__button btn btn-default\"\n" +
    "    aria-label=\"Mute\"\n" +
    "    data-ng-click=\"toggleMute()\"\n" +
    "    data-tooltip=\"Mute\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-lg fa-volume-off\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "  <button\n" +
    "    data-ng-show=\"mute\"\n" +
    "    data-ng-disabled=\"!playing.track.key\"\n" +
    "    type=\"button\"\n" +
    "    class=\"control__button btn btn-default\"\n" +
    "    aria-label=\"Unmute\"\n" +
    "    data-ng-click=\"toggleMute()\"\n" +
    "    data-tooltip=\"Unmute\"\n" +
    "    data-tooltip-placement=\"bottom\"\n" +
    "    data-tooltip-popup-delay=\"1000\">\n" +
    "    <i class=\"fa fa-lg fa-volume-up\" aria-hidden=\"true\"></i>\n" +
    "  </button>\n" +
    "</span>\n"
  );


  $templateCache.put('/static/partials/directives/room-controls.html',
    "<div class=\"playing__controls\">\n" +
    "  <lstn-room-control-volume></lstn-room-control-volume>\n" +
    "  <lstn-room-control-downvote></lstn-room-control-downvote>\n" +
    "  <lstn-room-control-skip></lstn-room-control-skip>\n" +
    "  <lstn-room-control-upvote></lstn-room-control-upvote>\n" +
    "  <lstn-room-control-favorite></lstn-room-control-favorite>\n" +
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
    "          <input type=\"text\" id=\"room-name\" data-ng-model=\"room.name\" class=\"form-control input-sm\" placeholder=\"Room Name\" />\n" +
    "        </td>\n" +
    "        <td data-ng-bind=\"room.owner.name\"></div>\n" +
    "        <td data-ng-show=\"!room.editing\">\n" +
    "          <button class=\"btn btn-default btn-xs\" data-ng-click=\"editRoom($index)\">Edit</button>\n" +
    "          <button class=\"btn btn-default btn-xs\" data-ng-click=\"deleteRoom($index)\">Delete</button>\n" +
    "        </td>\n" +
    "        <td data-ng-show=\"room.editing\">\n" +
    "          <button class=\"btn btn-primary btn-xs\" data-ng-click=\"saveEditRoom($index)\">Save</button>\n" +
    "          <button class=\"btn btn-default btn-xs\" data-ng-click=\"cancelEditRoom($index)\">Cancel</button>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr data-ng-show=\"showCreateRoom\">\n" +
    "        <td class=\"form-inline\">\n" +
    "          <label for=\"room-name\" class=\"sr-only\">Room Name</label>\n" +
    "          <input type=\"text\" id=\"room-name\" data-ng-model=\"newRoom.name\" class=\"form-control input-sm\" placeholder=\"Room Name\" />\n" +
    "        </td>\n" +
    "        <td></td>\n" +
    "        <td>\n" +
    "          <button class=\"btn btn-primary btn-xs\" data-ng-click=\"saveCreateRoom()\">Create</button>\n" +
    "          <button class=\"btn btn-default btn-xs\" data-ng-click=\"cancelCreateRoom()\">Cancel</button>\n" +
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
    "<div class=\"queue__container\">\n" +
    "  <div class=\"queue__controls\" data-ng-show=\"!queue.loading && queue.tracks && queue.tracks.length > 0\">\n" +
    "    <button class=\"btn\" data-ng-click=\"queue.toggleShuffle()\" data-ng-class=\"{'toggled': queue.shuffle}\">\n" +
    "      <i class=\"fa fa-fw fa-random\"></i>\n" +
    "      Shuffle\n" +
    "    </button><!--\n" +
    "    --><button class=\"btn btn-default\" data-ng-click=\"queue.clearTracks()\">\n" +
    "      <i class=\"fa fa-fw fa-times\"></i>\n" +
    "      Clear\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <ul id=\"queue\" class=\"queue queue--full track__list drilldown__list\" data-ng-show=\"!queue.loading && queue.tracks && queue.tracks.length > 0\" data-ui-sortable=\"sortableOptions\" ng-model=\"queue.tracks\">\n" +
    "    <li data-ng-repeat=\"track in queue.tracks\">\n" +
    "      <lstn-track\n" +
    "        data-track=\"track\"\n" +
    "        data-context=\"'queue'\"\n" +
    "        data-index=\"$index\"></lstn-track>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <div class=\"queue--empty\" data-ng-show=\"!queue.loading && (!queue.tracks || queue.tracks.length === 0)\">\n" +
    "    <p>You don't have any tracks in your queue.</p>\n" +
    "  </div>\n" +
    "  <div class=\"queue--loading\" data-ng-show=\"queue.loading\">\n" +
    "    <i class=\"fa fa-circle-o-notch fa-spin\"></i>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/room-roster.html',
    "<div class=\"roster__container room__container\">\n" +
    "\n" +
    "  <div class=\"roster__category\">\n" +
    "    <div class=\"roster__category-label\">Broadcasting\n" +
    "      <input\n" +
    "        data-bs-switch\n" +
    "        data-ng-model=\"isController\"\n" +
    "        type=\"checkbox\"\n" +
    "        data-switch-size=\"mini\">\n" +
    "    </div>\n" +
    "    <ul class=\"roster roster--controllers\">\n" +
    "      <li class=\"empty\" data-ng-show=\"!roster || roster.controllersCount === 0\">\n" +
    "        No Broadcasters\n" +
    "      </li>\n" +
    "      <li class=\"roster__item--controller\"\n" +
    "        data-ng-show=\"roster && roster.controllersCount > 0\" data-ng-repeat=\"user_id in roster.controllerOrder\">\n" +
    "        <a data-ng-href=\"http://www.rdio.com{{ roster.controllers[user_id].profile }}\" target=\"_blank\"\n" +
    "          tooltip=\"{{ roster.controllers[user_id].name }} ({{ roster.controllers[user_id].points }})\" data-tooltip-placement=\"bottom\">\n" +
    "          <img data-ng-src=\"{{ roster.controllers[user_id].picture }}\" class=\"avatar xs\"\n" +
    "            data-ng-class=\"{upvoted: playing.upvotes[user_id], downvoted: playing.downvotes[user_id]}\"\n" +
    "            alt=\"{{ roster.controllers[user_id].name }}\" />\n" +
    "            <i data-ng-if=\"user_id === currentController\" class=\"fa fa-volume-up\" />\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"roster__category\">\n" +
    "    <div class=\"roster__category-label\">Listening</div>\n" +
    "    <ul class=\"roster roster--listeners\" data-ng-show=\"roster && roster.usersCount > 0\">\n" +
    "      <li class=\"empty\" data-ng-show=\"!roster || roster.users.length === 0\">\n" +
    "        No one is listening\n" +
    "      </li>\n" +
    "      <li data-ng-repeat=\"(user_id, user) in roster.users | orderBy:name\">\n" +
    "      <a class=\"roster__user\"\n" +
    "        data-ng-href=\"http://www.rdio.com{{ user.profile }}\"\n" +
    "        target=\"_blank\"\n" +
    "        tooltip=\"{{ user.name }} ({{ user.points }})\" data-tooltip-placement=\"bottom\">\n" +
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


  $templateCache.put('/static/partials/directives/station-type.html',
    "<div id=\"station-type{{ $id }}\" class=\"drilldown__item station-type clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <i class=\"fa fa-fw fa-music fa-3x\"></i>\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title item__title--single\"\n" +
    "      data-ng-bind=\"stationType.name\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!stationType.loadingStations\"\n" +
    "      data-ng-click=\"loadStations(stationType)\"\n" +
    "      data-tooltip=\"Load Stations\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"stationType.loadingStations\"\n" +
    "      data-tooltip=\"Loading Stations\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/station.html',
    "<div id=\"station{{ $id }}\" class=\"drilldown__item station clearfix\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ station.icon }}\" alt=\"{{ station.name }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title item__title--single\"\n" +
    "      data-ng-bind=\"station.name\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-chevron-right\"\n" +
    "      data-ng-show=\"!station.loadingTracks\"\n" +
    "      data-ng-click=\"loadStationTracks(station)\"\n" +
    "      data-tooltip=\"Load Tracks\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "    <a\n" +
    "      class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "      data-ng-show=\"station.loadingTracks\"\n" +
    "      data-tooltip=\"Loading Tracks\"\n" +
    "      data-tooltip-placement=\"left\"\n" +
    "      data-tooltip-popup-delay=\"1000\"></a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/track.html',
    "<div id=\"track-{{ $id }}-{{ index }}-{{ track.key }}\" class=\"drilldown__item track\">\n" +
    "  <div class=\"item__image\">\n" +
    "    <img data-ng-src=\"{{ track.icon }}\" alt=\"{{ track.album }}\">\n" +
    "  </div>\n" +
    "  <div class=\"item__info\">\n" +
    "    <div\n" +
    "      class=\"item__title\"\n" +
    "      data-ng-class=\"{'text-muted': context !== 'queue' && queue.bitset[track.key]}\"\n" +
    "      data-ng-bind=\"track.name\"></div>\n" +
    "    <div\n" +
    "      class=\"item__artist\"\n" +
    "      data-ng-class=\"{'text-muted': context !== 'queue' && queue.bitset[track.key]}\"\n" +
    "      data-ng-bind=\"track.artist\"></div>\n" +
    "    <div\n" +
    "      class=\"item__duration text-muted\"\n" +
    "      data-ng-bind=\"track.duration | duration\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"item__actions\">\n" +
    "    <span class=\"dropdown\" data-dropdown data-is-open=\"status.open\">\n" +
    "      <i\n" +
    "        class=\"fa fa-fw fa-circle-o-notch fa-spin\"\n" +
    "        data-ng-show=\"track.addingToQueue || track.removingFromQueue\"></i>\n" +
    "      <i\n" +
    "        class=\"fa fa-fw fa-check\"\n" +
    "        data-ng-show=\"(track.in_queue || queue.bitset[track.key]) && context !== 'queue'\"\n" +
    "        data-tooltip=\"This track is already in your queue\"\n" +
    "        data-tooltip-placement=\"left\"\n" +
    "        data-tooltip-popup-delay=\"1000\"></i>\n" +
    "      <a\n" +
    "        class=\"fa fa-fw fa-ellipsis-v\"\n" +
    "        data-ng-hide=\"track.addingToQueue || track.removingFromQueue || ((track.in_queue || queue.bitset[track.key]) && context !== 'queue')\"\n" +
    "        data-ng-click=\"toggleDropdown($event)\"></a>\n" +
    "      <ul\n" +
    "        class=\"dropdown-menu dropdown-menu-right\"\n" +
    "        data-ng-hide=\"track.addingToQueue || track.removingFromQueue\"\n" +
    "        role=\"menu\">\n" +
    "        <li data-ng-show=\"track.in_queue && context === 'queue'\">\n" +
    "          <a data-ng-click=\"queue.moveToTop(index)\">\n" +
    "            <i class=\"fa fa-fw fa-arrow-circle-up item__actions__move-to-top\"></i>\n" +
    "            Move to Top of Queue\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li data-ng-show=\"track.in_queue && context === 'queue'\">\n" +
    "          <a data-ng-click=\"queue.moveToBottom(index)\">\n" +
    "            <i class=\"fa fa-fw fa-arrow-circle-down item__actions__move-to-bottom\"></i>\n" +
    "            Move to Bottom of Queue\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li data-ng-show=\"(track.in_queue || queue.bitset[track.key]) && context === 'queue'\">\n" +
    "          <a data-ng-click=\"queue.removeTrack(track, index)\">\n" +
    "            <i class=\"fa fa-fw fa-minus-circle\"></i>\n" +
    "            Remove From Queue\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li data-ng-hide=\"track.in_queue || queue.bitset[track.key]\">\n" +
    "          <a data-ng-click=\"queue.addTrack(track, 'top')\">\n" +
    "            <i class=\"fa fa-fw fa-plus-circle item__actions__add\"></i>\n" +
    "            Add to Top of Queue\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li data-ng-hide=\"track.in_queue || queue.bitset[track.key]\">\n" +
    "          <a data-ng-click=\"queue.addTrack(track)\">\n" +
    "            <i class=\"fa fa-fw fa-plus-circle item__actions__add\"></i>\n" +
    "            Add to Bottom of Queue\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li data-ng-hide=\"favorites.bitset[track.key]\">\n" +
    "          <a data-ng-click=\"favorites.addTrack(track)\">\n" +
    "            <i class=\"fa fa-fw fa-heart item__actions__favorite\"></i>\n" +
    "            Favorite Track\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li data-ng-show=\"favorites.bitset[track.key]\">\n" +
    "          <a data-ng-click=\"favorites.removeTrack(track)\">\n" +
    "            <i class=\"fa fa-fw fa-heart-o item__actions__unfavorite\"></i>\n" +
    "            Unfavorite Track\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </span>\n" +
    "    <i\n" +
    "      class=\"fa fa-fw fa-bars item__actions__drag-handle\"\n" +
    "      data-ng-show=\"track.in_queue && context === 'queue'\"></i>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/directives/visualizer.html',
    "<div class=\"playing__visualization text-center\">\n" +
    "  <div data-ng-repeat=\"i in getNumber(bands) track by $index\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/help.html',
    "<div>\n" +
    "    <p>This product uses the Rdio API but is not endorsed, certified or otherwise approved in any way by Rdio®.</p>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/index.html',
    "<div>\n" +
    "  <div class=\"hero jumbotron\">\n" +
    "    <div class=\"container\">\n" +
    "      <h1><span class=\"lstn\">Lstn</span> to <span class=\"rdio\">Music</span> with Friends</h1>\n" +
    "      <p>Create a room and start listening to music with your friends.</p>\n" +
    "      <p>\n" +
    "        <a data-ng-show=\"!current_user.id\" class=\"btn btn-primary btn-lg\" href=\"/login\" role=\"button\" target=\"_self\">Get Started</a>\n" +
    "        <a data-ng-show=\"current_user.id\" class=\"btn btn-primary btn-lg\" href=\"/rooms\" role=\"button\">Get Started</a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/room.html',
    "<div class=\"room\">\n" +
    "  <div class=\"col-md-3 col-sm-4 room__left\">\n" +
    "    <lstn-playing-info></lstn-playing-info>\n" +
    "    <lstn-room-roster></lstn-room-roster>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-5 col-sm-8 room__middle\">\n" +
    "    <tabset class=\"queue__tabs\">\n" +
    "      <tab id=\"my-queue-tab\">\n" +
    "        <tab-heading>MY QUEUE</tab-heading>\n" +
    "        <lstn-room-queue></lstn-room-queue>\n" +
    "      </tab>\n" +
    "      <tab>\n" +
    "        <tab-heading>MORE MUSIC</tab-heading>\n" +
    "        <lstn-more-music></lstn-more-music>\n" +
    "      </tab>\n" +
    "      <tab class=\"hidden-md hidden-lg\">\n" +
    "        <tab-heading>ROOM ACTIVITY</tab-heading>\n" +
    "        <lstn-room-activity class=\"hidden-md hidden-lg\"></lstn-room-activity>\n" +
    "      </tab>\n" +
    "    </tabset>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-4 hidden-sm hidden-xs room__right\">\n" +
    "    <lstn-room-activity></lstn-room-activity>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/static/partials/rooms.html',
    "<div class=\"rooms\">\n" +
    "  <h1>\n" +
    "    Your Rooms\n" +
    "    <button class=\"btn btn-success pull-right\" data-ng-click=\"createRoom()\">Create Room</button>\n" +
    "  </h1>\n" +
    "  <lstn-room-list></lstn-room-list>\n" +
    "</div>\n"
  );

}]);

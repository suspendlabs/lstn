import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db

user = Blueprint('user', __name__, url_prefix='/api/user')

@user.route('/<user_id>/<room_id>/vote/<direction>', methods=['POST'])
@login_required
def vote(user_id, room_id, direction):
  user = User.query.get(int(user_id))
  if not user:
    raise APIException('Unable to find user', 404)

  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Unable to find room', 404)

  # TODO: Check permissions

  if direction is 'downvote':
    user.points = User.c.points - 1
  else:
    user.points = User.c.points + 1

  db.session.add(user)
  db.session.flush()

  return jsonify(success=True)

@user.route('/playlists', methods=['GET'])
@login_required
def get_playlists():
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  playlist_set = rdio_manager.get_playlists()

  playlists = {
    'owned': [],
    'collab': [],
    'subscribed': [],
    'favorites': [],
  }

  if hasattr(playlist_set, 'owned_playlists'):
    playlists['owned'] = [playlist._data for playlist in playlist_set.owned_playlists if hasattr(playlist, '_data') and playlist.name != u'Lstn to Rdio']

  if hasattr(playlist_set, 'collab_playlists'):
    playlists['collab'] = [playlist._data for playlist in playlist_set.collab_playlists if hasattr(playlist, '_data')]

  if hasattr(playlist_set, 'subscribed_playlists'):
    playlists['subscribed'] = [playlist._data for playlist in playlist_set.subscribed_playlists if hasattr(playlist, '_data')]

  if hasattr(playlist_set, 'favorites_playlists'):
    playlists['favorites'] = [playlist._data for playlist in playlist_set.favorites_playlists if hasattr(playlist, '_data')]

  return jsonify(success=True, playlists=playlists)

@user.route('/playlists/<list_type>', methods=['GET'])
@login_required
def get_playlist_type(list_type):
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  if list_type not in ['owned', 'collab', 'subscribed', 'favorites']:
    raise APIException('Invalid list type')

  data = {
    'method': 'getUserPlaylists',
    'user': current_user.external_id,
    'kind': list_type,
  }

  playlists = {}
  playlists[list_type] = rdio_manager.call_api_authenticated(data)

  return jsonify(success=True, playlists=playlists)

@user.route('/queue', methods=['GET', 'PUT'])
@login_required
def user_queue():
  if request.method == 'PUT':
    return update_queue()

  queue = current_user.get_queue()
  return jsonify(success=True, queue=queue)

def update_queue():
  if 'queue' not in request.json:
    raise APIException('You must specify queue data')

  if not current_user.queue:
    raise APIException('Unable to set user queue', 500)

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  tracks = [track['key'] for track in request.json['queue']]

  if tracks:
    rdio_manager.set_playlist_order(current_user.queue, tracks)

  return jsonify(success=True)

@user.route('/queue/<track_id>', methods=['POST', 'DELETE'])
@login_required
def user_queue_track(track_id):
  if request.method == 'POST':
    return add_queue(track_id)

  return delete_queue(track_id)

def add_queue(track_id):
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  queue_playlist = current_user.get_queue_id()

  if queue_playlist:
    rdio_manager.add_to_playlist(queue_playlist, [track_id])
  else:
    playlist = rdio_manager.create_playlist('Lstn to Rdio', 'User Queue for Lstn', [track_id])

    # Throw an error if we couldn't create it
    if not playlist:
      raise APIException('Unable to create Rdio playlist', 500)

    queue_playlist = playlist.key

    # Update the user's queue field
    current_user.queue = queue_playlist
    db.session.add(current_user)
    db.session.flush()

  # Get the user's queue
  queue = current_user.get_queue()
  return jsonify(success=True, queue=queue)

def delete_queue(track_id):
  if not current_user.queue:
    raise APIException('Unable to delete track from non-existant playlist')

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  index = request.args.get('index', 0)
  rdio_manager.remove_from_playlist(current_user.queue, [track_id], index)

  queue = current_user.get_queue()
  return jsonify(success=True, queue=queue)

@user.route('/search', methods=['GET'])
def search():
  query = request.args.get('query', None)
  if not query:
    raise APIException('You must specify a search query')

  if len(query) < 3:
    return jsonify(success=True, results=[])

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  data = {
    'method': 'search',
    'query': query,
    'types': 'track',
  }

  results = rdio_manager.call_api(data)
  return jsonify(success=True, results=results['results'])

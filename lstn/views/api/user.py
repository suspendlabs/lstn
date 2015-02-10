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

  response = {
    success: 1,
  }

  return jsonify(response)

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

  response = {
    'success': 1,
    'playlists': playlists
  }

  return jsonify(response)

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
  };

  response = {
    'success': True,
    'playlists': {},
  }

  response['playlists'][list_type] = rdio_manager.call_api_authenticated(data);

  return jsonify(response)

@user.route('/queue', methods=['GET'])
@login_required
def user_queue():
  queue = current_user.get_queue()

  response = {
    'success': 1,
    'queue': queue,
  }

  return jsonify(response)

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

  response = {
    'success': 1,
    'queue': queue
  }

  return jsonify(response)

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

  response = {
    'success': 1,
    'queue': queue
  }

  return jsonify(response)

import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db

user = Blueprint('user', __name__, url_prefix='/api/user')

@user.route('/<user_id>/<room_id>/upvote', methods=['POST'])
@login_required
def upvote(user_id, room_id):
  user = User.query.get(int(user_id))
  if not user:
    raise APIException('Unable to find user', 404)

  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Unable to find room', 404)

  # TODO: Check permissions

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
      playlists['owned'] = [playlist._data for playlist in playlist_set.owned_playlists if hasattr(playlist, '_data')]

  if hasattr(playlist_set, 'collab_playlists'):
      playlists['collab'] = [playlist._data for playlist in playlist_set.collab_playlists if hasattr(playlist, '_data')]

  if hasattr(playlist_set, 'subscribed_playlists'):
      playlists['subscribed'] = [playlist._data for playlist in playlist_set.subscribed_playlists if hasattr(playlist, '_data')]

  if hasattr(playlist_set, 'favorites_playlists'):
      playlists['favorites'] = [playlist._data for playlist in playlist_set.favorites_playlists if hasattr(playlist, '_data')]

  response = {
    'success': 1,
    'playlists': playlists,
  }

  return jsonify(response)

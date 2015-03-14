import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db
from lstn.exceptions import APIException

playlist = Blueprint('playlist', __name__, url_prefix='/api/playlist')

@playlist.route('/<playlist_id>/tracks', methods=['GET'])
@login_required
def get_tracks(playlist_id):
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  tracks = []

  try:
    playlists = rdio_manager.get([playlist_id], ['tracks', 'radioKey'])
  except Exception as e:
    current_app.logger.debug(e)
    raise APIException('Unable to retrieve playlist tracks: %s' % str(e))

  if len(playlists) > 0 and hasattr(playlists[0], 'tracks'):
      tracks = [track._data for track in playlists[0].tracks]

  return jsonify(success=True, data=tracks)

import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db
from lstn.exceptions import APIException

artist = Blueprint('artist', __name__, url_prefix='/api/artist')

@artist.route('/<artist_id>/albums', methods=['GET'])
@login_required
def get_albums(artist_id):
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  try:
    albums = rdio_manager.get_albums_for_artist(artist_id, ['radioKey'])
  except Exception as e:
    current_app.logger.debug(e)
    raise APIException('Unable to retrieve albums: %s' % str(e))

  if len(albums) > 0:
      albums = [album._data for album in albums]

  response = {
    'success': 1,
    'albums': albums,
  }

  return jsonify(response)

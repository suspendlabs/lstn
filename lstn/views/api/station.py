import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db
from lstn.exceptions import APIException

station = Blueprint('station', __name__, url_prefix='/api/station')

@station.route('/<station_id>/tracks', methods=['GET'])
@login_required
def get_tracks(station_id):
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  data = {
    'method': 'generateStation',
    'station_key': station_id,
  }

  try:
    station = rdio_manager.call_api_authenticated(data)
  except Exception as e:
    current_app.logger.debug(e)
    raise APIException('Unable to retrieve station tracks: %s' % str(e))

  current_app.logger.debug(station)

  tracks = []
  if 'tracks' in station:
      tracks = station['tracks']

  response = {
    'success': 1,
    'tracks': tracks,
  }

  return jsonify(response)

import string
import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db
from lstn.models import Room
from lstn.exceptions import APIException

room = Blueprint('room', __name__, url_prefix='/api/room')

@room.route('/', methods=['GET'])
@login_required
def room_list():
  rooms = []
  for room in current_user.owned:
    data = room.to_array()
    data['owner'] = room.owner.to_array(for_public=True)
    rooms.append(data)

  response = {
    'success': 1,
    'rooms': rooms,
  }

  return jsonify(response)

@room.route('/<room_id>', methods=['GET'])
def get_room(room_id):
  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Room not found', 404)

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  hostname = request.headers['Host']
  if ':' in hostname:
    components = string.split(hostname, ':')
    hostname = components[0]

  playback = rdio_manager.get_playback_token(hostname)
  if not playback:
      raise APIException('Unable to retrieve playback token', 500)

  queue = current_user.get_queue()

  response = {
    'success': 1,
    'room': room,
    'playback': playback,
    'queue': queue,
  }

  return jsonify(response)

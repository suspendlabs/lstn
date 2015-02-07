import string
import simplejson as json
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from lstn import db
from lstn.models import Room, RoomQueue
from lstn.exceptions import APIException

room = Blueprint('room', __name__, url_prefix='/api/room')

@room.route('/', methods=['GET'])
@login_required
def room_list():
  rooms = []
  for membership in current_user.memberships:
    room = {
      'id': membership.room.id,
      'slug': membership.room.slug,
      'name': membership.room.name,
      'owner': membership.room.owner.to_array(for_public=True),
      'users': len(membership.room.roster),
      'playing': 'Test'
    }

    rooms.append(room)

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

  users = []
  for membership in room.roster:
    users.append(membership.user.to_array(for_public=True))

  queue = room.get_queue()

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  hostname = request.headers['Host']
  if ':' in hostname:
    components = string.split(hostname, ':')
    hostname = components[0]

  current_app.logger.debug(hostname)
  playback = rdio_manager.get_playback_token(hostname)

  if not playback:
      raise APIException('Unable to retrieve playback token', 500)

  response = {
    'success': 1,
    'room': room,
    'roster': users,
    'queue': queue,
    'playback': playback,
  }

  return jsonify(response)

@room.route('/<room_id>/queue', methods=['GET', 'POST'])
@login_required
def room_queue(room_id):
  # TODO: Check room permissions

  if request.method == 'POST':
    return add_queue(room_id)

  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Room not found', 404)

  queue = room.get_queue()

  response = {
    'success': 1,
    'queue': queue,
  }

  return jsonify(response)

@room.route('/<room_id>/queue/<track_id>', methods=['PUT', 'DELETE'])
@login_required
def room_queue_alter(room_id, track_id):
  # TODO: Check room permissions

  if request.method == 'PUT':
    return update_queue(room_id, track_id)

  return delete_queue(room_id, track_id)

def add_queue(room_id):
  request_data = request.get_json(force=True)
  if not request_data:
    raise APIException('Missing request data')

  if 'song_id' not in request_data:
    raise APIException('Missing song id')

  song_id = request_data['song_id']

  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Room not found', 404)

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'],
    current_app.config['RDIO_CONSUMER_SECRET'],
    current_user.oauth_token,
    current_user.oauth_token_secret)

  tracks = rdio_manager.get([song_id])
  if not tracks:
    raise APIException('Invalid song id', 400)

  track = tracks[0]._data

  room.add_track(song_id, track)

  queue = room.get_queue()

  response = {
    'success': 1,
    'queue': queue
  }

  return jsonify(response)

def delete_queue(room_id, track_id):
  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Room not found', 404)

  track = RoomQueue.query.get(int(track_id))
  if not track:
    raise APIException('Track not found', 404)

  if track.room_id != room.id:
    raise APIException('Invalid track id')

  db.session.delete(track)
  db.session.commit()

  queue = room.get_queue()

  response = {
    'success': 1,
    'queue': queue
  }

  return jsonify(response)

def put_queue(room_id, track_id):
  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Room not found', 404)

  track = RoomQueue.query.get(int(track_id))
  if not track:
    raise APIException('Track not found', 404)

  if track.room_id != room.id:
    raise APIException('Invalid track id')

  queue = room.get_queue()

  response = {
    'success': 1,
    'queue': queue
  }

  return jsonify(response)

@room.route('/<room_id>/roster', methods=['GET'])
@login_required
def get_roster(room_id):
  room = Room.query.filter(Room.slug == room_id).first()

  if not room:
    room = Room.query.get(int(room_id))

  if not room:
    raise APIException('Room not found', 404)

  users = []
  for membership in room.roster:
    users.append(membership.user.to_array(for_public=True))

  response = {
    'success': 1,
    'users': users,
  }

  return jsonify(response)

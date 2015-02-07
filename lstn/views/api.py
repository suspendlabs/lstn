import simplejson as json

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, jsonify

from flask.ext.login import login_required, current_user

from sqlalchemy.ext.associationproxy import association_proxy

from lstn import db

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/rooms', methods=['GET'])
@login_required
def rooms():
  current_app.logger.debug(current_user.memberships)

  rooms = []
  for membership in current_user.memberships:
    rooms.append(membership.room)

  response = {
    'success': 1,
    'rooms': rooms,
  }

  return jsonify(response)

@api.route('/roster/<room_id>', methods=['GET'])
@login_required
def roster(room_id):


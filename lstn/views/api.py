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
  rooms = [room for room in current_user.owned]

  response = {
    'success': 1,
    'rooms': rooms,
  }

  return jsonify(response)

@api.route('/roster/<room_id>', methods=['GET'])
@login_required
def roster(room_id):


from flask import Flask, request, redirect, url_for, session, render_template
from flask.ext.login import LoginManager
from flask.ext.sqlalchemy import SQLAlchemy
from flask.json import jsonify

from lstn.local import LSTN_CONFIG
from lstn.exceptions import APIException, WebException

import redis

class CustomFlask(Flask):
  jinja_options = Flask.jinja_options.copy()
  jinja_options.update(dict(
    block_start_string='<%',
    block_end_string='%>',
    variable_start_string='%%',
    variable_end_string='%%',
    comment_start_string='<#',
    comment_end_string='#>',
  ))

app = CustomFlask(__name__)
app.config.from_object(LSTN_CONFIG)

login_manager = LoginManager()
login_manager.init_app(app)

db = SQLAlchemy(app)

r = redis.StrictRedis(host=app.config['REDIS_HOST'], port=app.config['REDIS_PORT'], db=app.config['REDIS_DB'])

from lstn.models import ModelEncoder
app.json_encoder = ModelEncoder

@login_manager.user_loader
def load_user(id):
  from lstn.models import User
  return User.query.get(int(id))

@login_manager.unauthorized_handler
def unauthorized_handler():
  if '/api' not in request.path:
    session['next_url'] = request.url

  return redirect(url_for('site.login'))

@app.after_request
def after_request(response):
  response.headers['Access-Control-Allow-Origin'] = app.config['BASE_URL']
  response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS, POST, PUT, DELETE'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

  if response.status_code >= 200 and response.status_code < 300:
    db.session.commit()
  else:
    db.session.rollback()
  return response

@app.errorhandler(APIException)
def handle_api_exception(error):
  print 'APIException %s (%d)' % (error.message, error.status_code)
  return jsonify(error=error.message), error.status_code

@app.errorhandler(WebException)
def handle_web_exception(error):
  return render_template('%s.html' % error.status_code, message=error.message), error.status_code

@app.errorhandler(Exception)
def handle_exception(error):
  message = str(error) if app.config['DEBUG'] else 'Sorry, there was an internal server error. Please try again.'
  app.logger.exception(error)
  return jsonify(error=message), 500

def register_blueprint(app):
  from lstn.views.site import site
  app.register_blueprint(site)

  from lstn.views.api.room import room
  app.register_blueprint(room)

  from lstn.views.api.user import user
  app.register_blueprint(user)

  from lstn.views.api.playlist import playlist
  app.register_blueprint(playlist)

  from lstn.views.api.artist import artist
  app.register_blueprint(artist)

  from lstn.views.api.album import album
  app.register_blueprint(album)

register_blueprint(app)

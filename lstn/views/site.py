import simplejson as json
import hashlib
import urllib, urllib2
import rdio

from flask import Flask, request, redirect, url_for, \
  render_template, Blueprint, current_app, session

from flask.ext.login import login_required, current_user, login_user, logout_user

from lstn import db, login_manager
from lstn.models import User

site = Blueprint('site', __name__)

@site.route('/login')
def login():
  state = {}
  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'], current_app.config['RDIO_CONSUMER_SECRET'])

  auth = rdio_manager.get_token_and_login_url(url_for('site.auth', _external=True))

  required = ['login_url', 'oauth_token', 'oauth_token_secret']
  missing = [key for key in required if key not in auth]
  if missing:
    raise Exception('Unable to authenticate with Rdio')

  session['oauth_token_secret'] = auth['oauth_token_secret']

  auth_url = "%s?oauth_token=%s" % (auth['login_url'], auth['oauth_token'])
  return redirect(auth_url)

@site.route('/auth')
def auth():
  if 'oauth_verifier' not in request.args or 'oauth_token' not in request.args:
    raise Exception('Missing authentication response from Rdio')

  if 'oauth_token_secret' not in session:
    raise Exception('Missing required authentication token')

  request_token = {
    'oauth_token': request.args['oauth_token'],
    'oauth_token_secret': session['oauth_token_secret'],
  }

  rdio_manager = rdio.Api(current_app.config['RDIO_CONSUMER_KEY'], current_app.config['RDIO_CONSUMER_SECRET'])
  auth = rdio_manager.authorize_with_verifier(request.args['oauth_verifier'], request_token)

  if not auth or 'oauth_token' not in auth or 'oauth_token_secret' not in auth:
    raise Exception('Missing authentication response from Rdio')

  rdio_user = rdio_manager.current_user()
  if not rdio_user:
    raise Exception('Unable to retrieve user information from Rdio')

  user = User.query.filter(User.external_id == rdio_user.key).first()

  if not user:
    user = User(
      name=rdio_user.name,
      external_id=rdio_user.key,
      picture=rdio_user._data['icon250'],
      oauth_token=auth['oauth_token'],
      oauth_token_secret=auth['oauth_token_secret'],
    )
    db.session.add(user)
    db.session.commit()
  else:
    user.oauth_token = auth['oauth_token'];
    user.oauth_token_secret = auth['oauth_token_secret'];
    db.session.add(user)
    db.session.commit()

  if not user:
    raise Exception('Unable to update user')

  login_user(user)

  return redirect(url_for('site.index'))

@site.route('/logout')
@login_required
def logout():
  logout_user()
  return redirect(url_for('site.index'))

@site.route('/', defaults={'path': 'index'})
@site.route('/<path:path>')
def index(path):
  if current_user.is_anonymous:
    user_json = json.dumps({
      'name': 'Anonymous'
    })
  else:
    user_json = current_user.to_json(for_public=True)

  return render_template('index.html', user_json=user_json)

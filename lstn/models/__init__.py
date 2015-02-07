import datetime
import simplejson as json

from lstn import db

from flask import current_app
from flask.ext.login import UserMixin, current_user
from sqlalchemy.ext.declarative import declarative_base

class ModelMixin(object):
  def to_array(self):
    return dict((key, getattr(self, key)) for key in self.__dict__ if not key.startswith('_') and not isinstance(self.__dict__[key], ModelMixin) and not isinstance(self.__dict__[key], list))

  def to_json(self):
    return json.dumps(self.to_array(), cls=ModelEncoder)

class DateTimeEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.isoformat()
    elif isinstance(obj, datetime.date):
      return obj.isoformat()
    elif isinstance(obj, datetime.timedelta):
      return (datetime.datetime.min + obj).time().isoformat()
    else:
      return super(DateTimeEncoder, self).default(obj)

class ModelEncoder(DateTimeEncoder):
  def default(self, obj):
    if isinstance(obj, ModelMixin):
      return obj.to_array()
    else:
      return super(ModelEncoder, self).default(obj)

Base = declarative_base()

class User(db.Model, ModelMixin, UserMixin):
  __tablename__ = 'user'

  id = db.Column(db.BigInteger, primary_key=True)
  name = db.Column(db.String(255))
  external_id = db.Column(db.String(255))
  oauth_token=db.Column(db.String(255))
  oauth_token_secret=db.Column(db.String(255))
  picture = db.Column(db.String(32))
  points = db.Column(db.BigInteger)
  settings = db.Column(db.Text)
  created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

  owned = db.relationship('Room', backref='owner')

  def to_array(self, for_public=False):
    data = super(User, self).to_array()
    if for_public:
      data.pop('external_id', None)
      data.pop('oauth_token', None)
      data.pop('oauth_token_secret', None)
      data.pop('settings', None)

    return data

  @staticmethod
  def get_users(include_self=True):
    query = User.query.order_by(User.name)

    if not include_self:
      query = query.filter(User.id != current_user.id)

    users = query.all()
    return users

class Room(db.Model, ModelMixin):
  __tablename__ = 'room'

  id = db.Column(db.BigInteger, primary_key=True)
  name = db.Column(db.String(255))
  slug = db.Column(db.String(255))
  owner_id = db.Column(db.BigInteger, db.ForeignKey('user.id'))
  settings = db.Column(db.Text)
  created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

  def get_queue(self):
    room_queue = RoomQueue.query.\
      filter(RoomQueue.room_id == self.id).\
      order_by(RoomQueue.created_at.asc()).\
      all()

    tracks = []
    for entry in room_queue:
      data = json.loads(entry.track)
      data['id'] = entry.id
      tracks.append(data)

    return tracks

  def add_track(self, song_id, track):
    room_queue = RoomQueue(
      room_id=self.id,
      song_id=song_id,
      user_id=current_user.id,
      track=json.dumps(track)
    )

    db.session.add(room_queue)
    db.session.commit()

class RoomQueue(db.Model, ModelMixin):
  __tablename__ = 'roomQueue'
  id = db.Column(db.BigInteger, primary_key=True)
  room_id = db.Column(db.BigInteger, db.ForeignKey('room.id'))
  song_id = db.Column(db.String(255))
  user_id = db.Column(db.BigInteger, db.ForeignKey('user.id'))
  track = db.Column(db.Text)
  created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

  room = db.relationship(Room, backref='queue')

class RoomRoster(db.Model, ModelMixin):
  __tablename__ = 'roomRoster'

  id = db.Column(db.BigInteger, primary_key=True)
  room_id = db.Column(db.BigInteger, db.ForeignKey('room.id'))
  user_id = db.Column(db.BigInteger, db.ForeignKey('user.id'))
  created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

  room = db.relationship(Room, backref='roster')
  user = db.relationship(User, backref='memberships')

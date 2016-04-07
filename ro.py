import webapp2
from google.appengine.api import urlfetch
from google.appengine.ext import db
from webapp2_extras import sessions
import datetime

class BaseHandler(webapp2.RequestHandler):
  def dispatch(self):
    # Get a session store for this request.
    self.session_store = sessions.get_store(request=self.request)
 
    try:
      # Dispatch the request.
      webapp2.RequestHandler.dispatch(self)
    finally:
      # Save all sessions.
      self.session_store.save_sessions(self.response)
 
  @webapp2.cached_property
  def session(self):
    # Returns a session using the default cookie key.
    return self.session_store.get_session()

class MainPage(BaseHandler):

  def get(self):
    now = datetime.datetime.now();
    now = now +datetime.timedelta(hours=8);

    action = self.request.get("ac") + ''
    if action == 'rent':
      usr = ""
      uid = ""
      if self.session.get('name'):
        usr = self.session.get('name')
      if self.session.get('uid'):
        uid = self.session.get('uid')
      item = self.request.get("item") + ''
      date = self.request.get("date") + ''
      if usr == "" or item == "" or date == "" or uid == "":
        self.response.write('error')
      else:
        dates = date.split(',')
        del dates[len(dates)-1]
        for d in dates:
          date = datetime.datetime.strptime(d.split('-')[0], '%Y/%m/%d').date()
          ROc = RO(date=date,usr=usr,item=item,time=d.split('-')[1],uid=uid)
          ROc.add = datetime.datetime.now().date()
          ROc.put()
        self.response.write('ok')
    elif action == 'check':
      item = self.request.get("item") + ''
      uid = ""
      if self.session.get('uid'):
        uid = self.session.get('uid')
      if item == "":
        self.response.write('error')
      else:
        out = db.GqlQuery('SELECT * FROM RO WHERE date < :1',now.date())
        for p in out.run():
          p.delete()

        q = db.GqlQuery('SELECT * FROM RO WHERE item = :1',item)
        re = ""
        for p in q.run():
          ori = "0"
          if(p.uid == uid):
            ori = "1"
          re += p.usr + "^" + datetime.datetime.combine(p.date, datetime.datetime.min.time()).strftime('%Y/%m/%d') + "^" + p.time + "^" + p.uid+ "^"+ori+","

        self.response.write(re)

    elif action == 'time':
      self.response.write(now);
    elif action == 'del':
      time = self.request.get("time") + ''
      item = self.request.get("item") + ''
      date = self.request.get("date") + ''
      if time == "" or item == "" or date == "":
        self.response.write("error")
        return
      else:
        uid = ""
        if self.session.get('uid'):
          uid = self.session.get('uid')
        dates = datetime.datetime.strptime(date, '%Y/%m/%d').date()
        out = db.GqlQuery('SELECT * FROM RO WHERE date = :1 AND time = :2 AND item = :3',dates,time,item);
        for p in out.run():
          if p.uid == uid:
            p.delete()
            self.response.write('ok')
          else:
            self.response.write('error') 

    else:
      self.response.write('error type')
      


class RO(db.Model):
  date = db.DateProperty()
  usr = db.StringProperty()
  item = db.StringProperty()
  add = db.DateProperty()
  time = db.StringProperty()
  uid = db.StringProperty()

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'dvsdvsdvwev0402j029mf',
}

app = webapp2.WSGIApplication([
    ('/api/ro', MainPage),
], debug=True,config=config)
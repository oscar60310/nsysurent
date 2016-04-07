import webapp2
from google.appengine.api import urlfetch
from google.appengine.ext import db
import datetime

class MainPage(webapp2.RequestHandler):

  def get(self):
    now = datetime.datetime.now();
    now = now +datetime.timedelta(hours=8);

    action = self.request.get("ac") + ''
    if action == 'rent':
      usr = self.request.get("usr") + ''
      item = self.request.get("item") + ''
      date = self.request.get("date") + ''
      if usr == "" or item == "" or date == "":
        self.response.write('error')
      else:
        dates = date.split(',')
        del dates[len(dates)-1]
        for d in dates:
          date = datetime.datetime.strptime(d.split('-')[0], '%Y/%m/%d').date()
          led = LED(date=date,usr=usr,item=item,time=d.split('-')[1])
          led.add = datetime.datetime.now().date()
          led.put()
        self.response.write('ok')
    elif action == 'check':
      item = self.request.get("item") + ''
      if item == "":
        self.response.write('error')
      else:
        out = db.GqlQuery('SELECT * FROM LED WHERE date < :1',now.date())
        for p in out.run():
          p.delete()

        q = db.GqlQuery('SELECT * FROM LED WHERE item = :1',item)
        re = ""
        for p in q.run():
          re += p.usr + "^" + datetime.datetime.combine(p.date, datetime.datetime.min.time()).strftime('%Y/%m/%d') + "^" + p.time + ","

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
        dates = datetime.datetime.strptime(date, '%Y/%m/%d').date()
        out = db.GqlQuery('SELECT * FROM LED WHERE date = :1 AND time = :2 AND item = :3',dates,time,item);
        for p in out.run():
          p.delete()
          self.response.write('ok')

    else:
      self.response.write('error type')
      


class LED(db.Model):
  date = db.DateProperty()
  usr = db.StringProperty()
  item = db.StringProperty()
  add = db.DateProperty()
  time = db.StringProperty()


app = webapp2.WSGIApplication([
    ('/api/lab', MainPage),
], debug=True)
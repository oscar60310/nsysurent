import webapp2
from google.appengine.api import urlfetch
from google.appengine.ext import db
import datetime
import json 

class MainPage(webapp2.RequestHandler):

  def get(self):
    self.response.headers['Content-Type'] = 'application/json' 
    self.response.headers.add_header('Access-Control-Allow-Origin', '*') 
    now = datetime.datetime.now()
    now = now +datetime.timedelta(hours=8)

    action = self.request.get("ac") + ''
  
    if action == 'check':
      item = self.request.get("item") + ''
      if item == "":
        self.response.set_status(400)
      else:
        out = db.GqlQuery('SELECT * FROM LED WHERE date < :1',now.date())
        for p in out.run():
          p.delete()

        q = db.GqlQuery('SELECT * FROM LED WHERE item = :1',item)
        re = ""
        rentList = []
        for p in q.run():
          rentList.append({
            'usr': p.usr,
            'date': datetime.datetime.combine(p.date, datetime.datetime.min.time()).strftime('%Y/%m/%d'),
            'time': p.time 
          })
        self.response.out.write(json.dumps({
          'status': 'ok',
          'res': rentList
        }))
    elif action == 'time':
      self.response.out.write(json.dumps({
          'status': 'ok',
          'res': datetime.datetime.combine(now, datetime.datetime.min.time()).strftime('%Y/%m/%d')
      }))
    else:
      self.response.set_status(400)
  def post(self):
    self.response.headers.add_header('Access-Control-Allow-Origin', '*')
    self.response.headers['Content-Type'] = 'application/json'   
    jsonstring = self.request.body
    jsonobject = json.loads(jsonstring)
    action = self.request.get("ac") + ''
    if action == 'rent':
      if 'usr' not in jsonobject or 'item' not in jsonobject or 'req' not in jsonobject: 
        self.response.set_status(400)
        return
      usr = jsonobject['usr']
      item = jsonobject['item']
      req = jsonobject['req']
      for r in req:
        date = datetime.datetime.strptime(r['date'], '%Y/%m/%d').date()
        led = LED(date=date,usr=usr,item=item,time=r['time'])
        led.add = datetime.datetime.now().date()
        led.put()
      self.response.out.write(json.dumps({'status': 'ok'}))
    elif action == 'del':
      if 'item' not in jsonobject or 'req' not in jsonobject: 
        self.response.set_status(400)
        return
      item = jsonobject['item']
      req = jsonobject['req']
      dataList = []
      for r in req:
        date = datetime.datetime.strptime(r['date'], '%Y/%m/%d').date()
        out = db.GqlQuery('SELECT * FROM LED WHERE date = :1 AND time = :2 AND item = :3',date,r['time'],item)
        for p in out.run():
          p.delete()
      self.response.out.write(json.dumps({'status': 'ok'}))


    else:
      self.response.set_status(400)
  def options(self):      
    self.response.headers['Access-Control-Allow-Origin'] = '*'
    self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE'

class LED(db.Model):
  date = db.DateProperty()
  usr = db.StringProperty()
  item = db.StringProperty()
  add = db.DateProperty()
  time = db.StringProperty()


app = webapp2.WSGIApplication([
    ('/v2/api/lab', MainPage),
], debug=True)
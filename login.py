import webapp2
from google.appengine.api import urlfetch
from google.appengine.ext import db
from webapp2_extras import sessions
import json
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
    action = self.request.get("ac") + ''
    if action == 'check':
      user = self.session.get('name')
      self.response.write(user)
    elif action == "login":
      re = "http://nsysu-dop.appspot.com/"
      state = self.request.get("re") + ""
      url = "https://www.facebook.com/dialog/oauth?client_id=1072176379510087&redirect_uri="+ re
      url = url + "/api/login&state=" + state
      self.redirect(url.encode('utf8'))
    else:
      code = self.request.get("code") + ''
      if code == '':
        msg = "Login fail (Code not define)<a href='" + self.request.get('state') + "'>back</a>"
        self.response.write(msg)
      else:
        #self.session['user'] = "66"
        appID = "1072176379510087"
        redirect = "http://nsysu-dop.appspot.com/api/login"
        secret = "*"
        rpc = urlfetch.create_rpc()
        url = "https://graph.facebook.com/v2.3/oauth/access_token?client_id=" + appID +"&redirect_uri=" + redirect + "&client_secret=" + secret + "&code=" + code
        urlfetch.make_fetch_call(rpc, url)
        result = rpc.get_result()
        if result.status_code == 200:
          data = result.content
          
          tokeno = json.loads(data)
          token = tokeno['access_token']
      
          url_me = "https://graph.facebook.com/v2.5/me?access_token=" + token
          rpc = urlfetch.create_rpc()
          urlfetch.make_fetch_call(rpc, url_me)
          result = rpc.get_result()
          if result.status_code == 200:
            data = result.content
            me = json.loads(data)
            name = me['name']
            uid = me['id']
            nexturl = "https://graph.facebook.com/v2.5/204310116291421/members?fields=id&limit=50&access_token="+token
            auth = False
            while nexturl != "":
              rpc = urlfetch.create_rpc()
              urlfetch.make_fetch_call(rpc, nexturl)
              result = rpc.get_result().content
              nexturl = ""
              datas = json.loads(result)
              for member in datas['data']:
                if uid == member['id']:
                  auth = True
                  break
              if auth:
                nexturl = ""
                break
              else:
                if 'paging' in datas:
                  paging = datas['paging']
                  if 'next' in paging:
                    nexturl = paging['next']
                  else:
                    nexturl = ""
                else:
                  nexturl = ""
            if auth:
              self.session['uid'] = uid
              self.session['name'] = name
              self.redirect(self.request.get('state'))
            else:
              self.response.write("Login fail (Not member)<a href='" + self.request.get('state') + "'>back</a>")


          else:
            self.response.write("Login fail (Can not get ME data)<a href='" + self.request.get('state') + "'>back</a>")
        else:
          self.response.write("Login fail (Can not get token data)<a href='" + self.request.get('state') + "'>back</a>")

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'dvsdvsdvwev0402j029mf',
}

app = webapp2.WSGIApplication([
    ('/api/login', MainPage),
], debug=True ,config=config)
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created by start_app

import echo
from torweb.handlers import BaseHandler
from echo.shortcuts import *
from torweb.paginator import Paginator, InvalidPage
from tornado.web import HTTPError
from echo.utils.redisdb import RedisPool
from code import interact

class Handler(BaseHandler):
    def on_finish(self):
        pass
    def addP3P(self):
        self.set_header('P3P', 'CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA",policyref="/w3c/p3p.xml"')
        #self.set_header('P3P', 'CP="CAO DSP COR CUR ADM DEV TAI PSA PSD IVAi IVDi CONi TELo OTPi OUR DELi SAMi OTRi UNRi PUBi IND PHY ONL UNI PUR FIN COM NAV INT DEM CNT STA POL HEA PRE GOV"')

    def prepare(self):
        super(Handler, self).prepare()
        self.addP3P()
        self.request.static_domain = echo.static_domain
    def render(self, template, **kwargs):
        tmpl = env.get_template(template)
        kwargs.update({"request":self.request, "handler":self})
        self.write(tmpl.render(**kwargs))
    def render_to_string(self, template, **kwargs):
        tmpl = env.get_template(template)
        kwargs.update({"request":self.request, "handler":self})
        tmpl_string = tmpl.render(**kwargs)
        return tmpl_string
    def getPage(self,objects,numsPerpage=20, total_count=100):
        try: page_num = int(self.args.get('page', '1'))
        except ValueError: page_num = 1 
        paginator = Paginator(objects, numsPerpage, total_count=total_count)
        try: page = paginator.page(page_num)
        except InvalidPage: raise HTTPError(404)
        if not page: raise HTTPError(404)
        return page
    def get_error_html(self, status_code, **kwargs):
        self.render("error.html", status_code=status_code, kwargs=kwargs)


def setInitData(sessionid, data):
    RedisPool.get_redis().hmset("init-data-%s" % sessionid, data)
    RedisPool.get_redis().expire("init-data-%s" % sessionid, 300)

class LoginHandler(Handler):
    def prepare(self):
        super(LoginHandler, self).prepare()
        #self.request.static_domain = echo.static_domain
        f_setuser = self.setUser()
        import base64
        import urllib
        redirect_url = "/do_login?next=%s&appkey=%s&appsecret=%s" % (base64.b64encode(urllib.quote(self.request.uri)), 610059, "N379DVGnlK1RkfOCmvJsHgITurALEZbh")
        if not f_setuser:
            return self.redirect(redirect_url)
        if not self.loginValidate():
            return self.redirect(redirect_url)
    @property
    def initData(self):
        if hasattr(self, "_init_data"): return self._init_data
        logger.info("######### Init Data ###############")
        self.init_data = RedisPool.get_redis().hgetall("init-data-%s" % self.session["sessionid"])
        logger.info(self.init_data)
        setattr(self, "_init_data", self.init_data)
        return self._init_data

    def render(self, template, **kwargs):
        kwargs.update({"action":self.kwargs["action"]})
        super(LoginHandler, self).render(template, **kwargs)
    def setUser(self, sessionid=None):
        sessionid = self.session.get("sessionid", None)
        if sessionid:
            self.request.sessionid = sessionid
            return True
        else:
            self.request.sessionid = None
            return False
    def loginValidate(self, sessionid=None):
        sessionid = self.session.get("sessionid", None)
        logger.info("sessionid: %s"%sessionid)
        if sessionid:
            params = {
                "method": "ih.user.internal.validateSession",
                "appkey": "610059",
                "deviceid": "deviceid",
                "sessionid": sessionid
            }
            res_data = get_api_data(params)
            logger.info(res_data)
            if res_data["return_code"] == 0:
                self.session["phone"] = res_data["data"]["phone"]
                self.save_session()
                return True
            else:
                rem_me = int(self.get_cookie("rem_me", "0"))
                if rem_me == 1:
                    logger.info("###################################################")
                    logger.info("do auto login")
                    logger.info("###################################################")
                    uik = base64.b64decode(self.get_cookie("uik"))
                    username, password, totp_key = uik.split(":")
                    params = {
                        "method": "ih.user.auth.login",
                        "appkey": "610059",
                        "channel_id": "10004",
                        "deviceid": "deviceid",
                        "ua": self.request.headers["User-Agent"],
                        "username": username,
                        "password": password
                    }
                    res_data = get_api_data(params)
                    if res_data["return_code"] == 0:
                        self.session["sid"] = res_data["data"]["sessionid"]
                        self.session["sessionid"] = res_data["data"]["sessionid"]
                        self.session["usercode"] = res_data["data"]["usercode"]
                        self.session["username"] = res_data["data"]["wallet"]["username"]
                        self.save_session()
                        return True
                
                return False
        else:
            return False

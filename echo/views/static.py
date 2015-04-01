# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng@ivtime.com>

import os
from torweb.handlers import StaticFileHandler
from tornado.web import RequestHandler, HTTPError
from torweb.urls import url, except_url, url404
from echo import *
from echo.handlers import Handler
from code import interact

#########################################################
# 静态文件处理
#########################################################
@url(r'/pygal.js/(.*)', **{'path':'/home/zhangpeng/projects/echo-static/echo/pygal.js/'})
@url(r'/static/(.*)', **{'path': static_path})
class Static(StaticFileHandler, Handler):
    def prepare(self):
        self.request.static_domain = static_domain
        if self._status_code == 404: raise HTTPError(404)
    def get_error_html(self, status_code, **kwargs):
        self.render("error.html", status_code=404, kwargs={"exception":u"您访问的文件不存在！"})


#########################################################
# 404页面处理
#########################################################
@url404(r'.*')
class Handler404(Handler):
    def prepare(self):
        super(Handler404, self).prepare()
        self.request.static_domain = static_domain
        raise HTTPError(404)
    def get_error_html(self, status_code, **kwargs):
        self.render("error.html", status_code=404, kwargs={"exception":u"您访问的页面不存在！"})


@url(r'/captcha')
class CaptchaHandler(Handler):
    def get(self):
        from imagecaptcha import Captcha
        font = os.path.join(base_path, 'static', 'fonts', 'arialbi.ttf')
        captcha = Captcha(FONT=font, FONT_SIZE=30, WIDTH=121, HEIGHT=45, PADDING=35, BG_RGBA=(255,255,255), FL_RGBA=(0, 0, 0),\
                          CHAR="ABCDEFGHJKLMNPQRSTUVWXY345789")
        text, buf = captcha.gen()
        value = buf.getvalue()
        #self.set_cookie('captcha', text.lower())
        self.session["captcha"] = text.lower()
        self.save_session()
        self.set_header('Content-Type', 'image/jpeg; charset=utf-8')
        self.write(value)

#@url(r'/(.*)', **{'path':os.path.join(base_path, 'root_static')})
#class RootStatic(StaticFileHandler):pass

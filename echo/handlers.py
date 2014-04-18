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

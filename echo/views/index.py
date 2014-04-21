# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *

@url("/", action="index")
class Index(Handler):
    def get(self):
        return self.render("%s.html" % self.kwargs["action"], action=self.kwargs["action"])
@url("/basic/string", action="string")
class Basic(Handler):
    def get(self):
        return self.render("basic/%s.html" % self.kwargs["action"], action=self.kwargs["action"])
@url("/dom/drags", action="drags")
@url("/dom/fshow", action="fshow")
@url("/dom/buttons", action="buttons")
class Dom(Handler):
    def get(self):
        return self.render("dom/%s.html" % self.kwargs["action"], action=self.kwargs["action"])
@url("/function/isbrowser", action="isbrowser")
@url("/function/isdefined", action="isdefined")
@url("/function/getchkvals", action="getchkvals")
@url("/function/generateId", action="generateId")
@url("/function/cookie", action="cookie")
class Dom(Handler):
    def get(self):
        return self.render("function/%s.html" % self.kwargs["action"], action=self.kwargs["action"])
#@url("/inputs", action="inputs")
#@url("/forms", action="forms")
#@url("/pages", action="pages")
#@url("/collapse", action="collapse")
#@url("/tables", action="tables")
#@url("/navs", action="navs")
#@url("/lists", action="lists")
#@url("/panels", action="panels")
#@url("/rows-cols", action="rows-cols")
#@url("/grids", action="grids")
#@url("/tooltips", action="tooltips")
#@url("/alerts", action="alerts")
#@url("/delegate", action="delegate")

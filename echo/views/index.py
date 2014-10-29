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
class Function(Handler):
    def get(self):
        return self.render("function/%s.html" % self.kwargs["action"], action=self.kwargs["action"])

@url("/clazz/msgbox", action="msgbox")
@url("/clazz/toolbox", action="toolbox")
@url("/clazz/alertbox", action="alertbox")
@url("/clazz/paramsbox", action="paramsbox")
class Clazz(Handler):
    def get(self):
        types1 = str(self.args.get("types1", -1))
        tp = {
            "-1":[],
            "home": ["home1", "home2", "home3"],
            "profile": ["profile1", "profile2", "profile3"],
            "messages": ["messages1", "messages2", "messages3"]
        }
        types2 = tp[types1]
        return self.render("clazz/%s.html" % self.kwargs["action"], action=self.kwargs["action"], types2=types2)

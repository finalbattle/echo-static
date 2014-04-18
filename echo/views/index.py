# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *

@url("/", action="index")
class Index(LoginHandler):
    def get(self):
        return self.render("%s.html" % self.kwargs["action"], action=self.kwargs["action"])


#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *

@url("/svg/bar-chart")
class SVG_BarChart(Handler):
    def post(self):
        self.get()
    def get(self):
        args = self.args
        result = get_callback_data("http://127.0.0.1:8186/chart/bar", args)
        print "args:", args
        return self.render("svg/alertbox.html", result=result["data"])

@url("/svg/australia")
class SVG_BarChart(Handler):
    def get(self):
        return self.render("svg/australia.html")

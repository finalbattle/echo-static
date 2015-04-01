#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *


@url("/test-log")
class TestLog(Handler):
    def get(self):
        logger.info("hahaha")
        return self.write("hahaha")

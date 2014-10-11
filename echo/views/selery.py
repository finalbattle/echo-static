#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *
#from echo.utils.tasks import test, make_test
from echo.tasks import test
from echo.tasks_bak.common import test as common_test
import pickle
import tcelery

@url("/celery/task/test")
class CeleryTaskTest(Handler):
    @asynchronous
    @gen.engine
    def get(self):
        name = self.args.get("name", "zhangpeng")
        result = yield gen.Task(common_test.apply_async, args=[name])
        if result.status == "SUCCESS":
            self.finish(result.result)
        else:
            self.finish(result.status)

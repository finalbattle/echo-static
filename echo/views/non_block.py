#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *
from tornado.concurrent import run_on_executor
from concurrent import futures

@url("/non-block/sleep")
class SleepHandler(Handler):
    executor = futures.ThreadPoolExecutor(2)
    @asynchronous
    @gen.coroutine
    def get(self):
        # 假如你执行的异步会返回值被继续调用可以这样(只是为了演示),否则直接yield就行
        res = yield self.sleep()
        self.write("when i sleep")
        self.finish()

    @run_on_executor
    def sleep(self):
        time.sleep(5)
        return 5

@url("/non-block/justsee")
class JustNowHandler(Handler):
    def get(self):
        self.write("i hope just now see you")

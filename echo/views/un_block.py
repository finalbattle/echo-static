#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *

from concurrent.futures import ThreadPoolExecutor
from functools import partial, wraps
import time
 
#import tornado.ioloop
#import tornado.web
import tornado
 
 
EXECUTOR = ThreadPoolExecutor(max_workers=4)
 
 
def unblock(f):
 
    @asynchronous
    @wraps(f)
    def wrapper(*args, **kwargs):
        self = args[0]
 
        def callback(future):
            self.write(future.result())
            self.finish()
 
        EXECUTOR.submit(
            partial(f, *args, **kwargs)
        ).add_done_callback(
            lambda future: tornado.ioloop.IOLoop.instance().add_callback(
                partial(callback, future)))
 
    return wrapper
 
 
@url("/un-block/justsee")
class MainHandler(Handler):
    def get(self):
        self.write("i hope just now see you")
 
 
@url("/un-block/sleep/(\d+)")
class SleepHandler(Handler):
 
    @unblock
    def get(self, n):
        time.sleep(float(n))
        return "Awake! %s" % time.time()
 
 
@url("/un-block/sleep_async/(\d+)")
class SleepAsyncHandler(Handler):
 
    @asynchronous
    def get(self, n):
 
        def callback(future):
            self.write(future.result())
            self.finish()
 
        EXECUTOR.submit(
            partial(self.get_, n)
        ).add_done_callback(
            lambda future: tornado.ioloop.IOLoop.instance().add_callback(
                partial(callback, future)))
 
    def get_(self, n):
        time.sleep(float(n))
        return "Awake! %s" % time.time()

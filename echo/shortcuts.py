#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created by start_app

import base64
from datetime import datetime, timedelta

from torweb.urls import url
from torweb.handlers import *
from code import interact

from echo import *
###################################################
# tornado 
###################################################
from tornado.web import asynchronous
from tornado import gen

from utils.api import *
from utils.globals import *

from echo.utils.redisdb import RedisPool

from echo.error.exceptions import *

import simplejson

#cache.clear()

try:
    from storm.locals import *
    from storm.expr import Sum,LeftJoin,Eq,Or,And,Func
    from storm.tracer import debug as storm_debug
except:
    pass

from sqlalchemy import Table
from sqlalchemy.orm import mapper
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# 设置模板目录
from torweb.tmpl import FragmentCacheExtension
debug = True
from jinja2 import Environment, PackageLoader, MemcachedBytecodeCache, FileSystemBytecodeCache
env = Environment(
    loader = PackageLoader('echo', 'templates'),
    auto_reload = debug,
    extensions = [FragmentCacheExtension],
    bytecode_cache = MemcachedBytecodeCache(cache, prefix="echo/jinja2/bytecode/", timeout=3600*24*8)
)
env.fragment_cache = cache

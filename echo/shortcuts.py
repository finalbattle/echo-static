#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created by start_app

import base64
from datetime import datetime, timedelta

from torweb.urls import url
from torweb.handlers import *
from code import interact

from echo import *
from torweb.configure import CONFIG as CONFIGURATION
CONFIG = CONFIGURATION(settings.yaml_path)

URL_ROOT = CONFIG("URL_ROOT")

import os
import logging
import traceback
from logging.handlers import TimedRotatingFileHandler
def __init_log(_dir, type):
    #_log_path = join(base_path, 'static', 'log', _dir, type)
    _log_path = join(CONFIG("LOG.PATH"), _dir, type)
    if not os.path.exists(_log_path): os.makedirs(_log_path)
    _log = TimedRotatingFileHandler(join(_log_path, '%s.log' % type), 'MIDNIGHT')
    _log.setFormatter(logging.Formatter('%(asctime)s %(name)-12s %(levelname)-8s %(message)s'))
    _log.setLevel(logging.NOTSET)
    _logger = logging.getLogger(type)
    _logger.addHandler(_log)
    return _logger

logger = __init_log("echo-static", "log")


def logThrown():
    logger.critical(traceback.format_exc())
    logger.critical('-'*60)

###################################################
# tornado 
###################################################
from tornado.web import asynchronous
from tornado import gen

from utils.api import *
from utils.globals import *


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

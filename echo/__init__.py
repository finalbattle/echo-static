#!/usr/bin/python
# -*- coding: utf-8 -*-
# created by start_app

from os.path import abspath, dirname, join
base_path = abspath(dirname(__file__))

# 添加系统路径
import sys
sys.path.insert(0, abspath(join(base_path, '..', 'lib')))

from torweb.config import Yaml_Config
import platform
settings_path = join(base_path, 'settings_36.yaml')
if platform.uname()[1] == "mbtest2":
    settings_path = join(base_path, 'uat_settings.yaml')
if platform.uname()[1] == "zhangpeng-ThinkPad-T430":
    settings_path = join(base_path, 'settings.yaml')
Yaml_Config(base_path, settings_path)
#from code import interact
#interact(local=locals())


import os
import logging
import traceback
from logging.handlers import TimedRotatingFileHandler
def __init_log(type):
    _log_path = join(base_path, 'static', 'log', type)
    if not os.path.exists(_log_path): os.makedirs(_log_path)
    _log = TimedRotatingFileHandler(join(_log_path, '%s.log' % type), 'MIDNIGHT')
    _log.setFormatter(logging.Formatter('%(asctime)s %(name)-12s %(levelname)-8s %(message)s'))
    _log.setLevel(logging.NOTSET)
    _logger = logging.getLogger(type)
    _logger.addHandler(_log)
    return _logger

logger = __init_log('echo')

def logThrown():
    logger.critical(traceback.format_exc())
    logger.critical('-'*60)


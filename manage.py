#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

import os
import echo
import logging
import tornado.web
from tornado.options import options
from torweb.application import make_application 
from torweb.config import CONFIG
from torweb import run_torweb
#from tornado.options import define, options
from code import interact
import sys
reload(sys)
sys.setdefaultencoding("utf-8")


settings_path = os.path.join(echo.base_path, "settings.yaml")
logging.info("^_^")
logging.info(settings_path)

CONF = CONFIG(settings_path)
debug = CONF("DEBUG_PAGE")
url_root = CONF("URL_ROOT")

#define("port", default=8888)
default_port = options.port 
app = make_application(echo, debug, wsgi=True, settings_path=settings_path, url_root=url_root)
if options.cmd == "runserver":
    run_torweb.run(app, port=default_port)
else:
    run_torweb.show_urls(echo)

#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

import os
from pygal.config import Config
from echo.shortcuts import CONFIG
SVG_PATH = CONFIG("ENV.SVG_PATH")
js_list = ["svg.jquery.js", "pygal-tooltips.js"]
js_list = [ os.path.join(SVG_PATH, i) for i in js_list ]
config = Config(js=js_list)

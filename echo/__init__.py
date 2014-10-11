#!/usr/bin/python
# -*- coding: utf-8 -*-
# created by start_app

from os.path import abspath, dirname, join
base_path = abspath(dirname(__file__))

# 添加系统路径
import sys
sys.path.insert(0, abspath(join(base_path, '..', 'lib')))


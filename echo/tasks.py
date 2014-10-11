#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from celeryapp import celery
import time 

@celery.task
def test(strs):
    return "celery task: hello %s" % strs

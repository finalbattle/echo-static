#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from celery import Celery
import time 

CELERY_ACCEPT_CONTENT = ['pickle']  # ['pickle', 'json', 'msgpack', 'yaml']

#celery = Celery('tasks', backend='redis://localhost', broker="amqp://guest@localhost//")
celery = Celery('tasks', backend='amqp://guest@localhost//', broker="amqp://guest@localhost//")

celery.conf.CELERY_TASK_SERIALIZER = 'json'
celery.conf.CELERY_RESULT_SERIALIZER = 'json'
celery.conf.CELERY_ACCEPT_CONTENT=['json']

@celery.task
def test(strs):
    return "hello %s" % strs

@celery.task
def make_test(strs, callback=None):
    print strs
    time.sleep(10)
    callback("make test: callback %s" % strs)
    return "make_test: return hello %s" % strs

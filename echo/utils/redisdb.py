#coding:utf8
'''
Created on 2012-7-27

@author: Van

@description: redis缓存及数据清理

Copyright (c) 2012 infohold inc. All rights reserved.
'''

import os
import redis
#from util.configuration import CONFIG
from payutils.configure import CONFIG as CONFIGURATION
from echo import base_path, settings, logger
from code import interact
CONFIG = CONFIGURATION(settings.yaml_path)

class RedisPool(object):
    
    _pool = None

    @staticmethod
    def get_pool():
        if not RedisPool._pool:
            logger.info("REDIS:%s" % CONFIG("REDIS.HOST"))
            RedisPool.pool = redis.ConnectionPool(host=CONFIG('REDIS.HOST'),
                port=CONFIG('REDIS.PORT'), db=0,socket_timeout=CONFIG('REDIS.TIMEOUT'))
        return RedisPool.pool

    @staticmethod
    def get_redis():
        return redis.Redis(connection_pool=RedisPool.get_pool())

    
    @staticmethod
    def _ensure__pool():
        if not RedisPool._pool:
            RedisPool.get_pool()
    
    @staticmethod
    def get_conn():
        RedisPool._ensure__pool()
        return redis.Redis(connection_pool=RedisPool._pool)
    
    @staticmethod
    def get_pconn():
        RedisPool._ensure__pool()
        return redis.Redis(connection_pool=RedisPool._pool).pipeline()
        # 可以在一次请求中执行多个set命令，这样避免了多次的往返时延

    @staticmethod
    def clear_rd():
        """清空redis数据"""
        rd = RedisPool.get_conn()
        r1 = str(rd.dbsize())
        rd.flushdb()
        r2 = str(rd.dbsize())
        #Config.logger.info("已清空redis数据，清空前：%s，清空后：%s" % (r1, r2,))
        print ("已清空redis数据，清空前：%s，清空后：%s" % (r1, r2,))
        
    @staticmethod
    def clear_rd_keys(*patterns):
        """清空redis数据"""
        rd = RedisPool.get_conn()
        r1 = str(rd.dbsize())
        for pt in patterns:
            keys = rd.keys(pt)
            for key in keys:
                rd.delete(key)
        r2 = str(rd.dbsize())
        #Config.logger.info("已清空redis %s相关数据，清空前：%s，清空后：%s" % (patterns, r1, r2,))
        print ("已清空redis %s相关数据，清空前：%s，清空后：%s" % (patterns, r1, r2,))

def get_redis():
    return RedisPool.get_redis()
        
    

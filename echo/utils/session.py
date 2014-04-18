# coding=utf-8
"""
Created on 2013-03-12

@author: MSK
@description:

Copyright (c) 2013 infohold inc. All rights reserved.
"""
import uuid
from echo.utils.redisdb import RedisPool


class Session(object):
    """
        用户会话操作
    """

    session_key_pattern = 'session-id-%s'

    usercode_key_pattern = 'user-session-%s'

    def generate_session(self, usercode, userlevel):
        session_id = str(uuid.uuid1())
        key = Session.usercode_key_pattern % (usercode,)

        old_session = RedisPool.get_redis().get(key)
        if old_session:
            # 如果原有会话存在，则删除
            self.kill_session(old_session)

        RedisPool.get_redis().set(key, session_id)
        session_key = Session.session_key_pattern % (session_id,)
        RedisPool.get_redis().hmset(session_key, {'usercode': usercode, 'userlevel': userlevel})

        RedisPool.get_redis().expire(key, 1200)
        RedisPool.get_redis().expire(session_key, 1200)
        return session_id

    def kill_session(self, sessionid):
        session_key = Session.session_key_pattern % sessionid
        usercode = RedisPool.get_redis().hget(session_key, 'usercode')
        if usercode is not None:
            key = Session.usercode_key_pattern % (usercode,)
            RedisPool.get_redis().delete(key)
            RedisPool.get_redis().delete(session_key)

    def get_usercode(self, sessionid):
        session_key = Session.session_key_pattern % sessionid
        usercode = RedisPool.get_redis().hget(session_key, 'usercode')
        return usercode

    def get_userlevel(self, sessionid):
        session_key = Session.session_key_pattern % sessionid
        return RedisPool.get_conn().hget(session_key, 'userlevel')

    def get_sessionid(self, usercode):
        key = Session.usercode_key_pattern % (usercode,)
        sessionid = RedisPool.get_redis().get(key)
        return sessionid

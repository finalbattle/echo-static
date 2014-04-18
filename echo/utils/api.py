#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

import binascii
import simplejson
import random
import time
import hmac
import urllib
import urllib2
import logging
from hashlib import sha1
from tornado.httpclient import AsyncHTTPClient
from tornado.web import asynchronous
from tornado import gen
import traceback
from code import interact

APPKEY = 610059
CHANNEL_ID_WEB = 10004
SECRET_KEY = 'N379DVGnlK1RkfOCmvJsHgITurALEZbh'
GATEWAY_URL = "http://127.0.0.1:10000/platform/api"
import platform
if platform.uname()[1] == "mbtest2":
    GATEWAY_URL = "http://192.168.2.156:10000/platform/api"
if platform.uname()[1] == "zhangpeng-ThinkPad-T430":
    GATEWAY_URL = "http://192.168.0.36:10000/platform/api"



def get_sign(args, gateway_url=GATEWAY_URL, secret_key=SECRET_KEY):
    keys = args.keys()
    keys.sort()
    base_str = urllib.quote(gateway_url).replace("/", "%2F")
    args_str = ("&").join([(urllib.quote(str(key), '') + "=" + urllib.quote(str(args.get(key)), '')) for key in  keys])
    args_str = urllib.quote(args_str, '')
    url_str = (base_str + args_str).replace("+", "%20")
    hashed = hmac.new(secret_key, url_str, sha1)
    return binascii.b2a_base64(hashed.digest())[:-1]


##############################################################
# 通过boss gateway调用对应接口数据（同步） 
##############################################################
def get_api_data(params,api_version='1'):
    from echo.error.exceptions import PaymentException
    try:
        from echo import logger, logThrown
        params["serverkey"] = APPKEY
        params["appkey"] = APPKEY
        params["deviceid"] = "deviceid"
        params["channel_id"] = str(CHANNEL_ID_WEB)
        params["api_version"] = api_version
        params["timestamp"] = str(int(time.time()))

        postdata = urllib.urlencode(params)
        req = urllib2.Request(url=GATEWAY_URL, data=postdata,)
        logger.info("*****API_REQ_ALL: %s" % str(GATEWAY_URL + "?" + postdata))
        req_start = time.time()
        response = urllib2.urlopen(req).read()
        response = response.decode('utf-8')
        req_end = time.time()
        logger.info("API_REQ_TIME: START:[%s]_____END:[%s]_____USE:[%s]" % (req_start, req_end, req_end - req_start))
        logger.info("API_REQ_DATA: %s" % params)
        logger.info("API_RES_DATA: %s" % response)
        #if response.code != 200:
        #    raise PaymentException('', u"接口未正常返回")
        return simplejson.loads(response, use_decimal=True)
    except PaymentException as e:
        logThrown()
        return {"return_code":-1, "return_message":e.__unicode__()}
    except Exception as e:
        logThrown()
        return {"return_code":-1, "return_message":traceback.format_exc().split("\n")[-2]}

##############################################################
# 通过boss gateway调用对应接口数据（异步） 
##############################################################
@gen.engine
def get_async_api_data(params,api_version='1', gateway_url=GATEWAY_URL, secret_key=SECRET_KEY, callback=None):
    from echo.error.exceptions import PaymentException
    try:
        from echo import logger, logThrown
        params["serverkey"] = APPKEY
        params["appkey"] = APPKEY
        #if not params.has_key("appkey"):
        #    params["serverkey"] = params["appkey"]
        params["deviceid"] = "deviceid"
        params["channel_id"] = str(CHANNEL_ID_WEB)
        params["api_version"] = api_version
        #params["imsi"] = "imsi"
        #params["imei"] = "imei"
        #params["sign"] = get_sign(params, gateway_url, secret_key)
        #params["nonce"] = str(random.randint(100, 1000))
        params["timestamp"] = str(int(time.time()))

        req_start = time.time()
        postdata = urllib.urlencode(params)
        http_client = AsyncHTTPClient()
        #response = yield gen.Task(http_client.fetch, gateway_url+"?"+postdata)
        response = yield gen.Task(http_client.fetch, gateway_url, method="POST", body=postdata)
        logger.info("*****API_REQ_ALL: %s" % str(gateway_url + "?" + postdata))
        req_end = time.time()
        logger.info("API_REQ_TIME: START:[%s]_____END:[%s]_____USE:[%s]" % (req_start, req_end, req_end - req_start))
        logger.info("API_REQ_DATA: %s" % params)
        logger.info("API_RESPONSE: %s" % response.body)
        if response.code != 200:
            raise PaymentException('', u"接口未正常返回")
        callback(simplejson.loads(response.body, use_decimal=True))
    except PaymentException as e:
        logThrown()
        callback({"return_code":-1, "return_message":e.__unicode__()})
    except Exception as e:
        logThrown()
        callback({"return_code":-1, "return_message":traceback.format_exc().split("\n")[-2]})
        #callback({"return_code":-1, "return_message":e.__unicode__()})


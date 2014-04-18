#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from tornado.httpclient import AsyncHTTPClient
import urllib
import urllib2
from code import interact
#http_client = AsyncHTTPClient()
#postdata = urllib.urlencode({"a":1})
#response = http_client.fetch("http://127.0.0.1:8000/init-data", method="POST", body=postdata)

postdata = urllib.urlencode({"content":1})
req = urllib2.Request(url="http://127.0.0.1:8000/init-data", data=postdata,)
response = urllib2.urlopen(req).read()
response = response.decode('utf-8')

interact(local=locals())

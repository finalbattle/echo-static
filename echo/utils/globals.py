#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

def getUrlDomain(url):
    import urllib
    import re
    proto, rest = urllib.splittype(url)
    host, path = urllib.splithost(rest)
    if host:
        domain, port = urllib.splitport(host)
        match = re.search(r'\.[A-Z0-9.-]+\.[A-Z]{2,4}', domain, re.I)
        domain = match.group() if match else domain
        return domain
    return None


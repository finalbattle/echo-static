#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.handlers import *
from echo.shortcuts import *
from torweb.soaphandler import *
from soaplib.service import soapmethod


@url("/securitypay")
class AlipayMethod(SOAPService):
    @soapmethod(String, String, Integer, _returns=String)
    def create_securitypay_string(self, payment_sn, price, num):
        from alipay.submit import RequestBuilder
        r = RequestBuilder()
        s_string = r.create_securitypay_string(payment_sn, price, num)
        return str(s_string)

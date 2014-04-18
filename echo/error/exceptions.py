#-*- coding:utf8 -*-


###################################################################
# base class for exception
class PaymentException(Exception):
    """
    """

    def __init__(self, errorCode, errorMsg, *args, **kwargs):
        super(PaymentException, self).__init__(*args, **kwargs)
        self.code = errorCode
        self.msg = errorMsg

    def __str__(self):
        try:
            return '%s,code:%s,msg:%s' % (self.__class__.__name__, str(self.code), str(self.msg))
        except:
            return self.msg

    def __repr__(self):
        return self.__str__()

    def __unicode__(self):
        return u'支付错误：%s(%s)' % (self.code, self.msg)

    @property
    def result(self):
        return {"return_code": self.code, "return_message": self.msg}


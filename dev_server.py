# -*- coding: utf-8 -*-

import echo 
import tornado.web
import tornado.options
from torweb import run_torweb
from torweb import make_application 
from optparse import OptionParser
from code import interact
import sys
reload(sys)
sys.setdefaultencoding("utf-8")


if __name__ == '__main__':
    debug = True
    #debug = False
    usage = "usage: prog [options] arg1"
    default_port = 8123
    options = OptionParser(usage)
    options.add_option("-p", "--port", dest="port", default=default_port,
                       help="server listenning port, default is %s" % default_port,
                       metavar="PORT")
    (option, args) = options.parse_args()
    if debug:
        tornado.options.parse_command_line(args)
    app = make_application(echo, debug, wsgi=False)
    run_torweb.run(app, port=option.port)

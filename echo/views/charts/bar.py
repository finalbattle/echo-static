#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from echo.shortcuts import *
from echo.handlers import *
from echo.views.charts import *

@url("/xmlrpc/chart/bar")
class XMLRPCBarChart(XMLRPCHandler):
    def getBar(self):
        from pygal import Bar
        path = os.path.join(base_path, 'pygal_js', 'javascripts', 'bar', 'bar_chart.svg')
        config.width = 500
        config.height = 400
        bar_chart = Bar(config, width=400, height=300, legend_box_size=10)
        bar_chart.add('Fibonacci', [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55])  # Add some values
        bar_chart.render_to_file(path)
        #fileio = StringIO()
        #im.save(fileio, 'svg')
        ##im.save('img.gif', 'gif')
        #im.show()
        #return ''.join(char), fileio

        return os.path.join(SVG_PATH, 'bar', 'bar_chart.svg')
        #self.set_header('Content-Type', 'image/jpeg; charset=utf-8')
        #self.write(value)

from SimpleXMLRPCServer import SimpleXMLRPCDispatcher

class XMLRPCDispatcher(SimpleXMLRPCDispatcher):
    def __init__(self, funcs):
        #super(XMLRPCDispatcher, self).__init__(self, True, "utf-8")
        SimpleXMLRPCDispatcher.__init__(self, True, "utf-8")
        self.funcs = funcs
        self.register_introspection_functions()
        self.register_function(lambda x, y: x+y, "xxx.add")
        #self.register_function("sub", "xxx.sub")

dispatcher = XMLRPCDispatcher({
    "add": lambda x, y: x + y,
    "sub": lambda x, y: x - y
})

@url("/dispatcher/chart/bar")
class DispatcherBarChart(Handler):
    def get(self):
        self.post()
    def post(self):
        response = dispatcher._marshaled_dispatch(self.request.body)
        self.set_header("Content-Type", "text/xml")
        self.write(response)

@url("/chart/bar")
class HttpBarChart(Handler):
    def post(self):
        return self.get()
    def get(self):
        from pygal import Bar
        path = os.path.join(base_path, 'pygal_js', 'javascripts', 'bar', 'bar_chart.svg')
        config.width = 500
        config.height = 400
        #bar_chart = Bar(config, width=400, height=300, legend_box_size=10)
        args = self.args
        for k, v in args.items():
            if v.isdigit():
                args[k] = int(v)
        bar_chart = Bar(config, **args)
        data = self.args.get("data", "")
        x_labels = self.args.get("x_labels", "")
        bar_chart.add('Fibonacci', [int(i) for i in data.split(",")])  # Add some values
        bar_chart.x_labels = x_labels.split(",")
        bar_chart.render_to_file(path)
        #fileio = StringIO()
        #im.save(fileio, 'svg')
        ##im.save('img.gif', 'gif')
        #im.show()
        #return ''.join(char), fileio

        return self.write(simplejson.dumps({"data":os.path.join(SVG_PATH, 'bar', 'bar_chart.svg')}))
        #self.set_header('Content-Type', 'image/jpeg; charset=utf-8')
        #self.write(value)

import tornado.ioloop
import tornado.iostream
import socket
import json
jverify_pwd = json.dumps({
    "method":"VERIFYPWD",
    "serial":"01234567890123456789012345678901",
    "data":{
      "appId":"630053",
      "keyIndex":"12345678901234567890123456789012",
      "message":"19898B97CF897CE95C7819DB158B75325C6C8BA365588C6F168AD6858B922943F42F077D1DDDE07BF9C1CC31F1E169AB3D690D53A4D479F6723F94318690EC508F2D6CC10D9359B90C1402503856920C6D6D5E4649E1D2C26D8D37E4FFD439F5673D08F1D690ED4295F52145AC30AA4E29EEE8836FAC790178465291E58CC6DA",
    }
})



     
import tornado.web
from tornado.web import asynchronous
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class M1Handler(tornado.web.RequestHandler):
    @asynchronous
    def get(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0) 
        s.settimeout(50)
        self.stream = tornado.iostream.IOStream(s)
        self.stream.connect(("192.168.2.112", 6009), self.send_request)
    
    def send_request(self):
        self.stream.write(jverify_pwd)
        self.stream.read_until_close(self.on_response)

    def on_response(self, data):
        print data
        self.stream.close()
        self.write(data)
        self.finish()
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/m", M1Handler),
])
if __name__ == "__main__":
    application.listen(8888)
    ioloop = tornado.ioloop.IOLoop.instance()

    ioloop.start()


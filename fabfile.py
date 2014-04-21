#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from fabric.api import hosts, run, cd, sudo, env, put

#env.gateway = 'smt_app@192.168.0.36'

env.passwords = {'smt_app@192.168.0.36':'smt_app'}

def deploy():
    update()
    restart()

@hosts("smt_app@192.168.0.36")
def update():
    env.password = "smt_app"
    with cd("/usr/smallpay_s2/api-root/echo-static"):
        run("git pull")

@hosts("root@192.168.0.36")
def restart():
    env.password = "infohold"
    run("supervisorctl restart echo-static")

@hosts("root@192.168.0.36")
def start():
    env.password = "infohold"
    run("supervisorctl start echo-static")

@hosts("root@192.168.0.36")
def stop():
    env.password = "infohold"
    run("supervisorctl stop echo-static")

#!/usr/bin/env python
# -*- coding: utf-8 -*-
# created: zhangpeng <zhangpeng1@infohold.com.cn>

from fabric.api import hosts, run, cd, sudo, env, local

env.gateway = 'smt_app@192.168.0.36'

env.passwords = {'smt_app@192.168.0.36':'smt_app'}

@hosts("localhost")
def deploy():
    local("fab update update36 restart")

@hosts("smt_app@192.168.2.156")
def update():
    env.password = "smt_app"
    with cd("/usr/api-root/webapps/echo/trunk"):
        run("svn update")

@hosts("smt_app@192.168.0.36")
def update36():
    env.password = "smt_app"
    with cd("/usr/smallpay_s2/api-root/echo"):
        run("svn update")

@hosts("root@192.168.2.156", "root@192.168.0.36")
def restart():
    env.password = "infohold"
    run("supervisorctl restart echo")

@hosts("root@192.168.2.156", "root@192.168.0.36")
def start():
    env.password = "infohold"
    run("supervisorctl start echo")

@hosts("root@192.168.2.156", "root@192.168.0.36")
def stop():
    env.password = "infohold"
    run("supervisorctl stop echo")

#coding=utf-8
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from default.models import equiInfos
from django.contrib.auth import  authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from apscheduler.scheduler import Scheduler
import time
import logging
import random
import smtplib
import json
from email.mime.text import MIMEText
from email.header import Header

# Create your views here.

logger = logging.getLogger('django')

@login_required()
def index(request):
    return render(request, "display.html")

@login_required()
def display(request):
    equiInfo = equiInfos.objects.all()
    equilist = []
    for item in equiInfo:
        if item.states == True:
            timingChange(item)
        temp ={"id":item.id,"sn":item.sn,"namee":item.namee,"temperature":item.temperature,"times":item.times,"state":item.states,"errors":item.errors}
        equilist.append(temp)
    res ={"equilist":equilist}
    return JsonResponse(res)

@login_required()
def add(request):
        equiInfos.objects.create(sn=request.POST['sn'],namee=request.POST['namee'],temperature=00,times=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),states=True,errors="安全",history="")
        res = {"success":"true"}
        return JsonResponse(res)

@login_required()
def update(request):
    todoid = request.POST['id']
    sn = request.POST['sn']
    namee = request.POST['namee']
    todo = equiInfos.objects.get(id=todoid)
    todo.sn = sn
    todo.namee = namee
    todo.times = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    todo.save()
    res = {"success": "true"}
    return JsonResponse(res)

@login_required()
def dell(request):
    todoid = request.GET['id']
    equiInfos.objects.get(id=todoid).delete()
    res = {"success": "true"}
    return JsonResponse(res)

@login_required()
def clear(request):
    todoid = request.GET['id']
    todo = equiInfos.objects.get(id=todoid)
    todo.history=""
    todo.save()
    res = {"success": "true"}
    return JsonResponse(res)

def detail(request):
    i=0
    id = request.GET['id']
    details=[]
    equiInfo = equiInfos.objects.get(id=id)
    es = equiInfo.history.split(" ")
    eslen = len(equiInfo.history.split(" "))
    while i<eslen:
        details.append(es[i])
        i=i+1
    res = {"details":details}
    return JsonResponse(res)

def open(request):
    todoid = request.GET['id']
    equi = equiInfos.objects.get(id=todoid)
    if(equi.states == False):
        equi.states = True
    else:
        equi.states = False
    equi.save()
    res = {"success": "true"}
    return JsonResponse(res)

def _login(request):
    if request.method == 'GET':
        return render(request,'login.html')
    elif request.method == 'POST':
        username= request.POST['username']
        password= request.POST['password']
        user = authenticate(username=username,password=password)
        if user is not None:
            if user.is_active:
                login(request,user)
                equiInfo = equiInfos.objects.all()
                return render(request, 'display.html', {'equilist': equiInfo})
                #重定向到成功页面
            else:
                print ("user is not active")
                #重定向到失败页面，省略
        else:
            print ("user is None")
            #重定向到失败页面，省略
        print (request.session.keys())
        #print request.session['_auth_user_id']
        return HttpResponseRedirect("/")

def _logout(request):
    logout(request)
    print (request.session.keys())
    return HttpResponseRedirect("/")

def timingChange(item):
    mail_host = "smtp.qq.com"  # 设置服务器
    mail_user = "649691009@qq.com"  # 用户名
    mail_pass = "iexscyprgxbcbbfe"  # 口令

    sender = '649691009@qq.com'
    receivers = ['649691009@qq.com']  # 接收邮件

    message = MIMEText('警告，您的SN为'+item.sn+"号设备温度过高", 'plain', 'utf-8')
    message['From'] = Header("sawCao", 'utf-8')
    message['To'] = Header("模拟设备温度报警", 'utf-8')

    subject = '模拟设备温度报警'
    message['Subject'] = Header(subject, 'utf-8')


    temperature = random.randint(80,100)
    item.temperature = temperature
    item.history = item.history+" "+str(temperature)

    if item.temperature >= 90:
        item.errors = "危险"
        try:
            smtpObj = smtplib.SMTP_SSL("smtp.qq.com",465)
            smtpObj.login(mail_user, mail_pass)
            smtpObj.sendmail(sender, receivers, message.as_string())
            print
            "邮件发送成功"
        except smtplib.SMTPException:
            print
            "Error: 无法发送邮件"
    else:
        item.errors = "安全"
    item.save()





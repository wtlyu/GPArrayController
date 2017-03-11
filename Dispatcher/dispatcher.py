# -*- coding: utf-8 -*-
# import urllib3
import logging
import time
import sys, os
from WifiController.controller import clear, download, upload, photomode
logging.getLogger('socketIO-client').setLevel(logging.DEBUG)
logging.captureWarnings(True)

from socketIO_client import SocketIO, LoggingNamespace
# urllib3.disable_warnings()

bot_name='DispatcherBot'

def send(name,content,choice,id_):
	socketIO.emit('chat message',{'name':name,'content':content,'choice':choice,'id':id_,'robot':1})

#expire every twenty seconds
def once(*args):
	global sum_,first,second,third

	# print(len(args))
	# print(len(args[0]))
	print ('weatherid   ',weatherid)
	if weatherid!=0:
		print (args[0]['choice'])
		print (args[0]['content'])
		print (u"----")
		sum_+=1
		if(args[0]['content']==choicewords[0]):
			# print "hit yes"
			first+=1
			print (sum_)
		elif(args[0]['content']==choicewords[1]):
			second+=1
			print (sum_)
		else:
			third+=1

def ResHello():
	send(bot_name,'Hello, this is DispatcherBot #0. Your order?',['capture', 'clear', 'exit'],'DispatcherBot')

def ResCapture():
	photomode()
	time.sleep(1)
	os.system(sys.path[0] + '/GPIOController/export')
	os.system(sys.path[0] + '/GPIOController/capture')
	send(bot_name,'[capture] Captured, downloading',[],'DispatcherBot')
	download()
	send(bot_name,'[capture] Downloaded, uploading',[],'DispatcherBot')
	strc = upload()
	send(bot_name,'[capture] uploaded',[],'DispatcherBot')
	send(bot_name,'[capture] {}'.format(strc),[],'DispatcherBot')

def ResClear():
	clear()
	send(bot_name,'[clear] Done',[],'DispatcherBot')

def ResExit():
	os.system(sys.path[0] + '/GPIOController/unexport')
	send(bot_name,'Bye',[],'DispatcherBot')
	exit()

def handler(*args):
	global sum_,id_gen,weatherid,first,second,third
	#if hit, set up alive time. do counting
	print (args)
	if(args[0]['content']=='hello'):
		try:
			ResHello()
		except Exception as e:
			send(bot_name,'dispatcher error',[],'DispatcherBot')
	if(args[0]['content']=='capture'):
		try:
			ResCapture()
		except Exception as e:
			send(bot_name,'dispatcher error',[],'DispatcherBot')
	if(args[0]['content']=='clear'):
		try:
			ResClear()
		except Exception as e:
			send(bot_name,'dispatcher error',[],'DispatcherBot')
	if(args[0]['content']=='exit'):
		try:
			ResExit()
		except Exception as e:
			send(bot_name,'dispatcher error',[],'DispatcherBot')

def init():
	global socketIO
	socketIO=SocketIO('http://proxy.geekpie.org:8080', verify=False)

	print('connecting')
	socketIO.on('chat message', handler)
	print('connected, start listening')

	socketIO.wait()



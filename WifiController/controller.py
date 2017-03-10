# -*- coding: utf-8 -*-
# @Author: eastpiger
# @Date:   2017-02-16 14:38:02
# @Last Modified by:   eastpiger
# @Last Modified time: 2017-03-11 07:33:14

from urllib import request
import json
import time
import threading

shortcutMap = {
		'mode': {
			'video': 0,
			'photo': 1,
			'multishot': 2,
		},
		'command': {
			'shutter': {
				'trigger': 1,
				'start': 1,
				'stop': 0,
			},
		},
	}

def shortcut(key):
	response = shortcutMap
	for i in key.split('.'):
		response = response[i]
	return response

class Device(object):
	"""docstring for Device"""
	def __init__(self, id, ip, password):
		super(Device, self).__init__()
		self.id = id
		self.ip = ip
		self.password = password
		self.camera = None
		self.file_list = []

	def request(self, url, decode = 'utf'):
		response = request.urlopen('http://{}'.format(self.ip) + url)
		if response.status == 200:
			if decode:
				data = response.read().decode(decode)
			else:
				data = response.read()
			return data

	def gpControl(self, url):
		url = '/gp/gpControl' + url
		return self.request(url)

	def gpMediaList(self, url = ''):
		url = '/gp/gpMediaList' + url
		return self.request(url)

	def sleep(self):
		url = '/command/system/sleep'
		response = json.loads(self.gpControl(url))
		if response == {}:
			print(' [GoPro #{}] Sleep')
		else:
			print(' [GoPro #{}] Sleep error')

	def mode(self, modeCode):
		url = '/command/mode?p={}'.format(modeCode)
		response = json.loads(self.gpControl(url))
		if response == {}:
			print(' [GoPro #{}] Switch mode to {}'.format(self.id, modeCode))
		else:
			print(' [GoPro #{}] Switch mode to {} error'.format(self.id, modeCode))

	def shutter(self, shutterMode = shortcut('command.shutter.trigger')):
		url = '/command/shutter?p={}'.format(shutterMode)
		response = json.loads(self.gpControl(url))
		if response == {}:
			print(' [GoPro #{}] shutter mode {}'.format(self.id, shutterMode))
		else:
			print(' [GoPro #{}] shutter mode {} error'.format(self.id, shutterMode))

	def delete(self, postfix):
		return self.gpControl('/command/storage/delete{}'.format(postfix))
		response = json.loads(self.gpControl())
		print(response)

		self.file_list = []
		for directory in response['media']:
			for file in directory['fs']:
				self.file_list.append({
					'file': '{}/{}'.format(directory['d'], file['n']),
					'timestemp': file['mod']
					})

		self.file_list.sort(key = lambda x: x['timestemp'], reverse = True)

		print(' [GoPro #{}] File list refreshed'.format(self.id))

	def refreshFileList(self):
		response = json.loads(self.gpMediaList())
		print(response)

		self.file_list = []
		for directory in response['media']:
			for file in directory['fs']:
				self.file_list.append({
					'file': '{}/{}'.format(directory['d'], file['n']),
					'timestemp': file['mod']
					})

		self.file_list.sort(key = lambda x: x['timestemp'], reverse = True)

		print(' [GoPro #{}] File list refreshed'.format(self.id))

	def downloadLatest(self):
		self.refreshFileList()

		print(' [GoPro #{}] Downloading'.format(self.id))

		response = self.request('/videos/DCIM/{}'.format(self.file_list[0]['file']), decode = None)

		with open('./output/{}.jpg'.format(self.id), 'wb') as f:
			f.write(response)
			print(' [GoPro #{}] Downloaded'.format(self.id))

def multiThread_run(threads):
	for thread in threads:
		thread.setDaemon(True)
		thread.start()

	for thread in threads:
		thread.join()

	threads = []


device = [
	Device(id = 1, ip = '192.168.0.201', password = 'vrlab123'),
	Device(id = 2, ip = '192.168.0.202', password = 'vrlab123'),
	Device(id = 3, ip = '192.168.0.203', password = 'vrlab123'),
	Device(id = 4, ip = '192.168.0.204', password = 'vrlab123'),
	Device(id = 5, ip = '192.168.0.205', password = 'vrlab123'),
	Device(id = 6, ip = '192.168.0.206', password = 'vrlab123'),
	Device(id = 7, ip = '192.168.0.207', password = 'vrlab123'),
	Device(id = 8, ip = '192.168.0.208', password = 'vrlab123'),
	]

threads = []

def clear():
	def _deleteall(device):
		device.delete('/all')
	for i in device:
		threads.append(threading.Thread(target = _deleteall, args = (i,)))
	multiThread_run(threads)

def download():
	def _download(device):
		device.downloadLatest()
	for i in device:
		threads.append(threading.Thread(target = _download, args = (i,)))
	multiThread_run(threads)

def upload():
	from qiniu import Auth, put_file, etag, urlsafe_base64_encode
	import qiniu.config
	import time
	access_key = '6GXfBrWJbYN3N2y0zuMX7rf7tmvoqWg5CFwMYMKh'
	secret_key = 'Nk9DmZ95PRqqH59-2FH6__q5e5CQXgNKZj2LfBf2'
	#构建鉴权对象
	q = Auth(access_key, secret_key)
	#要上传的空间
	bucket_name = 'gparraycontroller'
	#上传到七牛后保存的文件名
	key = '1.' + str(time.time()) + '.jpg';
	#生成上传 Token，可以指定过期时间等
	token = q.upload_token(bucket_name, key, 3600)
	#要上传文件的本地路径
	localfile = './output/1.jpg'
	ret, info = put_file(token, key, localfile)
	print(info)
	assert ret['key'] == key
	assert ret['hash'] == etag(localfile)
	return 'http://omm25myif.bkt.clouddn.com/{}'.format(key)

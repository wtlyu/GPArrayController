var tmp=['轻便的字头', '大好的投票率', '卖力的老伴', '娇气的宽者', '可恶的培训司', '优美的照明', '惨烈的竹签', '上心的股骨', '危殆的飞天', '寂静的孤灯', '工整的精武门', '精当的压力壳', '紊乱的参议院', '得体的文苑', '亲昵的麻雀战', '瘠薄的宪章', '精微的民工', '眼熟的亲属', '齐整的塬谷', '叫座的科技','严峻的统计员', '轻浮的税务所长', '峭拔的遮阳伞', '优美的降Ｂ大调', '不好意思的便利店', '奇巧的老奶奶', '殷勤的麻雀', '明净的废物', '知足的送子观音', '沉毅的谐音', '畏难的导尿管', '不错的书报摊', '整齐的单方', '有理的幽香', '欣悦的铁皮', '不配的对话费', '爽洌的韧劲', '听话的军国主义', '宽广的负担', '瓷实的光照', '艳丽的短距离', '惊恐的五人制', '深奥的突破点', '详实的纲领', '贴心的胜绩', '浓厚的患难', '谦恭的因特网', '易懂的小褂儿', '明朗的大公', '稀少的步枪', '舒服的支气管炎', '纤细的韵律', '迟滞的便道', '消瘦的本质论', '硬朗的山泉', '荒芜的历史感', '清瘦的惨案', '不严的信息司', '活分的杂记', '衰弱的人形', '可行的废纸', '温热的设备厂', '险峻的钾盐', '瘠薄的第三世界', '宝贵的城市群', '明朗的柱身', '优异的意念', '乏力的期限', '丰满的个儿', '悲伤的劳动价值论', '舒畅的无绳电话机', '素洁的选士学', '公允的输出方', '含糊的图片', '眼熟的气度', '浮泛的厅长', '耐热的美术室', '可心的梦想', '知足的篝火', '狭窄的长白参', '有数的计划单列市', '汹涌的业务性', '畏难的文化学', '抑郁的情韵', '惊愕的小矫情', '有害的文化处', '富饶的三伯', '阴冷的城徽', '亲热的首季', '醇雅的顽症', '亲爱的伙计', '高傲的本体', '惶惑的形体', '局促的业务精', '危殆的遗传工程', '博雅的混凝土', '过得硬的老父亲', '醇芳的偶然性', '难受的珠宝', '凌乱的化肥厂', '长寿的青蛙王子', '长寿的青蛙王子', '长寿的青蛙王子', '长寿的青蛙王子'];
function getName(){
	return tmp[Math.floor(Math.random()*tmp.length)];
}
function removeHTMLTag(str) {
	str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
	return str;
}
function computeDistance(startCoords, destCoords) {
	try {
		var startLatRads = degreesToRadians(startCoords.latitude);
		var startLongRads = degreesToRadians(startCoords.longitude);
		var destLatRads = degreesToRadians(destCoords.latitude);
		var destLongRads = degreesToRadians(destCoords.longitude);

		var Radius = 6371; // radius of the Earth in km
		var distance=Math.acos(Math.sin(startLatRads)*Math.sin(destLatRads) +
				Math.cos(startLatRads) * Math.cos(destLatRads) *
				Math.cos(startLongRads - destLongRads)) * Radius;

		return distance;
	} catch(e) {
		return -1;
	}
}

function getCookie(c_name) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1) {
			c_start=c_start + c_name.length+1
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		}
	}
	return undefined;
}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}
function sendMsg(name, content, id, choice) {
	data = {
		'name': name,
		'content': content,
		'choice': choice,
		'id': id,
		'GPS': GPS,
		'robot': false,
	};
	socket.emit('chat message', data);
}
function onClickChoice(id, choice) {
	$('.' + id).addClass('inactive');
	$('.' + id + ' button').removeAttr('onclick');
	$('.' + id + ' button').attr('disabled', true);
	sendMsg(name, choice, id, []);
}
function onReceiveMsg(msg) {
	msg.name = removeHTMLTag(msg.name);
	msg.content = removeHTMLTag(msg.content);
	var dis = computeDistance(msg.GPS, GPS);
	if (dis > 2) return;
	var t = '<div class="message_box">';
	t += '<div class="username">';
	if (msg.robot) t+= '<span class="label label-success">Robot</span> ';
	t += msg.name + ':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	if (dis <= 0.2) t += '200m内';
	else t += '约' + Math.floor(dis * 10) / 10 + 'km';
	t += '</div>';
	t += '<div class="content">' + msg.content + '</div>';
	if (msg.choice!=[]) {
		t += '<div class="choices ' + msg.id + '">';
		msg.choice.map(function(element, index) {
			t += '<button class="btn btn-default" onclick="onClickChoice(\'' + msg.id + '\', \'' + element + '\')">' + element + '</button>';
		})
		t += '</div>';
	}
	t += '</div>';
	var endSig = $('#messages').height() - $('#messagesContainer').height() + 110 < 0 || $("#messagesContainer").scrollTop() >= $('#messages').height() - 2 * $('#messagesContainer').height() + 110;
	$('#messages').append(t);
	if (endSig) $("#messagesContainer").animate({"scrollTop": $('#messages').height() - $('#messagesContainer').height() + 110}, 100);
}
function onchangeEdit() {
	if ($('#nameContainer').hasClass('edit')) {
		$('#nameContainer').removeClass('edit');
		setName($('#nameEdit').val());
	} else {
		$('#nameContainer').addClass('edit')
	}
}
function setName(c_name) {
	name = c_name;
	$('#name').html(c_name);
	$('#nameEdit').val(c_name);
	setCookie('name', c_name, 30);
}
function init() {
	socket.on('chat message', onReceiveMsg);
	$('#sendForm').submit(function(){
		var content = $('#content').val();
		if (content) sendMsg(name, content, '', []);
		$('#content').val('');
		return false;
	});
	t = getCookie('name');
	var first_flag = false;
	if (t == undefined || t == '') {
		name = getName();
		first_flag = true;
		setName(name);
	} else setName(t);
	if (first_flag){
		onReceiveMsg({
			'name': 'Nearby Assistant',
			'content': 'Hello ' + name + '! 这是您第一次使用Nearby，请允许我做一下自我介绍吧。',
			'choice': [],
			'id': '',
			'GPS': GPS,
			'robot': true,
		});
		onReceiveMsg({
			'name': 'Nearby Assistant',
			'content': 'Nearby是一个基于地理位置与物联网络的平台，您可以轻而易举地与方圆2km范围内的朋友们自由交流，擦肩而过皆为缘，希望您能够找到更多的人生乐趣所在！',
			'choice': [],
			'id': '',
			'GPS': GPS,
			'robot': true,
		});
		onReceiveMsg({
			'name': 'Nearby Assistant',
			'content': 'Nearby的平台上，不仅是强地理关系下的人际网络，更是围绕您服务的物联中心。可能您在这里的一言一行，都会被周围的IOT设备识别，进而使它们为您提供更优秀的生活服务呢。Nearby的神奇之处，还有很多，说不定就在一句话，或者一个词，字字珠玑哦。',
			'choice': [],
			'id': '',
			'GPS': GPS,
			'robot': true,
		});
	} else
		onReceiveMsg({
			'name': 'Nearby Assistant',
			'content': 'Hello ' + name + '! 欢迎回来！',
			'choice': [],
			'id': '',
			'GPS': GPS,
			'robot': true,
		});
}

var name = undefined;
var socket = io();
init();
$('body > div').removeClass('inactive');

// GPS data saver
// 木办法会场GPS信号太差了只能先初始化一次
var GPS = {
	'latitude': 31.1748534,
	'longitude': 121.4024798,
};
var id, target, options;

function success(pos) {
	var crd = pos.coords;
	GPS = crd;
}

function error(err) {
	console.warn('ERROR(' + err.code + '): ' + err.message);
}

options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);

setInterval(navigator.geolocation.watchPosition(success, error, options), 30000);

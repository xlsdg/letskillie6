/**
 * Let's Kill IE6 (http://www.neoease.com/lets-kill-ie6/)
 * @version 2.0
 * @author MG12 (email: wuzhao.mail@gmail.com)
 */

(function() {

LetsKillIE6 = function() {

	this.config = null;

	this.cache = {
		dialog			:null,
		showThread		:null,
		hideThread		:null,
		triggerThread	:null,
		isDispose		:false,
		opacity			:0
	};
};

LetsKillIE6.prototype = {

	init: function(config) {
		this.config = config || this.config;
		var _self = this;

		if(_self._getCookie(_self.config.targetId) != _self.config.targetId) {	
			_self._loadCss(_self.config.cssUrl, function(){
				var dialog = document.createElement('div');
				dialog.id = _self.config.targetId;
				dialog.innerHTML = _self.config.html;
				document.body.appendChild(dialog);

				_self.cache.dialog = dialog;
				_self._show({_self:_self});

				window.onscroll = function(){
					_self._reset({_self:_self});
				};

				var closeButton = document.getElementById('letskillie6-close');
				closeButton.onclick = function(){
					_self.cache.isDispose = true;
					_self._hide({_self:_self});
					_self._setCookie(_self.config.targetId, _self.config.targetId, _self.config.delay);
					return false;
				};

				var links = dialog.getElementsByTagName('a');
				for(var i=0, len=links.length; i<len; i++) {
					var link = links[i];
					if(links[i].id != 'letskillie6-close') {
						link.onclick = function(ev){
							_self._popup(this);
							return false;
						};
					}
				}
			});
		}
	},

	_popup: function(link) {
		window.open(link.href);
	},

	_reset: function(args) {
		var _self = args._self;

		if(!_self.cache.isDispose) {
			_self.cache.dialog.style.visibility = 'hidden';

			clearTimeout(_self.cache.triggerThread);
			_self.cache.triggerThread = setTimeout(function () {
				_self._show({_self:_self});
			}, 400);
		}
	},

	_show: function(args) {
		var _self = args._self;
		var dialog = _self.cache.dialog;

		var height = document.documentElement.scrollTop + document.documentElement.clientHeight - dialog.offsetHeight - 10;

		_self.cache.opacity = 0;
		dialog.style.filter = 'alpha(opacity=' + _self.cache.opacity + ')';
		// dialog.style.opacity = _self.cache.opacity / 100;
		dialog.style.top = height + 'px';
		dialog.style.visibility = 'visible';

		_self.cache.showThread = setInterval(function(){_self._fadeIn({_self:_self});}, 40);
	},

	_hide: function(args) {
		var _self = args._self;
		var dialog = _self.cache.dialog;
		_self.cache.hideThread = setInterval(function(){_self._fadeOut({_self:_self});}, 40);
	},

	_fadeIn: function(args) {
		var _self = args._self;
		var dialog = _self.cache.dialog;

		_self.cache.opacity += 5;
		if(_self.cache.opacity >= 100) {
			_self.cache.opacity = 100;
			clearTimeout(_self.cache.showThread);
		}
		dialog.style.filter = 'alpha(opacity=' + _self.cache.opacity + ')';
		// dialog.style.opacity = _self.cache.opacity / 100;
	},

	_fadeOut: function(args) {
		var _self = args._self;
		var dialog = _self.cache.dialog;

		_self.cache.opacity -= 10;
		if(_self.cache.opacity <= 0) {
			_self.cache.opacity = 0;
			clearTimeout(_self.cache.hideThread);
			dialog.style.display = 'none';
		}
		dialog.style.filter = 'alpha(opacity=' + _self.cache.opacity +')';
		// dialog.style.opacity = _self.cache.opacity / 100;
	},

	_loadCss: function(url, fn) {
		var head = document.getElementsByTagName('head')[0];
		var node = document.createElement('link');
		node.type = 'text/css';
		node.rel = 'stylesheet';
		node.href = url;
		node.media = 'screen';

		node.onload = node.onreadystatechange = function(){
			if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
				node.onload = node.onreadystatechange = null; // hack for IE6 memory leak
				fn();
			}
		}

		head.appendChild(node);
	},

	_setCookie: function(name, value, day) {
		if(typeof LETSKILLIE6_DELAY != 'undefined' && LETSKILLIE6_DELAY != null) {
			day = LETSKILLIE6_DELAY;
		}
		if (value === null) {
			value = '';
		}
		var expires = '';

		date = new Date();
		date.setTime(date.getTime() + (day * 86400000));
		expires = '; expires=' + date.toUTCString();

		var path = '';
		var domain = '';
		var secure = '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	},

	_getCookie: function(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				while(cookie.charAt(0) == ' ') {
					cookie = cookie.substring(1, cookie.length);
				}
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

};

(new LetsKillIE6()).init({
	delay		:30,
	targetId	:'letskillie6',
	cssUrl		:'http://letskillie6.googlecode.com/svn/trunk/2/zh.css',
	html		:'<div class="letskillie6-r4"></div><div class="letskillie6-r2"></div><div class="letskillie6-r1"></div><div class="letskillie6-r1"></div><div class="letskillie6-content"><a rel="nofollow" id="letskillie6-close" href="javascript:;"></a><span class="letskillie6-pic"></span><p>' + 
				'您正在使用 Internet Explorer 6 遊覽網頁，如果您<strong>升级到 Internet Explorer 8</strong> 或<strong>轉換到另一个遊覽器</strong>，本站將能為您提供更好的服務。' +
				'</p><div style="clear:both;"></div><p class="letskillie6-browsers"><a rel="nofollow" class="letskillie6-ie8" href="http://www.microsoft.com/windows/internet-explorer/">IE 8</a><a rel="nofollow" class="letskillie6-firefox" href="http://www.mozilla.com/">Firefox</a><a rel="nofollow" class="letskillie6-chrome" href="http://www.google.com/chrome/">Chrome</a><a rel="nofollow" class="letskillie6-safari" href="http://www.apple.com/safari/">Safari</a><a rel="nofollow" class="letskillie6-opera" href="http://www.opera.com/">Opera</a><div style="clear:both;"></div></p><p class="letskillie6-meta">Let\'s kill Internet Explorer 6, <a href="http://www.neoease.com/lets-kill-ie6/">insert on your website</a>.</p></div><div class="letskillie6-r1"></div><div class="letskillie6-r1"></div><div class="letskillie6-r2"></div><div class="letskillie6-r4"></div>'
});

})();
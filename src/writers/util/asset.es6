var asset_getExt;
(function(){
	asset_getExt = function (type) {
		return EXT[type];
	};
	
	var EXT = {
		'mask': 'mask',
		'script': 'js',
		'style': 'css',
		'data': 'js',
		'html': 'html',
		'text': 'txt'
	}
}());

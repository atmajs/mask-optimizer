var assets_filter;
(function(){

	assets_filter = function(assets, type, opts){
		var target = opts.target || 'client';
		return assets
			.filter(asset => asset.type === type)
			.filter(asset => asset.linking !== 'dynamic')
			.filter(asset => asset.mode === 'both' || asset.mode === target);
	};

}());
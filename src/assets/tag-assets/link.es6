TagAssetsResolver['link'] = {
	getAssets (node, location, opts) {
		var attr = node.attr;
		var src = attr.href;
		if (!src) {
			// not a remote source
			return null;
		}
		var type = attr.rel;
		if (type && /stylesheet/i.test(type) === false) {
			// not a javascript
			return null;
		}

		var path = asset_resolvePath({ path: src, contentType: 'style' }, location);
		var asset = new Asset();
		asset.type = 'style';
		asset.mode = 'client';
		asset.path = path;
		asset.bundle = opts.bundle;
		if (attr.linking) {
			asset.linking = attr.linking;
		}
		if (attr.bundle) {
			asset.bundle = attr.bundle;
		}
		return [ asset ];
	}
};
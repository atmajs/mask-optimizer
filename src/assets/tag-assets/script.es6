TagAssetsResolver['script'] = {
	getAssets (node, location, opts) {
		if (this.isRemoteScript(node) === false) {
			return null;
		}
		var attr = node.attr;
		var src = attr.src;
		var path = asset_resolvePath({ path: src, contentType: 'style' }, location);
		var asset = new Asset();
		asset.type = 'script';
		asset.path = path;
		asset.bundle = opts.bundle;
		if (attr.linking) {
			asset.linking = attr.linking;
		}
		if (attr.mode) {
			asset.mode = attr.mode;
		}
		if (attr.bundle) {
			asset.bundle = attr.bundle;
		}
		return [ asset ];
	},
	isRemoteScript (node) {
		if (!node.attr.src) {
			return false;
		}
		var type = node.attr.type;
		if (type && /text\/javascript/i.test(type) === false) {
			// not a javascript
			return false;
		}
		return true;
	},
	build (node, opts) {

	}
};
TagAssetsResolver['import'] = {
	getAssets (node, location, opts) {
		var path = asset_resolvePath(node, location);
		var type = mask.Module.getType(node);
		var asset = new Asset();
		asset.type = type;
		asset.linking = node.link;
		asset.mode = node.mode;
		asset.path = path;
		asset.bundle = opts.bundle;
		return [ asset ];
	}
};

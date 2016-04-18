var Asset = class_create({
	type: '', //'script|style|mask|html|data|text',
	linking: 'static', //'dynamic|static',
	mode: 'both', //'server|client|both',
	path: '',
	bundle: '',
	assets: null, // [ Asset ]
	toJSON () {
		var asset = asset_clone(this, false);
		if (this.assets) {
			asset.assets = this.assets.toJSON();
		}
		return asset;
	}
});

Asset.fromPath = function(path, opts) {
	var type = mask.Module.getType({path});
	var asset = new Asset;
	asset.path = path;
	asset.type = type;
	obj_extend(asset, opts);
	return asset;
};

var AssetsCollection = class_create({
	groupBy (property) {
		var groups = {};
		this.forEach(item => {
			var val = item[property];
			var arr = groups[val];
			if (arr == null) {
				arr = groups[val] = new AssetsCollection;
			}
			arr.push(item);
		});
		return groups;
	},
	filterForBundle (types /*Array|String*/, target = 'client') {
		var fn = Array.isArray(types)
			? (asset) => types.indexOf(asset.type) !== -1
			: (asset) => asset.type === types;

		var arr = this
			.filter(asset => asset.linking !== 'dynamic')
			.filter(asset => asset.mode === 'both' || asset.mode === target)
			.filter(fn);

		return AssetsCollection.fromArray(arr);
	},
	toJSON () {
		return this.map(x => x && x.toJSON());
	}
}, new Array);

AssetsCollection.fromArray = function(assets) {
	var coll = new AssetsCollection();
	coll.push(...assets);
	return coll;
};
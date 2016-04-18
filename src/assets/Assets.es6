var Assets;
(function() {

	//import ./util/asset.es6
	//import ./util/flattern.es6
	//import ./Models.es6
	//import ./TagAssetsResolver.es6
	//import ./ResourceAssetsResolver.es6

	Assets = {
		get (path, opts_) {
			return class_Dfr.run((resolve, reject) => {

				var opts = obj_extendDefaults(opts_, defaultOptions);
				var asset = Asset.fromPath(path);
				var Resolver = ResourceAssetsResolver[asset.type];

				if (Resolver == null) {
					reject(`No asset resolver is registered for ${asset.path}`);
					return;
				}
				ResourceAssetsResolver.get(asset, opts).then(assets => {
					if (opts.flattern === true) {
						assets = flattern(assets);
					}
					resolve(assets);
				}, reject);
			});
		},
		Models: {
			Asset,
			AssetsCollection
		}
	};

	var defaultOptions = {
		deep: true,
		flattern: false,
		bundle: 'global'
	};


}());

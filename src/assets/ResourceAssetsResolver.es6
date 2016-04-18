var ResourceAssetsResolver;
(function(){

	ResourceAssetsResolver = {
		get (asset, opts) {
			return class_Dfr.run((resolve, reject) => {
				var fn = this[asset.type];
				if (fn == null) {
					resolve(asset);
					return;
				}
				fn(asset, opts).then(() => resolve(asset.assets), reject);
			});
		},
		'mask' (asset, opts) {
			return resolveFromTemplate(mask.parse, asset, opts);
		},
		'html' (asset, opts) {
			return resolveFromTemplate(mask.parseHtml, asset, opts);
		}
	};

	function resolveFromTemplate(parser, asset, opts) {
		return class_Dfr.run((resolve, reject) => {
			if (io.File.exists(asset.path) === false) {
				reject(`Asset not found ${asset.path}`);
				return;
			}

			var template = io.File.read(asset.path, opts);
			var ast = typeof template === 'string'
				? parser(template)
				: template
				;

			AssetsResolver
				.mask
				.getAssets(asset, ast, opts)
				.then(asset => processDeep(asset), reject);

			function processDeep(asset) {
				if (opts.deep === false || asset.assets == null) {
					resolve(asset);
					return;
				}
				var dfrs = asset.assets.map(asset => ResourceAssetsResolver.get(asset, opts));
				dfr_waitAll(dfrs).then(resolve, reject);
			}
		});
	}

	var AssetsResolver = {
		mask : {
			getAssets (asset, ast, opts) {
				return class_Dfr.run((resolve, reject) => {
					var location = path_getDir(asset.path);
					var assets = new AssetsCollection;
					mask.TreeWalker.walkAsync(ast, visit, ready);

					function visit (node, next){
						var resolver = TagAssetsResolver[node.tagName]
						if (resolver === void 0) {
							return next();
						}
						var arr = resolver.getAssets(node, location, opts);
						if (arr) {
							assets.push(...arr);
						}
						next();
					}

					function ready() {
						if (assets.length !== 0) {
							asset.assets = assets;
						}
						resolve(asset);
					}
				});
			}
		}
	};


}());
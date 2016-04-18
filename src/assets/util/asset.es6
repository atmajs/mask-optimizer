var asset_clone,
	asset_makeConsistent,
	asset_resolvePath;

(function(){

	asset_clone = function (asset, deep) {
		var clone = new Asset();
		clone.type = asset.type;
		clone.mode = asset.mode;
		clone.path = asset.path;
		clone.bundle = asset.bundle;
		clone.linking = asset.linking;

		if (deep && is_Array(asset.assets)) {
			clone.assets = asset.assets.map(x => asset_clone(x, true));
		}
		return clone;
	};

	(function(){
		asset_makeConsistent = function (target, source) {
			if (target.type !== source.type) {
				throw new Error(`Resource type of different types ${target.type}:${source.type} for '${source.path}'`);
			}
			if (target.linking !== source.linking) {
				target.linking = select([ 'static', 'dynamic' ], target.linking, source.linking);
			}
			if (target.mode !== source.mode) {
				target.mode = select(['both', 'client', 'server'], target.mode, source.mode);
			}
		};
		function select(prefer, valA, valB) {
			var iA = prefer.indexOf(valA),
				iB = prefer.indexOf(valB);
			if (iA === -1 || iB === -1) {
				throw Error(`Value not found in preferred collection. Values: ${valA} ${valB}`);
			}
			if (iA <= iB) {
				return valA;
			}
			return valB;
		}
	}());


	asset_resolvePath = function (endpoint, location) {
		var type = mask.Module.getType(endpoint);
		var path = endpoint.path;
		if ((type == null || type === 'mask') && path_getExtension(path) === '') {
			path += '.mask';
		}
		if (path_isRelative(path)) {
			path = path_combine(location, path);
		}
		return path_normalize(path);
	};
}());

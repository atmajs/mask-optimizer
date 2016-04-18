var flattern;
(function () {
	flattern = function (assets) {
		return distinct(get(assets, []));
	};

	function get (assets, stack) {
		if (assets == null) {
			return stack;
		}
		var arr = assets,
			imax = arr.length,
			i = -1, x;
		while ( ++i < imax ) {
			x = arr[i];
			if (typeof x === 'string') {
				throw Error('Unsupported. Code block remote on next iteration');
				stack.unshift(x);
				continue;
			}
			// assume is an object { path, dependencies[] }
			stack.unshift(asset_clone(x, false));
			get(x.assets, stack);
		}
		return stack;
	}
	function distinct (stack) {
		for (var i = 0; i < stack.length; i++) {
			for (var j = i + 1; j < stack.length; j++) {
				if (stack[i].path === stack[j].path) {
					asset_makeConsistent(stack[i], stack[j]);
					stack.splice(j, 1);
					j--;
				}
			}
		}
		return stack;
	}
}());
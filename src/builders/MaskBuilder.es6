var MaskBuilder;
(function(){
	MaskBuilder = class_create(IBuilder, {

		build (allAssets, opts) {
			var coll = allAssets.filterForBundle(['mask', 'html']);
			var groups = coll.groupBy('bundle');
			var keys = Object.keys(groups);
			var dfrs = keys.map(key => {
				let assets = groups[key];
				let dfrs = assets.map(asset => this.getSingle(asset, opts));

				return dfr_waitAll(dfrs).then(arr => {

					arr.push(createCssModules(assets));

					return this.writer.write(key, 'mask', opts, arr.join('\n'));
				});
			});

			return dfr_waitAll(dfrs).then(() => this);
		},

		getSingle (asset, opts) {
			return io
				.File
				.readAsync(asset.path, opts)
				.then(template => {
					return MaskOptimizer
						.process(template, opts)
						.then(ast => {

							ast = jmask('module')
								.attr('path', asset.path)
								.append(ast);

							return mask.stringify(ast, {
								indent: opts.minify ? 0 : 4
							});
						});
				});
		}
	});

	function createCssModules (assets) {
		return assets
			.filterForBundle('style')
			.map(asset => {
				var path = asset.path;
				`module path='${path}' type='style';`
			})
			.join('\n');
	}
}());
var Runner = {
	/* PACKAGE { mask, script, style } */
	process (template, opts) {
		var dfr = new mask.class.Deferred;
		Builder
			.process(template, opts)
			.fail(error => dfr.reject(error))
			.done(pckg => {
				Optimizer
					.process(pckg.mask, opts)
					.fail(error => dfr.reject(error))
					.done(ast => {
						pckg.mask = Minifier.process(ast, { indent: opts.minify ? 0 : 4 });
						dfr.resolve(pckg);
					});
			});
		return dfr;
	},
	processFile: function(path, opts){
		var dfr = new mask.class.Deferred;
		if (io.File.exists(path) === false) {
			return dfr.reject(Error('File not found: ' + path));
		}
		
		var template = io.File.read(path, { skipHooks: true });
		opts.filename = path;
		return Runner.process(template, opts)
	}
};
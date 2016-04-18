module.exports = {
	process: function(template, opts){
		return Runner.process(template, opts);
	},
	processFile: function(path, opts) {
		return Runner.processFile(path, opts);
	},
	cfg: function (prop, mix) {
		mask.obj.set(__cfg, prop, mix);
	},

	build (file, opts) {
		PackageBuilder.process(file, opts);
	},
	getAssets (path, opts) {
		return Assets.get(path, opts);
	},
	build (path, opts_) {
		var opts = _.obj_extendDefaults(opts_, {
			Writer: Writers.FileWriter
		});
		var writer = new opts.Writer();
		var builder = new Builder(writer);

		return this
			.getAssets(path, { flattern: true })
			.then(assets => {
				return builder.build(assets, opts);
			});
	},

	Writers
};
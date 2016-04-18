(function(){
	Writers.FileWriter = class_create({
		write (bundle, type, opts, content) {
			var output = opts.outputDir;
			var filename = bundle + '.' + asset_getExt(type);
			var path = Uri.combine(output, filename);
			return io.File.writeAsync(path, content, opts);
		}
	});
});
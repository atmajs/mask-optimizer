(function(){

	var _memory = {};
	Writers.MemoryWriter = class_create({
		write (bundle, type, opts, content) {
			var output = opts.outputDir;
			var filename = bundle + '.' + asset_getExt(type);
			var path = Uri.combine(output, filename);
			_memory[path] = content;
		}
	});

	Writers.MemoryWriter.memory = _memory;
}());

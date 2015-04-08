var Minifier = {
	process (source, opts){
		return mask.stringify(source, opts);
	},
	minifyFiles (mix, outputs) {
		var files;

		if (typeof mix === 'string') {
			if (mix.indexOf('*') !== -1)
				files = io.glob.readFiles(mix);
			else {
				files = [ mix ];

				if (typeof outputs === 'string')
					outputs = [ outputs ];
			}
		}

		files.forEach((file, index) => {
			if (io.File.exists(file) === false) {
				console.error('<File not found>', file);
				retur;
			}

			var source = io.File.read(file),
				minified = mask.stringify(source);
			
			io.File.write(getOutputFile(file.uri, index, outputs), minified);
		});


		function getOutputFile(uri, index, outputs) {
			
			if (outputs == null)
				return uri.combine(uri.getName() + '.min.' + uri.extension);

			if (Array.isArray(outputs))
				return outputs[index] || getOutputFile(uri, index, null);
			
			if (typeof outputs === 'string' && outputs.slice(-1) === '/') 
				return new net.Uri(net.Uri.combine(outputs, uri.file));
			
			return getOutputFile(uri, index, null);
		}

	}
};
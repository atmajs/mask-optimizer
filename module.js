var atma;
// var atma = global;
// if (atma.mask == null)
// 	atma = global.atma;
if (atma == null || atma.mask == null)
	atma = require('atma-libs/exports');

var mask = atma.mask;



module.exports = {
	minify: function(source){
		return mask.stringify(source);
	},
	minifyFiles: function(mix, outputs) {
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


		files
			.forEach(function(file, index){

				if (io.File.exists(file) === false) {
					console.error('<File not found>', file);
					retur;
				}

				var source = io.File.read(file),
					minified = mask.stringify(source);
				
				new io.File(getOutputFile(file.uri, index, outputs)).write(minified);
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
}
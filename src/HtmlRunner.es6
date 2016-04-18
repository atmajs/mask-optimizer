var DocumentRunner = class_create(class_Dfr, {
	constructor (template, opts)  {
		this.document = IDocument.create(template, opts);
	},
	process () {
		PackageBuilder
			.resolveAssets(this.document)
			.done((assets) => {

			});
	}
});


var HtmlRunner = {
	/* PACKAGE { mask, script, style } */
	process (template, opts) {
		return HtmlBuilder.process(template, opts);
	},
	processFile: function(path, opts){
		var dfr = new mask.class.Deferred;
		if (io.File.exists(path) === false) {
			return dfr.reject(Error('File not found: ' + path));
		}

		var template = io.File.read(path, { skipHooks: true });
		opts.filename = path;
		return HtmlRunner.process(template, opts)
	}
};

var actions = [
	Builder,
	MaskOptimizer,
	MaskSerializer
];
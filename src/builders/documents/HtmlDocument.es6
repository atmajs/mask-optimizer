var HtmlDocument = class_create(IDocument, {
	parse (template) {
		this.ast = require('cheerio').load(template);
	},
	resolveResources () {
		this.scripts = this
			.getScipts()
			.map(el => Uri.combine(this.opts.base, el.attribs.src));

		this.styles = this
			.getStyles()
			.map(el => Uri.combine(this.opts.base, el.attribs.href));
	},
	getScipts () {
		return this
			.ast
			.find('script[src]')
			.filter(el => el.attribs.link !== 'dynamic');
	},
	getStyles () {
		return this
			.ast
			.find('link[href]')
			.filter(el => (el.attribs.rel || '').toLowerCase() === 'stylesheet');
	},
	eachMask (visitor) {
		var arr = this.ast.find('script[type="text/mask"]');
		var tasks = arr.map(el => createElementHandler(el));

		function createElementHandler (el) {
			return function(){
				var text = el.text();
				return visitor(text, this).then(str => {
					if (str != null && text !== str) {
						el.text(str);
					}
				});
			}
		}

		return when.pipeline(tasks);
	},
	toString () {}
});
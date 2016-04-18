var IDocument = class_create({
	scripts: null,
	styles: null,

	constructor (template) {
		this.template = template;
	},

	resolveResources () { throw Error('Not implemented'); },
	eachMask (visitor) { },
	toString () {}
});
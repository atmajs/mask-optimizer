mask.registerOptimizer('link', (node, next) => {
	var attr = node.attr;
	var isStatic = attr.href
		&& /stylesheet/i.test(attr.rel)
		&& /dynamic/i.test(attr.linking) === false;

	next(isStatic ? { remove: true } : null);
});
mask.registerOptimizer('script', (node, next) => {
	var attr = node.attr;
	var isStatic = attr.src
		&& (!attr.type || /javascript/i.test(attr.type))
		&& /dynamic/i.test(attr.linking) === false;

	next(isStatic ? { remove: true } : null);
});
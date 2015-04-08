[
	'function', 'slot', 'event'
].forEach(function (method) {
	mask.registerOptimizer(method, processScript);
})

function processScript(node, next) {
	var fn = __cfg.preprocessor[type] || mask.cfg('preprocessor.' + type);
	if (fn) {
		node.body = fn(node.body);
	}
	next();
}
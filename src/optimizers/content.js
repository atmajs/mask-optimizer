(function(){
	create('script');
	create('style' );
	
	
	function create(name) {
		mask.registerOptimizer(name, createPreprocessor(name));
	}
	function createPreprocessor(type) {
		return function(node, next){
			var fn = __cfg.preprocessor[type] || mask.cfg('preprocessor.' + type);
			if (fn) {
				node.content = fn(node.content);
			}
			next();
		};
	}
}());
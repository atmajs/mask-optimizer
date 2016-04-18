var MaskOptimizer;
(function(){
	MaskOptimizer = {
		process (template, opts) {
			return mask.class.Deferred.run((resolve) => {
				mask.optimize(template, ast => resolve(ast));
			});
		}
	};

	// import optimizers/cleanAssets.es6
	// import optimizers/methods.es6
	// import optimizers/content.es6
}());

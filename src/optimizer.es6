var Optimizer;
(function(){
	Optimizer = {
		process (template, opts, done) {
			return mask.class.Deferred.run((resolve) => {
				mask.optimize(template, ast => resolve(ast));
			});
		}
	};

	// import optimizers/methods
	// import optimizers/content
}());

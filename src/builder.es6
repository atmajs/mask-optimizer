var Builder;
(function(){
	Builder = {
		process (template, opts) {
			return mask.Module.build(template, opts.filename, opts);
		}
	};
	
}());
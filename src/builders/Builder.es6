var Builder;
(function(){
	Builder = class_create({
		writer: null,
		constructor (writer) {
			this.writer = writer;
		},
		build (assets, opts) {
			var dfrs = Builders.map(Builder => {
				return new Builder(this.writer).build(assets, opts)
			});
			return dfr_waitAll(dfrs).then(() => this);
		}
	});


	var IBuilder = class_create({
		writer: null,
		constructor (writer) {
			this.writer = writer;
		},
		build (assets, opts) {

		}
	});

	// import ./MaskBuilder.es6

	var Builders = [
		MaskBuilder,
		//StyleBuilder,
		//ScriptBuilder,
		//DataBuilder
	];
}());
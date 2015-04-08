module.exports = {
	process: function(template, opts){
		return Runner.process(template, opts);
	},
	processFile: function(path, opts) {
		return Runner.processFile(path, opts);
	},
	cfg: function (prop, mix) {
		mask.obj.set(__cfg, prop, mix);
	}
};
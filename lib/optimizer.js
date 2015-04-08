


// source scope
"use strict";

var mask = require("maskjs"),
    io = require("atma-io");
//# sourceMappingURL=scope.es6.map
// end:source scope
// source config
"use strict";

var __cfg = {
	preprocessor: {
		style: null,
		script: null
	}
};
//# sourceMappingURL=config.es6.map
// end:source config

// source minifier
"use strict";

var Minifier = {
	process: function process(source, opts) {
		return mask.stringify(source, opts);
	},
	minifyFiles: function minifyFiles(mix, outputs) {
		var files;

		if (typeof mix === "string") {
			if (mix.indexOf("*") !== -1) files = io.glob.readFiles(mix);else {
				files = [mix];

				if (typeof outputs === "string") outputs = [outputs];
			}
		}

		files.forEach(function (file, index) {
			if (io.File.exists(file) === false) {
				console.error("<File not found>", file);
				retur;
			}

			var source = io.File.read(file),
			    minified = mask.stringify(source);

			io.File.write(getOutputFile(file.uri, index, outputs), minified);
		});

		function getOutputFile(_x, _x2, _x3) {
			var _left;

			var _again = true;

			_function: while (_again) {
				_again = false;
				var uri = _x,
				    index = _x2,
				    outputs = _x3;

				if (outputs == null) {
					return uri.combine(uri.getName() + ".min." + uri.extension);
				}if (Array.isArray(outputs)) {
					if (_left = outputs[index]) {
						return _left;
					}

					_x = uri;
					_x2 = index;
					_x3 = null;
					_again = true;
					continue _function;
				}

				if (typeof outputs === "string" && outputs.slice(-1) === "/") {
					return new net.Uri(net.Uri.combine(outputs, uri.file));
				}_x = uri;
				_x2 = index;
				_x3 = null;
				_again = true;
				continue _function;
			}
		}
	}
};
//# sourceMappingURL=minifier.es6.map
// end:source minifier
// source optimizer
"use strict";

var Optimizer;
(function () {
	Optimizer = {
		process: function process(template, opts, done) {
			return mask["class"].Deferred.run(function (resolve) {
				mask.optimize(template, function (ast) {
					return resolve(ast);
				});
			});
		}
	};

	// source optimizers/methods
	["function", "slot", "event"].forEach(function (method) {
		mask.registerOptimizer(method, processScript);
	});

	function processScript(node, next) {
		var fn = __cfg.preprocessor[type] || mask.cfg("preprocessor." + type);
		if (fn) {
			node.body = fn(node.body);
		}
		next();
	}
	// end:source optimizers/methods
	// source optimizers/content
	(function () {
		create("script");
		create("style");

		function create(name) {
			mask.registerOptimizer(name, createPreprocessor(name));
		}
		function createPreprocessor(type) {
			return function (node, next) {
				var fn = __cfg.preprocessor[type] || mask.cfg("preprocessor." + type);
				if (fn) {
					node.content = fn(node.content);
				}
				next();
			};
		}
	})();
	// end:source optimizers/content
})();
//# sourceMappingURL=optimizer.es6.map
// end:source optimizer
// source builder
"use strict";

var Builder;
(function () {
	Builder = {
		process: function process(template, opts) {
			return mask.Module.build(template, opts.filename, opts);
		}
	};
})();
//# sourceMappingURL=builder.es6.map
// end:source builder
// source runner
"use strict";

var Runner = {
	/* PACKAGE { mask, script, style } */
	process: function process(template, opts) {
		var dfr = new mask["class"].Deferred();
		Builder.process(template, opts).fail(function (error) {
			return dfr.reject(error);
		}).done(function (pckg) {
			Optimizer.process(pckg.mask, opts).fail(function (error) {
				return dfr.reject(error);
			}).done(function (ast) {
				pckg.mask = Minifier.process(ast, { indent: opts.minify ? 0 : 4 });
				dfr.resolve(pckg);
			});
		});
		return dfr;
	},
	processFile: function processFile(path, opts) {
		var dfr = new mask["class"].Deferred();
		if (io.File.exists(path) === false) {
			return dfr.reject(Error("File not found: " + path));
		}

		var template = io.File.read(path, { skipHooks: true });
		opts.filename = path;
		return Runner.process(template, opts);
	}
};
//# sourceMappingURL=runner.es6.map
// end:source runner

// source exports
"use strict";

module.exports = {
	process: function process(template, opts) {
		return Runner.process(template, opts);
	},
	processFile: function processFile(path, opts) {
		return Runner.processFile(path, opts);
	},
	cfg: function cfg(prop, mix) {
		mask.obj.set(__cfg, prop, mix);
	}
};
//# sourceMappingURL=exports.es6.map
// end:source exports
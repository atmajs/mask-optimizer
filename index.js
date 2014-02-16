
if (typeof include === 'undefined' ) 
	throw new Error('<atma-traceur> should be loaded by the `atma` module.');



// `io.File` extension
if (global.io && io.File) {
	io.File.middleware['mask'] = {
		read: function(file, config){
			
			if (config == null) {
				config = global.app 
					&& app.current
					&& app.current.tasks
					&& app.current.tasks[0]
					;
			}
			
			if (config == null || config.minify != true) 
				return;
			
			if (typeof file.content !== 'string')
				file.content = file.content.toString();
			
			file.content = mask.stringify(file.content);
		}
	};

	io
		.File
		.registerExtensions(obj_setProperty({}, 'mask', [ 'mask:read' ]))
		;
}

// `IncludeJS` extension
include.cfg({
	loader: obj_setProperty({}, 'mask', {
		
		process: function(source, resource){
			
			return traceur_compile(source, new net.Uri(resource.url)).js;
		}
	})
});

// Http
var HttpHandler = Class({
	Base: Class.Deferred,
	process: function(req, res, config){
		
		var url = req.url,
			uri = new net.Uri(config.base).combine(url),
			source
			;
		
		source = mask.stringify(io.File.read(uri, config));
		
		this.resolve(source, 200, 'text/x-mask');
	}
});

include.exports = {
	register: function(rootConfig){
		
		rootConfig.$extend({
			
			server: {
				handlers: {
					'(.mask)': HttpHandler
				}
			}
		});
	}
};


	

function obj_setProperty(obj, prop, value){
	obj[prop] = value;
	return obj;
}

function obj_extend(target){
	var imax = arguments.length,
		i = 1,
		obj;
	for(; i < imax; i++){
		obj = arguments[0];
		
		for(var key in obj)
			target[key] = obj[key]
	}

	return target;
}
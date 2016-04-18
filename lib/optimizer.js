


// source /utils/lib/utils.embed.js
// source /src/refs.js
var _Array_slice = Array.prototype.slice,
	_Array_splice = Array.prototype.splice,
	_Array_indexOf = Array.prototype.indexOf,

	_Object_create = null, // in obj.js
	_Object_hasOwnProp = Object.hasOwnProperty,
	_Object_getOwnProp = Object.getOwnPropertyDescriptor,
	_Object_defineProperty = Object.defineProperty;

// end:source /src/refs.js

// source /src/coll.js
var coll_each,
	coll_remove,
	coll_map,
	coll_indexOf,
	coll_find;
(function(){
	coll_each = function(coll, fn, ctx){
		if (ctx == null)
			ctx = coll;
		if (coll == null)
			return coll;

		var imax = coll.length,
			i = 0;
		for(; i< imax; i++){
			fn.call(ctx, coll[i], i);
		}
		return ctx;
	};
	coll_indexOf = function(coll, x){
		if (coll == null)
			return -1;
		var imax = coll.length,
			i = 0;
		for(; i < imax; i++){
			if (coll[i] === x)
				return i;
		}
		return -1;
	};
	coll_remove = function(coll, x){
		var i = coll_indexOf(coll, x);
		if (i === -1)
			return false;
		coll.splice(i, 1);
		return true;
	};
	coll_map = function(coll, fn, ctx){
		var arr = new Array(coll.length);
		coll_each(coll, function(x, i){
			arr[i] = fn.call(this, x, i);
		}, ctx);
		return arr;
	};
	coll_find = function(coll, fn, ctx){
		var imax = coll.length,
			i = 0;
		for(; i < imax; i++){
			if (fn.call(ctx || coll, coll[i], i))
				return true;
		}
		return false;
	};
}());

// end:source /src/coll.js

// source /src/polyfill/arr.js
if (Array.prototype.forEach === void 0) {
	Array.prototype.forEach = function(fn, ctx){
		coll_each(this, fn, ctx);
	};
}
if (Array.prototype.indexOf === void 0) {
	Array.prototype.indexOf = function(x){
		return coll_indexOf(this, x);
	};
}

// end:source /src/polyfill/arr.js
// source /src/polyfill/str.js
if (String.prototype.trim == null){
	String.prototype.trim = function(){
		var start = -1,
			end = this.length,
			code;
		if (end === 0)
			return this;
		while(++start < end){
			code = this.charCodeAt(start);
			if (code > 32)
				break;
		}
		while(--end !== 0){
			code = this.charCodeAt(end);
			if (code > 32)
				break;
		}
		return start !== 0 && end !== length - 1
			? this.substring(start, end + 1)
			: this;
	};
}

// end:source /src/polyfill/str.js
// source /src/polyfill/fn.js

if (Function.prototype.bind == null) {
	var _Array_slice;
	Function.prototype.bind = function(){
		if (arguments.length < 2 && typeof arguments[0] === "undefined")
			return this;
		var fn = this,
			args = _Array_slice.call(arguments),
			ctx = args.shift();
		return function() {
			return fn.apply(ctx, args.concat(_Array_slice.call(arguments)));
		};
	};
}

// end:source /src/polyfill/fn.js

// source /src/is.js
var is_Function,
	is_Array,
	is_ArrayLike,
	is_String,
	is_Object,
	is_notEmptyString,
	is_rawObject,
	is_Date,
	is_NODE,
	is_DOM;

(function() {
	is_Function = function(x) {
		return typeof x === 'function';
	};
	is_Object = function(x) {
		return x != null && typeof x === 'object';
	};
	is_Array = is_ArrayLike = function(arr) {
		return arr != null
			&& typeof arr === 'object'
			&& typeof arr.length === 'number'
			&& typeof arr.slice === 'function'
			;
	};
	is_String = function(x) {
		return typeof x === 'string';
	};
	is_notEmptyString = function(x) {
		return typeof x === 'string' && x !== '';
	};
	is_rawObject = function(obj) {
		if (obj == null || typeof obj !== 'object')
			return false;

		return obj.constructor === Object;
	};
	is_Date = function(x) {
		if (x == null || typeof x !== 'object') {
			return false;
		}
		if (x.getFullYear != null && isNaN(x) === false) {
			return true;
		}
		return false;
	};
	is_DOM = typeof window !== 'undefined' && window.navigator != null;
	is_NODE = !is_DOM;

}());

// end:source /src/is.js
// source /src/obj.js
var obj_getProperty,
	obj_setProperty,
	obj_hasProperty,
	obj_extend,
	obj_extendDefaults,
	obj_extendMany,
	obj_extendProperties,
	obj_extendPropertiesDefaults,
	obj_create,
	obj_toFastProps,
	obj_defineProperty;
(function(){
	obj_getProperty = function(obj_, path){
		if ('.' === path) // obsolete
			return obj_;

		var obj = obj_,
			chain = path.split('.'),
			imax = chain.length,
			i = -1;
		while ( obj != null && ++i < imax ) {
			obj = obj[chain[i]];
		}
		return obj;
	};
	obj_setProperty = function(obj_, path, val) {
		var obj = obj_,
			chain = path.split('.'),
			imax = chain.length - 1,
			i = -1,
			key;
		while ( ++i < imax ) {
			key = chain[i];
			if (obj[key] == null)
				obj[key] = {};

			obj = obj[key];
		}
		obj[chain[i]] = val;
	};
	obj_hasProperty = function(obj, path) {
		var x = obj_getProperty(obj, path);
		return x !== void 0;
	};
	obj_defineProperty = function(obj, path, dscr) {
		var x = obj,
			chain = path.split('.'),
			imax = chain.length - 1,
			i = -1, key;
		while (++i < imax) {
			key = chain[i];
			if (x[key] == null)
				x[key] = {};
			x = x[key];
		}
		key = chain[imax];
		if (_Object_defineProperty) {
			if (dscr.writable	 === void 0) dscr.writable	 = true;
			if (dscr.configurable === void 0) dscr.configurable = true;
			if (dscr.enumerable   === void 0) dscr.enumerable   = true;
			_Object_defineProperty(x, key, dscr);
			return;
		}
		x[key] = dscr.value === void 0
			? dscr.value
			: (dscr.get && dscr.get());
	};
	obj_extend = function(a, b){
		if (b == null)
			return a || {};

		if (a == null)
			return obj_create(b);

		for(var key in b){
			a[key] = b[key];
		}
		return a;
	};
	obj_extendDefaults = function(a, b){
		if (b == null)
			return a || {};
		if (a == null)
			return obj_create(b);

		for(var key in b) {
			if (a[key] == null) {
				a[key] = b[key];
				continue;
			}
			if (key === 'toString' && a[key] === Object.prototype.toString) {
				a[key] = b[key];
			}
		}
		return a;
	}
	var extendPropertiesFactory = function(overwriteProps){
		if (_Object_getOwnProp == null)
			return overwriteProps ? obj_extend : obj_extendDefaults;

		return function(a, b){
			if (b == null)
				return a || {};

			if (a == null)
				return obj_create(b);

			var key, descr, ownDescr;
			for(key in b){
				descr = _Object_getOwnProp(b, key);
				if (descr == null)
					continue;
				if (overwriteProps !== true) {
					ownDescr = _Object_getOwnProp(a, key);
					if (ownDescr != null) {
						continue;
					}
				}
				if (descr.hasOwnProperty('value')) {
					a[key] = descr.value;
					continue;
				}
				_Object_defineProperty(a, key, descr);
			}
			return a;
		};
	};

	obj_extendProperties		 = extendPropertiesFactory(true);
	obj_extendPropertiesDefaults = extendPropertiesFactory(false );

	obj_extendMany = function(a){
		var imax = arguments.length,
			i = 1;
		for(; i<imax; i++) {
			a = obj_extend(a, arguments[i]);
		}
		return a;
	};
	obj_toFastProps = function(obj){
		/*jshint -W027*/
		function F() {}
		F.prototype = obj;
		new F();
		return;
		eval(obj);
	};
	_Object_create = obj_create = Object.create || function(x) {
		var Ctor = function(){};
		Ctor.prototype = x;
		return new Ctor;
	};
}());

// end:source /src/obj.js
// source /src/arr.js
var arr_remove,
	arr_each,
	arr_indexOf,
	arr_contains,
	arr_pushMany;
(function(){
	arr_remove = function(array, x){
		var i = array.indexOf(x);
		if (i === -1)
			return false;
		array.splice(i, 1);
		return true;
	};
	arr_each = function(arr, fn, ctx){
		arr.forEach(fn, ctx);
	};
	arr_indexOf = function(arr, x){
		return arr.indexOf(x);
	};
	arr_contains = function(arr, x){
		return arr.indexOf(x) !== -1;
	};
	arr_pushMany = function(arr, arrSource){
		if (arrSource == null || arr == null || arr === arrSource)
			return;

		var il = arr.length,
			jl = arrSource.length,
			j = -1
			;
		while( ++j < jl ){
			arr[il + j] = arrSource[j];
		}
	};
}());

// end:source /src/arr.js
// source /src/fn.js
var fn_proxy,
	fn_apply,
	fn_doNothing,
	fn_createByPattern;
(function(){
	fn_proxy = function(fn, ctx) {
		return function(){
			var imax = arguments.length,
				args = new Array(imax),
				i = 0;
			for(; i<imax; i++) args[i] = arguments[i];
			return fn_apply(fn, ctx, args);
		};
	};

	fn_apply = function(fn, ctx, args){
		var l = args.length;
		if (0 === l)
			return fn.call(ctx);
		if (1 === l)
			return fn.call(ctx, args[0]);
		if (2 === l)
			return fn.call(ctx, args[0], args[1]);
		if (3 === l)
			return fn.call(ctx, args[0], args[1], args[2]);
		if (4 === l)
			return fn.call(ctx, args[0], args[1], args[2], args[3]);

		return fn.apply(ctx, args);
	};

	fn_doNothing = function(){
		return false;
	};

	fn_createByPattern = function(definitions, ctx){
		var imax = definitions.length;
		return function(){
			var l = arguments.length,
				i = -1,
				def;

			outer: while(++i < imax){
				def = definitions[i];
				if (def.pattern.length !== l) {
					continue;
				}
				var j = -1;
				while(++j < l){
					var fn  = def.pattern[j];
					var val = arguments[j];
					if (fn(val) === false) {
						continue outer;
					}
				}
				return def.handler.apply(ctx, arguments);
			}

			console.error('InvalidArgumentException for a function', definitions, arguments);
			return null;
		};
	};

}());

// end:source /src/fn.js
// source /src/str.js
var str_format,
	str_dedent;
(function(){
	str_format = function(str_){
		var str = str_,
			imax = arguments.length,
			i = 0, x;
		while ( ++i < imax ){
			x = arguments[i];
			if (is_Object(x) && x.toJSON) {
				x = x.toJSON();
			}
			str_ = str_.replace(rgxNum(i - 1), String(x));
		}

		return str_;
	};
	str_dedent = function(str) {
		var rgx = /^[\t ]*\S/gm,
			match = rgx.exec(str),
			count = -1;
		while(match != null) {			
			var x = match[0].length;
			if (count === -1 || x < count) count = x;
			match = rgx.exec(str);
		}		
		if (--count < 1)
			return str;

		var replacer = new RegExp('^[\\t ]{1,' + count + '}', 'gm');		
		return str
			.replace(replacer, '')
			.replace(/^[\t ]*\r?\n/,'')
			.replace(/\r?\n[\t ]*$/,'')
			;
	};
	var rgxNum;
	(function(){
		rgxNum = function(num){
			return cache_[num] || (cache_[num] = new RegExp('\\{' + num + '\\}', 'g'));
		};
		var cache_ = {};
	}());
}());

// end:source /src/str.js
// source /src/class.js
/**
 * create([...Base], Proto)
 * Base: Function | Object
 * Proto: Object {
 *    constructor: ?Function
 *    ...
 */
var class_create,

	// with property accessor functions support
	class_createEx;
(function(){

	class_create   = createClassFactory(obj_extendDefaults);
	class_createEx = createClassFactory(obj_extendPropertiesDefaults);

	function createClassFactory(extendDefaultsFn) {
		return function(){
			var args = _Array_slice.call(arguments),
				Proto = args.pop();
			if (Proto == null)
				Proto = {};

			var Ctor = Proto.hasOwnProperty('constructor')
				? Proto.constructor
				: function ClassCtor () {};

			var i = args.length,
				BaseCtor, x;
			while ( --i > -1 ) {
				x = args[i];
				if (typeof x === 'function') {
					BaseCtor = wrapFn(x, BaseCtor);
					x = x.prototype;
				}
				extendDefaultsFn(Proto, x);
			}
			return createClass(wrapFn(BaseCtor, Ctor), Proto);
		};
	}

	function createClass(Ctor, Proto) {
		Proto.constructor = Ctor;
		Ctor.prototype = Proto;
		return Ctor;
	}
	function wrapFn(fnA, fnB) {
		if (fnA == null) {
			return fnB;
		}
		if (fnB == null) {
			return fnA;
		}
		return function(){
			var args = _Array_slice.call(arguments);
			var x = fnA.apply(this, args);
			if (x !== void 0)
				return x;

			return fnB.apply(this, args);
		};
	}
}());

// end:source /src/class.js
// source /src/error.js
var error_createClass,
	error_formatSource,
	error_formatCursor,
	error_cursor;

(function(){
	error_createClass = function(name, Proto, stackSliceFrom){
		var Ctor = _createCtor(Proto, stackSliceFrom);
		Ctor.prototype = new Error;

		Proto.constructor = Error;
		Proto.name = name;
		obj_extend(Ctor.prototype, Proto);
		return Ctor;
	};

	error_formatSource = function(source, index, filename) {
		var cursor  = error_cursor(source, index),
			lines   = cursor[0],
			lineNum = cursor[1],
			rowNum  = cursor[2],
			str = '';
		if (filename != null) {
			str += str_format(' at {0}({1}:{2})\n', filename, lineNum, rowNum);
		}
		return str + error_formatCursor(lines, lineNum, rowNum);
	};

	/**
	 * @returns [ lines, lineNum, rowNum ]
	 */
	error_cursor = function(str, index){
		var lines = str.substring(0, index).split('\n'),
			line = lines.length,
			row = index + 1 - lines.slice(0, line - 1).join('\n').length;
		if (line > 1) {
			// remote trailing newline
			row -= 1;
		}
		return [str.split('\n'), line, row];
	};

	(function(){
		error_formatCursor = function(lines, lineNum, rowNum) {

			var BEFORE = 3,
				AFTER  = 2,
				i = lineNum - BEFORE,
				imax   = i + BEFORE + AFTER,
				str  = '';

			if (i < 0) i = 0;
			if (imax > lines.length) imax = lines.length;

			var lineNumberLength = String(imax).length,
				lineNumber;

			for(; i < imax; i++) {
				if (str)  str += '\n';

				lineNumber = ensureLength(i + 1, lineNumberLength);
				str += lineNumber + '|' + lines[i];

				if (i + 1 === lineNum) {
					str += '\n' + repeat(' ', lineNumberLength + 1);
					str += lines[i].substring(0, rowNum - 1).replace(/[^\s]/g, ' ');
					str += '^';
				}
			}
			return str;
		};

		function ensureLength(num, count) {
			var str = String(num);
			while(str.length < count) {
				str += ' ';
			}
			return str;
		}
		function repeat(char_, count) {
			var str = '';
			while(--count > -1) {
				str += char_;
			}
			return str;
		}
	}());

	function _createCtor(Proto, stackFrom){
		var Ctor = Proto.hasOwnProperty('constructor')
			? Proto.constructor
			: null;

		return function(){
			obj_defineProperty(this, 'stack', {
				value: _prepairStack(stackFrom || 3)
			});
			obj_defineProperty(this, 'message', {
				value: str_format.apply(this, arguments)
			});
			if (Ctor != null) {
				Ctor.apply(this, arguments);
			}
		};
	}

	function _prepairStack(sliceFrom) {
		var stack = new Error().stack;
		return stack == null ? null : stack
			.split('\n')
			.slice(sliceFrom)
			.join('\n');
	}

}());

// end:source /src/error.js

// source /src/class/Dfr.js
var class_Dfr;
(function(){
	class_Dfr = function(){};
	class_Dfr.prototype = {
		_isAsync: true,
		_done: null,
		_fail: null,
		_always: null,
		_resolved: null,
		_rejected: null,

		defer: function(){
			this._rejected = null;
			this._resolved = null;
			return this;
		},
		isResolved: function(){
			return this._resolved != null;
		},
		isRejected: function(){
			return this._rejected != null;
		},
		isBusy: function(){
			return this._resolved == null && this._rejected == null;
		},
		resolve: function() {
			var done = this._done,
				always = this._always
				;

			this._resolved = arguments;

			dfr_clearListeners(this);
			arr_callOnce(done, this, arguments);
			arr_callOnce(always, this, [ this ]);

			return this;
		},
		reject: function() {
			var fail = this._fail,
				always = this._always
				;

			this._rejected = arguments;

			dfr_clearListeners(this);
			arr_callOnce(fail, this, arguments);
			arr_callOnce(always, this, [ this ]);
			return this;
		},
		then: function(filterSuccess, filterError){
			return this.pipe(filterSuccess, filterError);
		},
		done: function(callback) {
			if (this._rejected != null)
				return this;
			return dfr_bind(
				this,
				this._resolved,
				this._done || (this._done = []),
				callback
			);
		},
		fail: function(callback) {
			if (this._resolved != null)
				return this;
			return dfr_bind(
				this,
				this._rejected,
				this._fail || (this._fail = []),
				callback
			);
		},
		always: function(callback) {
			return dfr_bind(
				this,
				this._rejected || this._resolved,
				this._always || (this._always = []),
				callback
			);
		},
		pipe: function(mix /* ..methods */){
			var dfr;
			if (typeof mix === 'function') {
				dfr = new class_Dfr;
				var done_ = mix,
					fail_ = arguments.length > 1
						? arguments[1]
						: null;

				this
					.done(delegate(dfr, 'resolve', done_))
					.fail(delegate(dfr, 'reject',  fail_))
					;
				return dfr;
			}

			dfr = mix;
			var imax = arguments.length,
				done = imax === 1,
				fail = imax === 1,
				i = 0, x;
			while( ++i < imax ){
				x = arguments[i];
				switch(x){
					case 'done':
						done = true;
						break;
					case 'fail':
						fail = true;
						break;
					default:
						console.error('Unsupported pipe channel', arguments[i])
						break;
				}
			}
			done && this.done(delegate(dfr, 'resolve'));
			fail && this.fail(delegate(dfr, 'reject' ));

			function pipe(dfr, method) {
				return function(){
					dfr[method].apply(dfr, arguments);
				};
			}
			function delegate(dfr, name, fn) {
				return function(){
					if (fn != null) {
						var override = fn.apply(this, arguments);
						if (override != null) {
							if (isDeferred(override) === true) {
								override.pipe(dfr);
								return;
							}

							dfr[name](override)
							return;
						}
					}
					dfr[name].apply(dfr, arguments);
				};
			}

			return this;
		},
		pipeCallback: function(){
			var self = this;
			return function(error){
				if (error != null) {
					self.reject(error);
					return;
				}
				var args = _Array_slice.call(arguments, 1);
				fn_apply(self.resolve, self, args);
			};
		},
		resolveDelegate: function(){
			return fn_proxy(this.resolve, this);
		},
		
		rejectDelegate: function(){
			return fn_proxy(this.reject, this);
		},
		
	};

	class_Dfr.run = function(fn, ctx){
		var dfr = new class_Dfr();
		if (ctx == null)
			ctx = dfr;

		fn.call(
			ctx
			, fn_proxy(dfr.resolve, ctx)
			, fn_proxy(dfr.reject, dfr)
			, dfr
		);
		return dfr;
	};

	// PRIVATE

	function dfr_bind(dfr, arguments_, listeners, callback){
		if (callback == null)
			return dfr;

		if ( arguments_ != null)
			fn_apply(callback, dfr, arguments_);
		else
			listeners.push(callback);

		return dfr;
	}

	function dfr_clearListeners(dfr) {
		dfr._done = null;
		dfr._fail = null;
		dfr._always = null;
	}

	function arr_callOnce(arr, ctx, args) {
		if (arr == null)
			return;

		var imax = arr.length,
			i = -1,
			fn;
		while ( ++i < imax ) {
			fn = arr[i];

			if (fn)
				fn_apply(fn, ctx, args);
		}
		arr.length = 0;
	}
	function isDeferred(x){
		if (x == null || typeof x !== 'object')
			return false;

		if (x instanceof class_Dfr)
			return true;

		return typeof x.done === 'function'
			&& typeof x.fail === 'function'
			;
	}
}());

// end:source /src/class/Dfr.js
// source /src/class/EventEmitter.js
var class_EventEmitter;
(function(){

	class_EventEmitter = function() {
		this._listeners = {};
	};
	class_EventEmitter.prototype = {
		on: function(event, fn) {
			if (fn != null){
				(this._listeners[event] || (this._listeners[event] = [])).push(fn);
			}
			return this;
		},
		once: function(event, fn){
			if (fn != null) {
				fn._once = true;
				(this._listeners[event] || (this._listeners[event] = [])).push(fn);
			}
			return this;
		},

		pipe: function(event){
			var that = this,
				args;
			return function(){
				args = _Array_slice.call(arguments);
				args.unshift(event);
				fn_apply(that.trigger, that, args);
			};
		},

		emit: event_trigger,
		trigger: event_trigger,

		off: function(event, fn) {
			var listeners = this._listeners[event];
			if (listeners == null)
				return this;

			if (arguments.length === 1) {
				listeners.length = 0;
				return this;
			}

			var imax = listeners.length,
				i = -1;
			while (++i < imax) {

				if (listeners[i] === fn) {
					listeners.splice(i, 1);
					i--;
					imax--;
				}

			}
			return this;
		}
	};

	function event_trigger() {
		var args = _Array_slice.call(arguments),
			event = args.shift(),
			fns = this._listeners[event],
			fn, imax, i = 0;

		if (fns == null)
			return this;

		for (imax = fns.length; i < imax; i++) {
			fn = fns[i];
			fn_apply(fn, this, args);

			if (fn._once === true){
				fns.splice(i, 1);
				i--;
				imax--;
			}
		}
		return this;
	}
}());

// end:source /src/class/EventEmitter.js
// source /src/class/Uri.es6
"use strict";

var class_Uri;
(function () {

	class_Uri = class_create({
		protocol: null,
		value: null,
		path: null,
		file: null,
		extension: null,

		constructor: function constructor(uri) {
			if (uri == null) {
				return this;
			}if (util_isUri(uri)) {
				return uri.combine("");
			}uri = normalize_uri(uri);

			this.value = uri;

			parse_protocol(this);
			parse_host(this);

			parse_search(this);
			parse_file(this);

			// normilize path - "/some/path"
			this.path = normalize_pathsSlashes(this.value);

			if (/^[\w]+:\//.test(this.path)) {
				this.path = "/" + this.path;
			}
			return this;
		},
		cdUp: function cdUp() {
			var path = this.path;
			if (path == null || path === "" || path === "/") {
				return this;
			}

			// win32 - is base drive
			if (/^\/?[a-zA-Z]+:\/?$/.test(path)) {
				return this;
			}

			this.path = path.replace(/\/?[^\/]+\/?$/i, "");
			return this;
		},
		/**
   * '/path' - relative to host
   * '../path', 'path','./path' - relative to current path
   */
		combine: function combine(path) {

			if (util_isUri(path)) {
				path = path.toString();
			}

			if (!path) {
				return util_clone(this);
			}

			if (rgx_win32Drive.test(path)) {
				return new class_Uri(path);
			}

			var uri = util_clone(this);

			uri.value = path;

			parse_search(uri);
			parse_file(uri);

			if (!uri.value) {
				return uri;
			}

			path = uri.value.replace(/^\.\//i, "");

			if (path[0] === "/") {
				uri.path = path;
				return uri;
			}

			while (/^(\.\.\/?)/ig.test(path)) {
				uri.cdUp();
				path = path.substring(3);
			}

			uri.path = normalize_pathsSlashes(util_combinePathes(uri.path, path));

			return uri;
		},
		toString: function toString() {
			var protocol = this.protocol ? this.protocol + "://" : "";
			var path = util_combinePathes(this.host, this.path, this.file) + (this.search || "");
			var str = protocol + path;

			if (!(this.file || this.search)) {
				str += "/";
			}
			return str;
		},
		toPathAndQuery: function toPathAndQuery() {
			return util_combinePathes(this.path, this.file) + (this.search || "");
		},
		/**
   * @return Current Uri Path{String} that is relative to @arg1 Uri
   */
		toRelativeString: function toRelativeString(uri) {
			if (typeof uri === "string") uri = new class_Uri(uri);

			if (this.path.indexOf(uri.path) === 0) {
				// host folder
				var p = this.path ? this.path.replace(uri.path, "") : "";
				if (p[0] === "/") p = p.substring(1);

				return util_combinePathes(p, this.file) + (this.search || "");
			}

			// sub folder
			var current = this.path.split("/"),
			    relative = uri.path.split("/"),
			    commonpath = "",
			    i = 0,
			    length = Math.min(current.length, relative.length);

			for (; i < length; i++) {
				if (current[i] === relative[i]) continue;

				break;
			}

			if (i > 0) commonpath = current.splice(0, i).join("/");

			if (commonpath) {
				var sub = "",
				    path = uri.path,
				    forward;
				while (path) {
					if (this.path.indexOf(path) === 0) {
						forward = this.path.replace(path, "");
						break;
					}
					path = path.replace(/\/?[^\/]+\/?$/i, "");
					sub += "../";
				}
				return util_combinePathes(sub, forward, this.file);
			}

			return this.toString();
		},

		toLocalFile: function toLocalFile() {
			var path = util_combinePathes(this.host, this.path, this.file);

			return util_win32Path(path);
		},
		toLocalDir: function toLocalDir() {
			var path = util_combinePathes(this.host, this.path, "/");

			return util_win32Path(path);
		},
		toDir: function toDir() {
			var str = this.protocol ? this.protocol + "://" : "";

			return str + util_combinePathes(this.host, this.path, "/");
		},
		isRelative: function isRelative() {
			return !(this.protocol || this.host);
		},
		getName: function getName() {
			return this.file.replace("." + this.extension, "");
		}
	});

	var rgx_protocol = /^([a-zA-Z]+):\/\//,
	    rgx_extension = /\.([\w\d]+)$/i,
	    rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/,
	    rgx_fileWithExt = /([^\/]+(\.[\w\d]+)?)$/i;

	function util_isUri(object) {
		return object && typeof object === "object" && typeof object.combine === "function";
	}

	function util_combinePathes() {
		var args = arguments,
		    str = "";
		for (var i = 0, x, imax = arguments.length; i < imax; i++) {
			x = arguments[i];
			if (!x) continue;

			if (!str) {
				str = x;
				continue;
			}

			if (str[str.length - 1] !== "/") str += "/";

			str += x[0] === "/" ? x.substring(1) : x;
		}
		return str;
	}

	function normalize_pathsSlashes(str) {

		if (str[str.length - 1] === "/") {
			return str.substring(0, str.length - 1);
		}
		return str;
	}

	function util_clone(source) {
		var uri = new class_Uri(),
		    key;
		for (key in source) {
			if (typeof source[key] === "string") {
				uri[key] = source[key];
			}
		}
		return uri;
	}

	function normalize_uri(str) {
		return str.replace(/\\/g, "/").replace(/^\.\//, "")

		// win32 drive path
		.replace(/^(\w+):\/([^\/])/, "/$1:/$2");
	}

	function util_win32Path(path) {
		if (rgx_win32Drive.test(path) && path[0] === "/") {
			return path.substring(1);
		}
		return path;
	}

	function parse_protocol(obj) {
		var match = rgx_protocol.exec(obj.value);

		if (match == null && obj.value[0] === "/") {
			obj.protocol = "file";
		}

		if (match == null) {
			return;
		}obj.protocol = match[1];
		obj.value = obj.value.substring(match[0].length);
	}

	function parse_host(obj) {
		if (obj.protocol == null) {
			return;
		}if (obj.protocol === "file") {
			var match = rgx_win32Drive.exec(obj.value);
			if (match) {
				obj.host = match[1];
				obj.value = obj.value.substring(obj.host.length);
			}
			return;
		}

		var pathStart = obj.value.indexOf("/", 2);

		obj.host = ~pathStart ? obj.value.substring(0, pathStart) : obj.value;

		obj.value = obj.value.replace(obj.host, "");
	}

	function parse_search(obj) {
		var question = obj.value.indexOf("?");
		if (question === -1) {
			return;
		}obj.search = obj.value.substring(question);
		obj.value = obj.value.substring(0, question);
	}

	function parse_file(obj) {
		var match = rgx_fileWithExt.exec(obj.value),
		    file = match == null ? null : match[1];

		if (file == null) {
			return;
		}
		obj.file = file;
		obj.value = obj.value.substring(0, obj.value.length - file.length);
		obj.value = normalize_pathsSlashes(obj.value);

		match = rgx_extension.exec(file);
		obj.extension = match == null ? null : match[1];
	}

	class_Uri.combinePathes = util_combinePathes;
	class_Uri.combine = util_combinePathes;
})();
/*args*/
//# sourceMappingURL=Uri.es6.map
// end:source /src/class/Uri.es6
// end:source /utils/lib/utils.embed.js
// source /maskjs/src/util/path.js
var path_getDir,
	path_getFile,
	path_getExtension,
	path_resolveCurrent,
	path_normalize,
	path_resolveUrl,
	path_combine,
	path_isRelative,
	path_toRelative,
	path_appendQuery,
	path_toLocalFile
	;
(function(){
	var isWeb = true;

	path_getDir = function(path) {
		return path.substring(0, path.lastIndexOf('/') + 1);
	};
	path_getFile = function(path) {
		path = path
			.replace('file://', '')
			.replace(/\\/g, '/')
			.replace(/\?[^\n]+$/, '');

		if (/^\/\w+:\/[^\/]/i.test(path)){
			// win32 drive
			return path.substring(1);
		}
		return path;
	};
	path_getExtension = function(path) {
		var query = path.indexOf('?');
		if (query !== -1) {
			path = path.substring(0, query);
		}
		var match = rgx_EXT.exec(path);
		return match == null ? '' : match[1];
	};

	path_appendQuery = function(path, key, val){
		var conjunctor = path.indexOf('?') === -1 ? '?' : '&';
		return path + conjunctor + key + '=' + val;
	};

	(function(){
		var current_;

		// if (BROWSER)
		path_resolveCurrent = function(){
			if (current_ != null) return current_;

			var fn = 'baseURI' in global.document
					? fromBase
					: fromLocation;
			return (current_ = path_sliceFilename(fn()));
		};
		function fromBase() {
			return global.document.baseURI;
		}
		function fromLocation() {
			return global.location.origin + global.location.pathname;
		}
		// endif

		// if (NODE)
		path_resolveCurrent = function(){
			if (current_ != null) return current_;
			return (current_ = path_win32Normalize(process.cwd()));
		};
		// endif
	}());


	path_normalize = function(path) {
		var path_ = path
			.replace(/\\/g, '/')
			// remove double slashes, but not near protocol
			.replace(/([^:\/])\/{2,}/g, '$1/')
			// './xx' to relative string
			.replace(/^\.\//, '')
			// join 'xx/./xx'
			.replace(/\/\.\//g, '/')
			;
		return path_collapse(path_);
	};
	path_resolveUrl = function(path, base) {
		var url = path_normalize(path);
		if (path_isRelative(url)) {
			return path_normalize(path_combine(base || path_resolveCurrent(), url));
		}
		if (rgx_PROTOCOL.test(url))
			return url;

		if (url.charCodeAt(0) === 47 /*/*/) {
			if (__cfg.base) {
				return path_combine(__cfg.base, url);
			}
		}
		return url;
	};
	path_isRelative = function(path) {
		var c = path.charCodeAt(0);
		switch (c) {
			case 47:
				// /
				return false;
			case 102:
			case 104:
				// f || h
				return rgx_PROTOCOL.test(path) === false;
		}
		return true;
	};
	path_toRelative = function(path, anchor, base){
		var path_     = path_resolveUrl(path_normalize(path), base),
			absolute_ = path_resolveUrl(path_normalize(anchor), base);

		if (path_getExtension(absolute_) !== '') {
			absolute_ = path_getDir(absolute_);
		}
		absolute_ = path_combine(absolute_, '/');
		if (path_.toUpperCase().indexOf(absolute_.toUpperCase()) === 0) {
			return path_.substring(absolute_.length);
		}
		return path;
	};

	path_combine = function() {
		var out = '',
			imax = arguments.length,
			i = -1, x;
		while ( ++i < imax ){
			x = arguments[i];
			if (!x)  continue;

			x = path_normalize(x);
			if (out === '') {
				out = x;
				continue;
			}
			if (out[out.length - 1] !== '/') {
				out += '/'
			}
			if (x[0] === '/') {
				x = x.substring(1);
			}
			out += x;
		}
		return path_collapse(out);
	};

	// if NODE
	(function(){
		path_toLocalFile = function(path){
			path = path_normalize(path);
			if (path_isRelative(path)) {
				path = '/' + path;
			}
			if (path.charCodeAt(0) === 47 /*/*/) {
				return path_combine(cwd(), path);
			}
			if (path.indexOf('file://') === 0) {
				path = path.replace('file://', '');
			}
			if (/^\/\w+:\//.test(path)) {
				path = path.substring(1);
			}
			return path;
		};

		var _cwd;
		function cwd() {
			return _cwd || (_cwd = path_normalize(process.cwd()));
		}
	}());
	// endif

	var rgx_PROTOCOL = /^(file|https?):/i,
		rgx_SUB_DIR  = /[^\/\.]+\/\.\.\//,
		rgx_FILENAME = /\/[^\/]+\.\w+(\?.*)?(#.*)?$/,
		rgx_EXT      = /\.(\w+)$/,
		rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/
		;

	function path_win32Normalize (path){
		path = path_normalize(path);
		if (path.substring(0, 5) === 'file:')
			return path;

		return 'file://' + path;
	}

	function path_collapse(url_) {
		var url = url_;
		while (rgx_SUB_DIR.test(url)) {
			url = url.replace(rgx_SUB_DIR, '');
		}
		return url;
	}
	function path_ensureTrailingSlash(path) {
		if (path.charCodeAt(path.length - 1) === 47 /* / */)
			return path;

		return path + '/';
	}
	function path_sliceFilename(path) {
		return path_ensureTrailingSlash(path.replace(rgx_FILENAME, ''));
	}

}());

// end:source /maskjs/src/util/path.js

// source scope
"use strict";

var mask = require("maskjs"),
    io = require("atma-io"),
    _ = require("atma-utils");

var class_create = mask["class"].create,
    class_Dfr = mask["class"].Deferred,
    Uri = _.class_Uri;
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

// source utils/dfr
"use strict";

var dfr_waitAll;
(function () {
	dfr_waitAll = function (dfrs) {
		return class_Dfr.run(function (resolve, reject) {
			var count = dfrs.length;
			var arr = new Array(count);
			var error;

			dfrs.forEach(function (dfr, i) {
				return dfr.then(function (val) {
					return tick(null, val, i);
				}, tick);
			});

			function tick(err, val, i) {
				if (error != null) {
					return;
				}
				if (err) {
					reject(error = err);
					return;
				}
				arr[i] = val;
				if (--count === 0) {
					resolve(arr);
				}
			}
		});
	};
})();
//# sourceMappingURL=dfr.es6.map
// end:source utils/dfr

// source assets/Assets
"use strict";

var Assets;
(function () {

	//source ./util/asset.es6
	"use strict";

	var asset_clone, asset_makeConsistent, asset_resolvePath;

	(function () {

		asset_clone = function (asset, deep) {
			var clone = new Asset();
			clone.type = asset.type;
			clone.mode = asset.mode;
			clone.path = asset.path;
			clone.bundle = asset.bundle;
			clone.linking = asset.linking;

			if (deep && is_Array(asset.assets)) {
				clone.assets = asset.assets.map(function (x) {
					return asset_clone(x, true);
				});
			}
			return clone;
		};

		(function () {
			asset_makeConsistent = function (target, source) {
				if (target.type !== source.type) {
					throw new Error("Resource type of different types " + target.type + ":" + source.type + " for '" + source.path + "'");
				}
				if (target.linking !== source.linking) {
					target.linking = select(["static", "dynamic"], target.linking, source.linking);
				}
				if (target.mode !== source.mode) {
					target.mode = select(["both", "client", "server"], target.mode, source.mode);
				}
			};
			function select(prefer, valA, valB) {
				var iA = prefer.indexOf(valA),
				    iB = prefer.indexOf(valB);
				if (iA === -1 || iB === -1) {
					throw Error("Value not found in preferred collection. Values: " + valA + " " + valB);
				}
				if (iA <= iB) {
					return valA;
				}
				return valB;
			}
		})();

		asset_resolvePath = function (endpoint, location) {
			var type = mask.Module.getType(endpoint);
			var path = endpoint.path;
			if ((type == null || type === "mask") && path_getExtension(path) === "") {
				path += ".mask";
			}
			if (path_isRelative(path)) {
				path = path_combine(location, path);
			}
			return path_normalize(path);
		};
	})();
	//# sourceMappingURL=asset.es6.map
	//end:source ./util/asset.es6
	//source ./util/flattern.es6
	"use strict";

	var flattern;
	(function () {
		flattern = function (assets) {
			return distinct(get(assets, []));
		};

		function get(assets, stack) {
			if (assets == null) {
				return stack;
			}
			var arr = assets,
			    imax = arr.length,
			    i = -1,
			    x;
			while (++i < imax) {
				x = arr[i];
				if (typeof x === "string") {
					throw Error("Unsupported. Code block remote on next iteration");
					stack.unshift(x);
					continue;
				}
				// assume is an object { path, dependencies[] }
				stack.unshift(asset_clone(x, false));
				get(x.assets, stack);
			}
			return stack;
		}
		function distinct(stack) {
			for (var i = 0; i < stack.length; i++) {
				for (var j = i + 1; j < stack.length; j++) {
					if (stack[i].path === stack[j].path) {
						asset_makeConsistent(stack[i], stack[j]);
						stack.splice(j, 1);
						j--;
					}
				}
			}
			return stack;
		}
	})();
	//# sourceMappingURL=flattern.es6.map
	//end:source ./util/flattern.es6
	//source ./Models.es6
	"use strict";

	var Asset = class_create({
		type: "", //'script|style|mask|html|data|text',
		linking: "static", //'dynamic|static',
		mode: "both", //'server|client|both',
		path: "",
		bundle: "",
		assets: null, // [ Asset ]
		toJSON: function toJSON() {
			var asset = asset_clone(this, false);
			if (this.assets) {
				asset.assets = this.assets.toJSON();
			}
			return asset;
		}
	});

	Asset.fromPath = function (path, opts) {
		var type = mask.Module.getType({ path: path });
		var asset = new Asset();
		asset.path = path;
		asset.type = type;
		obj_extend(asset, opts);
		return asset;
	};

	var AssetsCollection = class_create({
		groupBy: function groupBy(property) {
			var groups = {};
			this.forEach(function (item) {
				var val = item[property];
				var arr = groups[val];
				if (arr == null) {
					arr = groups[val] = new AssetsCollection();
				}
				arr.push(item);
			});
			return groups;
		},
		toJSON: function toJSON() {
			return this.map(function (x) {
				return x && x.toJSON();
			});
		}
	}, new Array());
	//# sourceMappingURL=Models.es6.map
	//end:source ./Models.es6
	//source ./TagAssetsResolver.es6
	"use strict";

	var TagAssetsResolver = {};
	(function () {

		//source ./tag-assets/import.es6
		"use strict";

		TagAssetsResolver["import"] = {
			getAssets: function getAssets(node, location, opts) {
				var path = asset_resolvePath(node, location);
				var type = mask.Module.getType(node);
				var asset = new Asset();
				asset.type = type;
				asset.linking = node.link;
				asset.mode = node.mode;
				asset.path = path;
				asset.bundle = opts.bundle;
				return [asset];
			}
		};
		//# sourceMappingURL=import.es6.map
		//end:source ./tag-assets/import.es6
		//source ./tag-assets/script.es6
		"use strict";

		TagAssetsResolver.script = {
			getAssets: function getAssets(node, location, opts) {
				if (this.isRemoteScript(node) === false) {
					return null;
				}
				var attr = node.attr;
				var src = attr.src;
				var path = asset_resolvePath({ path: src, contentType: "style" }, location);
				var asset = new Asset();
				asset.type = "script";
				asset.path = path;
				asset.bundle = opts.bundle;
				if (attr.linking) {
					asset.linking = attr.linking;
				}
				if (attr.mode) {
					asset.mode = attr.mode;
				}
				if (attr.bundle) {
					asset.bundle = attr.bundle;
				}
				return [asset];
			},
			isRemoteScript: function isRemoteScript(node) {
				if (!node.attr.src) {
					return false;
				}
				var type = node.attr.type;
				if (type && /text\/javascript/i.test(type) === false) {
					// not a javascript
					return false;
				}
				return true;
			},
			build: function build(node, opts) {}
		};
		//# sourceMappingURL=script.es6.map
		//end:source ./tag-assets/script.es6
		//source ./tag-assets/link.es6
		"use strict";

		TagAssetsResolver.link = {
			getAssets: function getAssets(node, location, opts) {
				var attr = node.attr;
				var src = attr.href;
				if (!src) {
					// not a remote source
					return null;
				}
				var type = attr.rel;
				if (type && /stylesheet/i.test(type) === false) {
					// not a javascript
					return null;
				}

				var path = asset_resolvePath({ path: src, contentType: "style" }, location);
				var asset = new Asset();
				asset.type = "style";
				asset.mode = "client";
				asset.path = path;
				asset.bundle = opts.bundle;
				if (attr.linking) {
					asset.linking = attr.linking;
				}
				if (attr.bundle) {
					asset.bundle = attr.bundle;
				}
				return [asset];
			}
		};
		//# sourceMappingURL=link.es6.map
		//end:source ./tag-assets/link.es6
	})();
	//# sourceMappingURL=TagAssetsResolver.es6.map
	//end:source ./TagAssetsResolver.es6
	//source ./ResourceAssetsResolver.es6
	"use strict";

	var _toConsumableArray = function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
		} else {
			return Array.from(arr);
		}
	};

	var ResourceAssetsResolver;
	(function () {

		ResourceAssetsResolver = {
			get: function get(asset, opts) {
				var _this = this;

				return class_Dfr.run(function (resolve, reject) {
					var fn = _this[asset.type];
					if (fn == null) {
						resolve(asset);
						return;
					}
					fn(asset, opts).then(function () {
						return resolve(asset.assets);
					}, reject);
				});
			},
			mask: (function (_mask) {
				var _maskWrapper = function mask(_x, _x2) {
					return _mask.apply(this, arguments);
				};

				_maskWrapper.toString = function () {
					return _mask.toString();
				};

				return _maskWrapper;
			})(function (asset, opts) {
				return resolveFromTemplate(mask.parse, asset, opts);
			}),
			html: function html(asset, opts) {
				return resolveFromTemplate(mask.parseHtml, asset, opts);
			}
		};

		function resolveFromTemplate(parser, asset, opts) {
			return class_Dfr.run(function (resolve, reject) {
				if (io.File.exists(asset.path) === false) {
					reject("Asset not found " + asset.path);
					return;
				}

				var template = io.File.read(asset.path, opts);
				var ast = typeof template === "string" ? parser(template) : template;

				AssetsResolver.mask.getAssets(asset, ast, opts).then(function (asset) {
					return processDeep(asset);
				}, reject);

				function processDeep(asset) {
					if (opts.deep === false || asset.assets == null) {
						resolve(asset);
						return;
					}
					var dfrs = asset.assets.map(function (asset) {
						return ResourceAssetsResolver.get(asset, opts);
					});
					dfr_waitAll(dfrs).then(resolve, reject);
				}
			});
		}

		var AssetsResolver = {
			mask: {
				getAssets: function getAssets(asset, ast, opts) {
					return class_Dfr.run(function (resolve, reject) {
						var location = path_getDir(asset.path);
						var assets = new AssetsCollection();
						mask.TreeWalker.walkAsync(ast, visit, ready);

						function visit(node, next) {
							var resolver = TagAssetsResolver[node.tagName];
							if (resolver === void 0) {
								return next();
							}
							var arr = resolver.getAssets(node, location, opts);
							if (arr) {
								assets.push.apply(assets, _toConsumableArray(arr));
							}
							next();
						}

						function ready() {
							if (assets.length !== 0) {
								asset.assets = assets;
							}
							resolve(asset);
						}
					});
				}
			}
		};
	})();
	//# sourceMappingURL=ResourceAssetsResolver.es6.map
	//end:source ./ResourceAssetsResolver.es6

	Assets = {
		get: function get(path, opts_) {
			return class_Dfr.run(function (resolve, reject) {

				var opts = obj_extendDefaults(opts_, defaultOptions);
				var asset = Asset.fromPath(path);
				var Resolver = ResourceAssetsResolver[asset.type];

				if (Resolver == null) {
					reject("No asset resolver is registered for " + asset.path);
					return;
				}
				ResourceAssetsResolver.get(asset, opts).then(function (assets) {
					if (opts.flattern === true) {
						assets = flattern(assets);
					}
					resolve(assets);
				}, reject);
			});
		},
		Models: {
			Asset: Asset,
			AssetsCollection: AssetsCollection
		}
	};

	var defaultOptions = {
		deep: true,
		flattern: false,
		bundle: "global"
	};
})();
//# sourceMappingURL=Assets.es6.map
// end:source assets/Assets
// source builders/Builder
"use strict";

var Builder;
(function () {
	Builder = class_create({
		writer: null,
		constructor: function constructor(writer) {
			this.writer = writer;
		},
		build: function build(assets, opts) {
			var _this = this;

			var dfrs = Builders.map(function (Builder) {
				return new Builder(_this.writer).build(assets, opts);
			});
			return dfr_waitAll(dfrs).then(function () {
				return _this;
			});
		}
	});

	var IBuilder = class_create({
		writer: null,
		constructor: function constructor(writer) {
			this.writer = writer;
		},
		build: function build(assets, opts) {}
	});

	// source ./MaskBuilder.es6
	"use strict";

	var _toConsumableArray = function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
		} else {
			return Array.from(arr);
		}
	};

	var MaskBuilder = class_create(IBuilder, {

		build: function build(allAssets, opts) {
			var _this = this;

			var assets = allAssets.filter(function (asset) {
				return asset.type === "mask" || asset.type === "html";
			}).filter(function (asset) {
				return asset.linking !== "dynamic";
			}).filter(function (asset) {
				return asset.mode === "both" || asset.mode === target;
			});

			var coll = new Assets.Models.AssetsCollection();
			coll.push.apply(coll, _toConsumableArray(assets));

			var groups = coll.groupBy("bundle");
			var keys = Object.keys(groups);
			var dfrs = keys.map(function (key) {
				var assets = groups[key];
				var dfrs = assets.map(function (asset) {
					return _this.getSingle(asset, opts);
				});

				return dfr_waitAll(dfrs).then(function (arr) {
					var content = arr.join("\n");
					return _this.writer.write(key, "mask", opts, content);
				});
			});

			return dfr_waitAll(dfrs).then(function () {
				return _this;
			});
		},

		getSingle: function getSingle(asset, opts) {
			return io.File.readAsync(asset.path, opts).then(function (template) {
				return MaskOptimizer.process(template, opts).then(function (ast) {

					ast = jmask("module").attr("path", asset.path).append(ast);

					return mask.stringify(ast, {
						indent: opts.minify ? 0 : 4
					});
				});
			});
		}
	});
	//# sourceMappingURL=MaskBuilder.es6.map
	// end:source ./MaskBuilder.es6

	var Builders = [MaskBuilder];
})();

//StyleBuilder,
//ScriptBuilder,
//DataBuilder
//# sourceMappingURL=Builder.es6.map
// end:source builders/Builder
// source writers/IWriter
"use strict";

var Writers = {};
(function () {

	Writers.IWriter = class_create({
		write: function write(bundle, type, opts, content) {}
	});

	//source ./util/asset.es6
	"use strict";

	var asset_getExt;
	(function () {
		asset_getExt = function (type) {
			return EXT[type];
		};

		var EXT = {
			mask: "mask",
			script: "js",
			style: "css",
			data: "js",
			html: "html",
			text: "txt"
		};
	})();
	//# sourceMappingURL=asset.es6.map
	//end:source ./util/asset.es6
	//source ./FileWriter.es6
	"use strict";

	(function () {
		Writers.FileWriter = class_create({
			write: function write(bundle, type, opts, content) {
				var output = opts.outputDir;
				var filename = bundle + "." + asset_getExt(type);
				var path = Uri.combine(output, filename);
				return io.File.writeAsync(path, content, opts);
			}
		});
	});
	//# sourceMappingURL=FileWriter.es6.map
	//end:source ./FileWriter.es6
	//source ./MemoryWriter.es6
	"use strict";

	(function () {

		var _memory = {};
		Writers.MemoryWriter = class_create({
			write: function write(bundle, type, opts, content) {
				var output = opts.outputDir;
				var filename = bundle + "." + asset_getExt(type);
				var path = Uri.combine(output, filename);
				_memory[path] = content;
			}
		});

		Writers.MemoryWriter.memory = _memory;
	})();
	//# sourceMappingURL=MemoryWriter.es6.map
	//end:source ./MemoryWriter.es6
})();
//# sourceMappingURL=IWriter.es6.map
// end:source writers/IWriter

// source MaskSerializer
"use strict";

var MaskSerializer = {
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
//# sourceMappingURL=MaskSerializer.es6.map
// end:source MaskSerializer
// source MaskOptimizer
"use strict";

var MaskOptimizer;
(function () {
	MaskOptimizer = {
		process: function process(template, opts) {
			return mask["class"].Deferred.run(function (resolve) {
				mask.optimize(template, function (ast) {
					return resolve(ast);
				});
			});
		}
	};

	// source optimizers/cleanAssets.es6
	"use strict";

	mask.registerOptimizer("link", function (node, next) {
		var attr = node.attr;
		var isStatic = attr.href && /stylesheet/i.test(attr.rel) && /dynamic/i.test(attr.linking) === false;

		next(isStatic ? { remove: true } : null);
	});
	mask.registerOptimizer("script", function (node, next) {
		var attr = node.attr;
		var isStatic = attr.src && (!attr.type || /javascript/i.test(attr.type)) && /dynamic/i.test(attr.linking) === false;

		next(isStatic ? { remove: true } : null);
	});
	//# sourceMappingURL=cleanAssets.es6.map
	// end:source optimizers/cleanAssets.es6
	// source optimizers/methods.es6

	// end:source optimizers/methods.es6
	// source optimizers/content.es6

	// end:source optimizers/content.es6
})();
//# sourceMappingURL=MaskOptimizer.es6.map
// end:source MaskOptimizer
// source Builder

// end:source Builder
// source Runner

// end:source Runner

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
	},

	build: function build(file, opts) {
		PackageBuilder.process(file, opts);
	},
	getAssets: function getAssets(path, opts) {
		return Assets.get(path, opts);
	},
	build: function build(path, opts_) {
		var opts = _.obj_extendDefaults(opts_, {
			Writer: Writers.FileWriter
		});
		var writer = new opts.Writer();
		var builder = new Builder(writer);

		return this.getAssets(path, { flattern: true }).then(function (assets) {
			return builder.build(assets, opts);
		});
	},

	Writers: Writers
};
//# sourceMappingURL=exports.es6.map
// end:source exports
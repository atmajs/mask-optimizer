Minify, Combine, Optimize Mask Templates
-----

[![Build Status](https://travis-ci.org/atmajs/mask-optimizer.png?branch=master)](https://travis-ci.org/atmajs/mask-optimizer)

#### What you get?

##### Minifier
```mask
div.fooClass {
	if (user) {
		div {
			i > 'User '
			foo {
				'~[user]'
			}
		}
	}
}
```
```mask
.fooClass>if(user)>div{i>'User 'foo>'~[user]'}
```
##### Builder
```mask
import foo from 'foo.mask';
footer > foo;
```
```mask
module path='foo.mask' {
	define foo {
		span > 'Lorem Ipsum'
	}
}
import foo from 'foo.mask';
footer > foo;
```
##### Custom optimizations and preprocessors
Optimizer itself should be defined in settings so that this library runs all optimizers via the template. For Instance `markdown` plugin can convert Markdown markup to html for better client performance.
```mask
section > :md > """
	### Hello
	_Baz_
"""
```
```mask
section > :html > """
	<h6>Hello</h6>
	<i>Baz</i>
"""
```


### Node.js

```
npm install mask-optimizer
```

```javascript
var Optimizer = require('mask-optimizer');

// template string
var minified = Minifier.optimize(template);

// files
Minifier.optimizeFiles(String|Array|Glob files, String|Array output);

Minifier.optimizeFiles('views/foo.mask'); // output in `views/foo.min.mask`
Minifier.optimizeFiles('views/*.mask'); // output in `views/*.min.mask`

Minifier.optimizeFiles('foo.mask', '/release/foo.mask'); 

```

##### Atma.Toolkit Plugin

Use this as a Plugin for `io.File.read` to minify Mask markup

- when building Single-Page Application with the [Atma.Toolkit](https://github.com/atmajs/Atma.Toolkit), all the templates are embedded **and minified** into the resulting output html file.

- when building Atma Server Application, all templates are **minified** and combined into single html file for each Page ID


###### Install plugin localy (for single project)
```
cd my-project
atma plugin install mask-minify
```

##### Install plugin global
```
atma plugin install mask-minify -g
```

> This will install `mask-minify` module from the NPM repository, and will update current `package.json`.


----
:copyright: - 2015 - The Atma.js Project - MIT
Minify Mask Templates
-----

[![Build Status](https://travis-ci.org/atmajs/mask-minify.png?branch=master)](https://travis-ci.org/atmajs/mask-minify)


##### Node.js

```
npm install mask-minify
```

```javascript
var Minifier = require('mask-minify');

// template string
var minified = Minifier.minify(template);

// files
Minifier.minifyFiles(String|Array|Glob files, String|Array output);

Minifier.minifyFiles('views/foo.mask'); // output in `views/foo.min.mask`
Minifier.minifyFiles('views/*.mask'); // output in `views/*.min.mask`

Minifier.minifyFiles('foo.mask', '/release/foo.mask'); 

```

##### Atma.Toolkit Plugin

Use this as a Plugin for `io.File.read` to minify Mask markup

- when building Single-Page Application with the [Atma.Toolkit](https://github.com/atmajs/Atma.Toolkit), all the templates are embedded into the resulting output html file.

- when building Atma Server Application, all templates are combined into single html file for each Page ID


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
The MIT License
module.exports = {
	'build': {
		action: 'import',
		files: 'builds/**',
		output: 'lib/',
		defines: {}
	},
	
	'watch': {
		files: 'src/**',
		config: [
			'#[build]'
		]
	},
	
	'defaults': [
		'build'
	]
};

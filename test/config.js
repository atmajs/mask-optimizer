module.exports = {
	suites: {
		'node': {
			tests: 'test/**.test',
			exec: 'node',
			env: [
				'lib/optimizer.js::Optimizer'
			]
		}
	}
}
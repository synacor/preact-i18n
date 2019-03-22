/* eslint-disable */

var path = require('path');

var pkg = require('./package.json');

var REPORTER = process.env.REPORTER || (process.env.ENVIRONMENT==='ci' && 'junit') || '';

module.exports = function(config) {
	config.set({
		browsers: ['ChromeHeadless'],
		frameworks: ['mocha', 'chai-sinon'],
		reporters: ['mocha'].concat(REPORTER.split(/[, ]/)).filter(dedupe),
		junitReporter: {
			outputDir: 'test-reports', // results will be saved as $outputDir/$browserName.xml
			suite: require('./package.json').name
		},
		mochaReporter: { showDiff: true },
		files: [
			'test/**/*.js'
		],
		preprocessors: {
			'{src,test}/**/*': ['webpack', 'sourcemap']
		},
		webpack: {
			mode: 'development',
			devtool: 'inline-source-map',
			resolve: {
				alias: {
					'preact-i18n': path.resolve(__dirname, process.env.TEST_PRODUCTION ? pkg.main : 'src')
				}
			},
			module: {
				rules: [{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/env' ],
						plugins: [
							['@babel/plugin-transform-react-jsx', { pragma: 'h' }]
						]
					}
				}]
			},
		},
		webpackServer: { stats: 'errors-only' }
	});
};

// filters out empties && dupes
function dedupe(v, i, arr) { return v && arr.indexOf(v)===i; }

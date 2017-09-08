/* eslint-disable */

var path = require('path');

var REPORTER = process.env.REPORTER || (process.env.ENVIRONMENT==='ci' && 'junit') || '';

module.exports = function(config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['mocha', 'chai-sinon'],
		reporters: ['mocha'].concat(REPORTER.split(/[, ]/)).filter(dedupe),
		junitReporter: {
			outputDir: 'test-reports', // results will be saved as $outputDir/$browserName.xml
			suite: require('./package.json').name
		},
		mochaReporter: { showDiff: true },
		files: [
			{ pattern: 'test/**/*.js', watched: false }
		],
		preprocessors: {
			'{src,test}/**/*': ['webpack', 'sourcemap']
		},
		webpack: {
			resolve: {
				alias: {
					'preact-i18n': path.resolve(__dirname, process.env.TEST_PRODUCTION ? 'dist/preact-i18n' : 'src')
				}
			},
			module: {
				rules: [{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				}]
			},
			devtool: 'inline-source-map'
		},
		webpackServer: { noInfo: true }
	});
};

// filters out empties && dupes
function dedupe(v, i, arr) { return v && arr.indexOf(v)===i; }

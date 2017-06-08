/* eslint-disable */
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
			module: {
				rules: [{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: ['es2015', 'stage-0'],
						plugins: [
							['transform-react-jsx', { pragma: 'h' }]
						]
					}
				}]
			},
			devtool: 'inline-source-map'
		},
		webpackServer: { noInfo: true }
	});
};

// filters out empties && dupes
function dedupe(v, i, arr) { return v && arr.indexOf(v)===i; }

import babel from 'rollup-plugin-babel';
import memory from 'rollup-plugin-memory';
import babelrc from 'babelrc-rollup';

export default {
	useStrict: false,
	exports: 'default',
	external: [
		'preact',
		'dlv'
	],
	globals: {
		preact: 'preact',
		dlv: 'dlv'
	},
	plugins: [
		memory({
			path: 'src/entry.js',
			contents: "export { default } from './index';"
		}),
		babel(babelrc())
	]
};

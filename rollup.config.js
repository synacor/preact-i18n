/*eslint-disable*/
import babel from 'rollup-plugin-babel';
import memory from 'rollup-plugin-memory';
import babelrc from 'babelrc-rollup';
import replace from 'rollup-plugin-post-replace';

var FORMAT = process.env.FORMAT;

export default {
	useStrict: false,
	exports: FORMAT==='es' ? null : 'default',
	external: [
		'preact',
		'dlv'
	],
	globals: {
		preact: 'preact',
		dlv: 'dlv'
	},
	plugins: [
		FORMAT!=='es' && memory({
			path: 'src/entry.js',
			contents: "export { default } from './index';"
		}),
		babel(babelrc()),
		replace({
			'throw ': 'return; throw '
		})
	].filter(Boolean)
};

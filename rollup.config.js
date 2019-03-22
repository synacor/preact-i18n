/*eslint-disable*/
import memory from 'rollup-plugin-memory';
import buble from 'rollup-plugin-buble';

var FORMAT = process.env.FORMAT;

export default {
	external: [
		'preact',
		'dlv'
	],
	output: {
		strict: false,
		exports: FORMAT==='es' ? null : 'named',
		globals: {
			preact: 'preact',
			dlv: 'dlv'
		}
	},
	plugins: [
		FORMAT!=='es' && memory({
			path: 'src/entry.js',
			contents: "export { default } from './index';"
		}),
		buble({
			jsx: 'h'
		})
	].filter(Boolean)
};

import buble from 'rollup-plugin-buble';
import memory from 'rollup-plugin-memory';

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
		buble({
			jsx: 'h',
			objectAssign: 'assign'
		})
	]
};

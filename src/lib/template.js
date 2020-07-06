import { Text } from '../components/text';
import translate from './translate';

const EMPTY = {};

/** Populate {{template.fields}} within a given string.
 *
 *	@private
 *	@param {String} template	The string containing fields to be resolved
 *	@param {Object} [fields={}]	Optionally nested object of fields, referencable from `template`.
 *	@example
 *		template('foo{{bar}}', { bar:'baz' }) === 'foobaz'
 */
export default function template(template, fields, scope, dictionary) {
	return template && template.replace(/\{\{([\w.-]+)\}\}/g, replacer.bind(null, fields || EMPTY, scope, dictionary));
}

/** Replacement callback for injecting fields into a String
 *	@private
 */
function replacer(currentFields, scope, dictionary, s, field) {
	let parts = field.split('.'),
		v = currentFields;
	for (let i=0; i<parts.length; i++) {
		v = v[parts[i]];
		if (v == null) return ''; // eslint-disable-line eqeqeq

		//allow field values to be <Text /> nodes
		if (v && v.type === Text) {
			return translate(v.props.id, scope, dictionary, v.props.fields, v.props.plural, v.props.fallback);
		}
	}
	// allow for recursive {{config.xx}} references:
	if (typeof v==='string' && v.match(/\{\{/)) {
		v = template(v, currentFields);
	}
	return v;
}

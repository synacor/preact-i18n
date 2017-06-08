const EMPTY = {};

let currentFields;

/** Populate {{template.fields}} within a given string.
 *
 *	@private
 *	@param {String} template	The string containing fields to be resolved
 *	@param {Object} [fields={}]	Optionally nested object of fields, referencable from `template`.
 *	@example
 *		template('foo{{bar}}', { bar:'baz' }) === 'foobaz'
 */
export default function template(template, fields) {
	currentFields = fields || EMPTY;
	return template && template.replace(/\{\{([\w.-]+)\}\}/g, replacer);
}

/** Replacement callback for injecting fields into a String
 *	@private
 */
function replacer(s, field) {
	let parts = field.split('.'),
		v = currentFields;
	for (let i=0; i<parts.length; i++) {
		v = v[parts[i]];
		if (v == null) return ''; // eslint-disable-line eqeqeq
	}
	// allow for recursive {{config.xx}} references:
	if (typeof v==='string' && v.match(/\{\{/)) {
		v = template(v, currentFields);
	}
	return v;
}

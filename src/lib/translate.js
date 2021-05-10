import delve from 'dlv';
import { defined } from './util';
import template from './template';

/** Attempts to look up a translated value from a given dictionary.
 *  Also supports json templating using the format: {{variable}}
 *  Falls back to default text.
 *
 *  @param {String} id  			Intl field name/id (subject to scope)
 *  @param {String} [scope='']		Scope, which prefixes `id` with `${scope}.`
 *  @param {Object} dictionary		A nested object containing translations
 *  @param {Object} [fields={}]		Template fields for use by translated strings
 *  @param {Number} [plural]		Indicates a quantity, used to trigger pluralization
 *  @param {String|Array} [fallback]	Text to return if no translation is found
 *  @returns {String} translated
 */
export default function translate(id, scope, dictionary, fields, plural, fallback) {
	if (scope) id = scope + '.' + id;

	let value = dictionary && delve(dictionary, id);

	// plural forms:
	// key: ['plural', 'singular']
	// key: { none, one, many }
	// key: { zero, one, other }
	// key: { singular, plural }
	if ((plural || plural===0) && value && typeof value==='object') {
		if (value.splice) {
			value = value[plural] || value[0];
		}
		else if (plural===0 && defined(value.none || value.zero)) {
			value = value.none || value.zero;
		}
		else if (plural===1 && defined(value.one || value.singular)) {
			value = value.one || value.singular;
		}
		else {
			value = value.some || value.many || value.plural || value.other || value;
		}
	}

	return value && template(value, fields, scope, dictionary) || fallback || null;
}

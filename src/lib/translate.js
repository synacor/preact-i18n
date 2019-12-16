import delve from 'dlv';
import { defined } from './util';
import template from './template';

/**
 * Default function to determine what plural form to use from the provided dictionary
 * @param dict the dictorary with possible plural forms
 * @param plural the plural count
 * @returns {String | false}
 */
export function defaultProvider(dict, plural) {
	// plural forms:
	// key: ['plural', 'singular']
	// key: { none, one, many }
	// key: { singular, plural }
	if ((plural || plural === 0) && dict && typeof dict === 'object') {
		if (dict.splice) {
			return dict[plural] || dict[0];
		}
		else if (plural === 0 && defined(dict.none)) {
			return dict.none;
		}
		else if (plural === 1 && defined(dict.one || dict.singular)) {
			return dict.one || dict.singular;
		}
		return dict.some || dict.many || dict.plural || dict.other || dict;
	}
}

/** Attempts to look up a translated value from a given dictionary.
 *  Also supports json templating using the format: {{variable}}
 *    Falls back to default text.
 *
 *    @private
 *    @param {String} id                Intl field name/id (subject to scope)
 *    @param {String} [scope='']        Scope, which prefixes `id` with `${scope}.`
 *    @param {Object} dictionary        A nested object containing translations
 *    @param {Object} [fields={}]        Template fields for use by translated strings
 *    @param {Number} [plural]        Indicates a quantity, used to trigger pluralization
 *    @param {String|Array} [fallback]    Text to return if no translation is found
 *    @param pluralizer {function: String | false} Provider function to extract the plural form from the dictionary
 *    @returns {String} translated
 */
export default function translate(id, scope, dictionary, fields, plural, fallback, pluralizer = defaultProvider) {
	if (scope) id = scope + '.' + id;

	let value = dictionary && delve(dictionary, id);
	value = plural ? pluralizer(value, plural) || defaultProvider(value, plural): value;

	return value && template(value, fields) || fallback || null;
}

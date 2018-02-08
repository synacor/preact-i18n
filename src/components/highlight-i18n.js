import { h } from 'preact';
import delve from 'dlv';


/** Highlight/colorize the i18n'd node if `mark` is set on `intl` in context.  If not, just returns `value`
 *
 *	@private
 *	@param {String|VNode} value	The l10n'd text/vnode to highlight or pass through
 *	@param {string} id	The key used to lookup the value in the intl dictionary
 */
export function HighlightI18N({ value, id }, { intl }) {

	if (intl && intl.mark) {
		const dictionaryKey = `dictionary${intl && intl.scope ? `.${intl.scope}` : ''}.${id}`;
		return h('mark', {
			style: 'background: ' + (
				value
					? delve(intl, dictionaryKey)
						? 'rgba(119,231,117,.5)'      // Green = this string is fully internationalized
						: 'rgba(229,226,41,.5)'       // Yellow = this string does not have a value in the dictionary, but it has a fallback value
					: 'rgba(228,147,51,.5)'         // Red = this string has no value and no fallback
			),
			title: id
		}, value);
	}

	return 	value ;
}

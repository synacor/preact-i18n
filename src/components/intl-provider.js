import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { IntlContext } from '../contexts/intl-context';
import { assign, deepAssign } from '../lib/util';


const URL_FLAG = /[?&#]intl=show/;


/** `<IntlProvider>` is a nestable internationalization definition provider.
 *	It exposes an Intl scope & definition into the tree,
 *	making them available to descendant components.
 *
 *	> **Note:** When nested, gives precedence to keys higher up the tree!
 *	> This means lower-level components can set their defaults by wrapping themselves
 *	> in an `<IntlProvider>`, but still remain localizable by their parent components.
 *
 *	@name IntlProvider
 *	@param props
 *	@param {String} [props.scope]			Nest `definition` under a root key, and set the active scope for the tree (essentially prefixing all `<Text />` keys).
 *	@param {Boolean} [props.mark=false]		If `true`, all `<Text>` elements will be shown with a red/green background indicating whether they have valid Intl keys.
 *	@param {Object} [props.definition={}]	Merge the given definition into the current intl definition, giving the *current* definition precedence (i.e., only adding keys, acting as defaults)
 *
 *	@example
 *	// generally imported from a JSON file:
 *	let definition = {
 *		foo: 'Le Feux'
 *	};
 *
 *	<IntlProvider scope="weather" definition={definition}>
 *		<Text key="foo">The Foo</Text>
 *	</IntlProvider>
 *
 *	// This will render the text:
 *	"Le Feux"
 */

export function IntlProvider({ scope, mark, definition, ...props }) {

	// TODO: Test nesting
	const { intl: parentIntl } = useContext(IntlContext);
	let intl = assign({}, parentIntl || {});

	// set active scope for the tree if given
	if (scope) intl.scope = scope;

	// merge definition into current with lower precedence
	if (definition) {
		intl.dictionary = deepAssign(intl.dictionary || {}, definition);
	}

	if (mark || (typeof location!=='undefined' && String(location).match(URL_FLAG))) {
		intl.mark = true;
	}

	return (
		<IntlContext.Provider value={{ intl }}>
			{props.children}
		</IntlContext.Provider>
	);
}

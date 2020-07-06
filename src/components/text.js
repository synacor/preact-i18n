import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { IntlContext } from '../contexts/intl-context';
import translate from '../lib/translate';
import { HighlightI18N } from './highlight-i18n';

/** `<Text>` renders internationalized text.
 *	It attempts to look up translated values from a dictionary in context.
 *
 *	Template strings can contain `{{field}}` placeholders,
 *	which injects values from the `fields` prop.
 *
 *	When string lookup fails, renders its children as fallback text.
 *
 *	@param {Object}       props               props
 *	@param {String}       props.id            Key to look up in intl dictionary, within any parent scopes (`$scope1.$scope2.$id`)
 *	@param {ReactElement} [props.children]    Fallback text if no definition is found
 *	@param {Object}       [props.fields={}]   Values to inject into template `{{fields}}`. Values in the `fields` object will be coerced to strings, with the exception of `<Text/>` nodes which will be resolved to their translated value
 *	@param {Number}       [props.plural]      Integer "count", used to select plural forms
 *
 *	@example
 *	// If there is no dictionary in context..
 *	<Text id="foo">The Foo</Text>
 *	// ..produces the text:
 *	"The Foo"
 *
 *	@example
 *	// Given a dictionary and some fields..
 *	<IntlProvider definition={{ foo:'Le Feux {{bar}}' }}>
 *		<Text id="foo" fields={{ bar: 'BEAR' }}>The Foo</Text>
 *	</IntlProvider>
 *	// ..produces the text:
 *	"Le Feux BEAR"
 *
 *	@example
 *	// Within a scope, both `id` and the definition are namespaced..
 *	<IntlProvider scope="weather" definition={{ foo:'Le Feux' }}>
 *		<Text id="foo">The Foo</Text>
 *	</IntlProvider>
 *	// ..produces the text:
 *	"Le Feux"
 */
export function Text({ id, children: fallback, plural, fields }) {
	const { intl } = useContext(IntlContext);

	let value = translate(
		id,
		intl && intl.scope,
		intl && intl.dictionary,
		fields,
		plural,
		fallback
	);

	return <HighlightI18N id={id} value={value} />;
}

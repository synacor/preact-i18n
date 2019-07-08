import { h } from 'preact';
import { Text } from './text';
import { Localizer } from './localizer';
import { HighlightI18N } from './highlight-i18n';

/* eslint-disable react/no-danger */

/** `<MarkupText>` is just like {@link Text} but it can also contain html markup in rendered strings.  It wraps its contents in a `<span>` tag.
 *
 *	@param {Object} props				props
 *	@param {String} props.id			Key to look up in intl dictionary, within any parent scopes (`$scope1.$scope2.$id`)
 *	@param {Object} [props.fields={}]	Values to inject into template `{{fields}}`.  Values in the `fields` object will be coerced to strings, with the exception of `<Text/>` nodes which will be resolved to their translated value
 *	@param {Number} [props.plural]		Integer "count", used to select plural forms
 *	@param {Object} context
 *	@param {Object} context.intl		[internal] dictionary and scope info
 *
 *	@example
 *	// If there is no dictionary in context..
 *	<MarkupText id="foo"><b>The Foo</b></MarkupText>
 *	// ..produces the vnode:
 *	<span><b>The Foo</b></span>
 *
 *	@example
 *	// Given a dictionary and some fields..
 *	<IntlProvider definition={{ foo:'Le Feux <b>{{bar}}</b>' }}>
 *		<MarkupText id="foo" fields={{ bar: 'BEAR' }}>The Foo</MarkupText>
 *	</IntlProvider>
 *	// ..produces the vnode:
 *	<span>Le Feux <b>BEAR</b></span>
 *
 *	@example
 *	// Within a scope, both `id` and the definition are namespaced..
 *	<IntlProvider scope="weather" definition={{ foo:'Le <a href="http://foo.com">Feux</a>' }}>
 *		<MarkupText id="foo">The Foo</MarkupText>
 *	</IntlProvider>
 *	// ..produces the vnode:
 *	<span>Le <a href="http://foo.com">Feux</a></span>
 *
 *	@example
 *	// renders nothing if there is no key match and no fallback
 *	<div><MarkupText /></div>
 *	// ..produces the vnode:
 *	<div/>
 */
export function MarkupText(props) {
	return (
		<Localizer>
			<Html html={<Text {...props} />} id={props.id} />
		</Localizer>
	);
}

function Html({ html, id }) {
	let value = !html ? html : typeof html === 'string' ? <span dangerouslySetInnerHTML={{ __html: html }} /> : <span>{html}</span> ;
	return <HighlightI18N id={id} value={value} />;
}

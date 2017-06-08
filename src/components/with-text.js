import { h } from 'preact';
import translateMapping from '../lib/translate-mapping';

/** `@withText()` is a Higher Order Component, often used as a decorator.
 *
 *	It wraps a child component and passes it translations
 *	based on a mapping to the dictionary & scope in context.
 *
 *	@param {Object|Function|String} mapping		Maps prop names to intl keys (or `<Text>` nodes).
 *
 *	@example
 *	@withText({
 *		placeholder: 'user.placeholder'
 *	})
 *	class Foo {
 *		// now the `placeholder` prop is our localized String:
 *		render({ placeholder }) {
 *			return <input placeholder={placeholder} />
 *		}
 *	}
 *
 *	@example
 *	@withText({
 *		placeholder: <Text id="user.placeholder">fallback text</Text>
 *	})
 *	class Foo {
 *		render({ placeholder }) {
 *			return <input placeholder={placeholder} />
 *		}
 *	}
 *
 *	@example
 *	// for Strings/Arrays, the last segment of the path is used as the prop name:
 *	@withText('user.placeholder')
 *	class Foo {
 *		render({ placeholder }) {
 *			return <input placeholder={placeholder} />
 *		}
 *	}
 *
 *	@example
 *	// Works with functional components, too:
 *	const Foo = withText('user.placeholder')(
 *		props => (
 *			<input placeholder={props.placeholder} />
 *		)
 *	)
 */
export const withText = mapping => Child => (props, context) => {
	let map = typeof mapping==='function' ? mapping(props) : mapping;
	let translations = translateMapping(map, context.intl);
	return <Child {...props} {...translations} />;
};

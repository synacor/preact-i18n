import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { IntlContext } from '../contexts/intl-context';
import translateMapping from '../lib/translate-mapping';
import { assign } from '../lib/util';

/** `@withText()` is a Higher Order Component, often used as a decorator.
 *
 *	It wraps a child component and passes it translations
 *	based on a mapping to the dictionary & scope in context.
 *
 *	@param {Object|Function|String} mapping		Maps prop names to intl keys (or `<Text>` nodes).
 *
 *	@example @withText({
 *		placeholder: 'user.placeholder'
 *	})
 *	class Foo {
 *		// now the `placeholder` prop is our localized String:
 *		render({ placeholder }) {
 *			return <input placeholder={placeholder} />
 *		}
 *	}
 *
 *	@example @withText({
 *		placeholder: <Text id="user.placeholder">fallback text</Text>
 *	})
 *	class Foo {
 *		render({ placeholder }) {
 *			return <input placeholder={placeholder} />
 *		}
 *	}
 *
 *	@example @withText('user.placeholder')
 *	class Foo {
 *		// for Strings/Arrays, the last path segment becomes the prop name:
 *		render({ placeholder }) {
 *			return <input placeholder={placeholder} />
 *		}
 *	}
 *
 *	@example <caption>Works with functional components, too</caption>
 *	const Foo = withText('user.placeholder')( props =>
 *		<input placeholder={props.placeholder} />
 *	)
 *
 * 	@example <caption>getWrappedComponent() returns wrapped child Component</caption>
 *	const Foo = () => <div/>;
 *	const WrappedFoo = withText('user.placeholer')(Foo);
 *	WrappedFoo.getWrappedComponent() === Foo; // true
 */
export function withText(mapping) {
	return function withTextWrapper(Child) {
		function WithTextWrapper(props, context) {
			const { intl } = useContext(IntlContext);

			let map = typeof mapping==='function' ? mapping(props, { intl }) : mapping;
			let translations = translateMapping(map, intl);
			return h(Child, assign(assign({}, props), translations));
		}

		WithTextWrapper.getWrappedComponent = Child && Child.getWrappedComponent || (() => Child);
		return WithTextWrapper;
	};
}

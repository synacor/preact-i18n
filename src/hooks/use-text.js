import { useContext } from 'preact/hooks';
import { IntlContext } from '../contexts/intl-context';
import translateMapping from '../lib/translate-mapping';

/** `useText` is the hook version of {@link withText}
 *
 *	@param {Object|Function|String} mapping		Maps prop names to intl keys (or `<Text>` nodes).
 *
 *	@example function MyComponent() {
 *		const { placeholder } = useText({
 *			placeholder: 'user.placeholder'
 *		});
 *		return <input placeholder={placeholder} />
 *	}
 *
 *	@example function MyComponent() {
 *		const { placeholder } = useText({
 *			placeholder: <Text id="user.placeholder">fallback text</Text>
 *		});
 *		return <input placeholder={placeholder} />
 *	}
 *
 *	@example function MyComponent() {
 *		// for Strings/Arrays, the last path segment becomes the prop name:
 *		const { placeholder } = useText('user.placeholder');
 *
 *		return <input placeholder={placeholder} />
 *	}
 */
export function useText(mapping) {
	const { intl } = useContext(IntlContext);

	return translateMapping(
		typeof mapping==='function' ? mapping({ intl }) : mapping,
		intl
	);
}

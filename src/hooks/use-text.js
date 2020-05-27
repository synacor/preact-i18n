import { useContext } from 'preact/hooks';
import { IntlContext } from '../contexts/intl-context';
import translateMapping from '../lib/translate-mapping';

export function useText(mapping) {
	const { intl } = useContext(IntlContext);

	return translateMapping(
		typeof mapping==='function' ? mapping({ intl }) : mapping,
		intl
	);
}

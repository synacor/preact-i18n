import { h } from 'preact';
import { IntlProvider } from './components/intl-provider';


/**
 * Higher-order function that creates an `<IntlProvider />` wrapper component for the given component.  It
 * takes two forms depending on how many arguments it's given:
 * It can take a functional form like:
 * intl(ComponentToWrap, options)
 *
 * or it can take an annotation form like:
 * @intl(options)
 * class ComponentToWrap extends Component {}
 *
 *    @param {Component or Object} args[0] If there are two arguments, the first argument is the Component to wrap in `<IntlProvider/>`. If there is just one argument, this is the options object to pass as `props` to `<IntlProvider/>`. See the definition of the options param below for details.
 *    @param {Object} options If there are two arguments, the second argument is Passed as `props` to `<IntlProvider />`
 *    @param [options.scope]            Nest `definition` under a root key, and set the active scope for the tree (essentially prefixing all `<Text />` keys).
 *    @param [options.definition={}]    Merge the given definition into the current intl definition, giving the *current* definition precedence (i.e., only adding keys, acting as defaults)
 *    @param [options.provider=defaultProvider] Provider function to use to get the plural form to use from the dictionary
 */
export function intl(Child, options) {
	if (arguments.length < 2) {
		options = Child;
		return Child => intl(Child, options);
	}
	function IntlProviderWrapper(props) {
		return h(
			IntlProvider,
			options || {},
			h(Child, props)
		);
	}

	IntlProviderWrapper.getWrappedComponent = Child && Child.getWrappedComponent || (() => Child);
	return IntlProviderWrapper;
}

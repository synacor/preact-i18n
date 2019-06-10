import { cloneElement } from 'preact';
import translateMapping from '../lib/translate-mapping';

/** `<Localizer />` is a Compositional Component.
 *	It "renders" out any `<Text />` values in its child's props.
 *
 *	@name Localizer
 *	@param {Object} props
 *	@param {Object} props.children	Child components with props to localize.
 *	@param {Object} context
 *	@param {Object} context.intl		[internal] dictionary and scope info
 *	@example
 *	<Localizer>
 *		<input placeholder={<Text id="username.placeholder" />} />
 *	</Localizer>
 *	// produces:
 *	<input placeholder="foo" />
 *
 *	@example
 *	<Localizer>
 *		<abbr title={<Text id="oss-title">Open Source Software</Text>}>
 *			<Text id="oss">OSS</Text>
 *		</abbr>
 *	</Localizer>
 *	// produces:
 *	<abbr title="Open Source Software">OSS</abbr>
 */
export function Localizer({ children }, { intl }) {
	return children && children.length
		? children.map((child) => cloneElement(child, translateMapping(child.props, intl, true)))
		: children && cloneElement(children, translateMapping(children.props, intl, true));
}

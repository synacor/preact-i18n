import { cloneElement } from 'preact';
import translateMapping from '../lib/translate-mapping';

/** `<Localizer />` is a Compositional Component.
 *	It "renders" out any `<Text />` values in its child's props.
 *
 *	@name Localizer
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
export const Localizer = ({ children }, { intl }) => {
	let child = children && children[0];
	return child && cloneElement(child, translateMapping(child.attributes, intl, true));
};

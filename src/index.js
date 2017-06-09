import { intl } from './intl';
import { IntlProvider } from './components/intl-provider';
import { Text } from './components/text';
import { Localizer } from './components/localizer';
import { withText } from './components/with-text';

export { intl, IntlProvider, Text, Localizer, withText };

intl.intl = intl;
intl.IntlProvider = IntlProvider;
intl.Text = Text;
intl.Localizer = Localizer;
intl.withText = withText;
export default intl;

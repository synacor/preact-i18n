import { intl } from './intl';
import { IntlProvider } from './components/intl-provider';
import { Text } from './components/text';
import { MarkupText } from './components/markup-text';
import { Localizer } from './components/localizer';
import { withText } from './components/with-text';

export { intl, IntlProvider, Text, MarkupText, Localizer, withText };

intl.intl = intl;
intl.IntlProvider = IntlProvider;
intl.Text = Text;
intl.MarkupText = MarkupText;
intl.Localizer = Localizer;
intl.withText = withText;
export default intl;

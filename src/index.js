import { intl } from './intl';
import { IntlContext } from './contexts/intl-context';
import { IntlProvider } from './components/intl-provider';
import { Text } from './components/text';
import { MarkupText } from './components/markup-text';
import { Localizer } from './components/localizer';
import { withText } from './components/with-text';
import { useText } from './hooks/use-text';

export { intl, IntlContext, IntlProvider, Text, MarkupText, Localizer, withText, useText };

intl.intl = intl;
intl.IntlContext = IntlContext;
intl.IntlProvider = IntlProvider;
intl.Text = Text;
intl.MarkupText = MarkupText;
intl.Localizer = Localizer;
intl.withText = withText;
intl.useText = useText;
export default intl;

import { intl } from './intl';
import { IntlContext } from './contexts/intl-context';
import { IntlProvider } from './components/intl-provider';
import { Text } from './components/text';
import { MarkupText } from './components/markup-text';
import { Localizer } from './components/localizer';
import { withText } from './components/with-text';
import { useText } from './hooks/use-text';
import translate from './lib/translate';

export { intl, IntlContext, IntlProvider, Text, MarkupText, Localizer, withText, useText, translate };

intl.intl = intl;
intl.IntlContext = IntlContext;
intl.IntlProvider = IntlProvider;
intl.Text = Text;
intl.MarkupText = MarkupText;
intl.Localizer = Localizer;
intl.withText = withText;
intl.useText = useText;
intl.translate = translate;

export default intl;

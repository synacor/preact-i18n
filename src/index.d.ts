declare module "preact-i18n" {
  import * as Preact from "preact";

  export interface IntlProviderProps {
    scope?: string;
    mark?: boolean;
    definition: object;
  }

  export class IntlProvider extends Preact.Component<IntlProviderProps, {}> {
    render(props: IntlProviderProps, {}): Preact.VNode;
  }

  export class Localizer extends Preact.Component<{}, {}> {
    render(): Preact.VNode;
  }

  export interface TextProps {
    id: string;
    plural?: number;
    fields?: object;
  }

  export class Text extends Preact.Component<TextProps, {}> {
    render(props: TextProps, {}): Preact.VNode;
  }
}

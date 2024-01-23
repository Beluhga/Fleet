import 'styled-components';
import theme from '../theme';

declare module 'styled-components' {
    type ThemeType = typeof theme;

    export interface DefaultTheme extends ThemeType { }
}

// instalar: npm i styled-components@5.3.9
// o styled-components 6 esta dando erro
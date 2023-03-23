import {
  ComponentStyleConfig,
  extendTheme,
  StyleConfig,
  StyleProps,
  type ThemeConfig,
} from '@chakra-ui/react';

// commons config
const colors = {
  gray: {
    50: '#CBCBCB',
    100: '#515151',
    100.5: '#51515180',
    200: '#7f7f7f',
    200.5: '#EFEFEF',
  },
  warning: {
    100: '#DA2729',
    200: '#AB2426',
  },
  red: {
    '100.5': '#FF0000',
  },
};

const fonts = {
  primary_light: 'VIN5261-Light, sans-serif',
  primary: 'VIN5261-Regular, sans-serif',
  primary_italic: 'VIN5261-RegularItalic, sans-serif',
  primary_bold: 'VIN5261-Bold, sans-serif',
  primary_bold_italic: 'VIN5261-BoldItalic, sans-serif',
  body: 'VIN5261-Regular, sans-serif',
  heading: 'VIN5261-Regular, sans-serif',
};

const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  ipad: '1025px',
  ipad_landscape: '1337px',
  '2xl': '96em',
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// component config
const components: { [key: string]: ComponentStyleConfig } = {
  Text: {
    variants: {
      h3: {
        fontSize: { base: 'xl', md: '2xl' }, //24px
        fontWeight: 'normal',
        fontFamily: 'primary',
        lineHeight: { base: '30px', md: '36px' },
        color: 'white',
      },
    },
  },
};

// styles config
const styles: { [key: string]: { [key: string]: StyleProps } } = {
  global: {
    body: {
      bg: '#000000',
    },
  },
};

// final theme
export default extendTheme({
  styles,
  config,
  colors,
  fonts,
  breakpoints,
  components,
});

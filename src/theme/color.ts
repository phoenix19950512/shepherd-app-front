/**
 * Defines application color settings and definitions
 * We will define constant colors for all mode usage
 */
import { ThemeMode } from './types';

const WHITE = '#ffffff';
const WHITE_SHADE = '#F4F5F6';
const BLACK = '#000000';
const BLACK_TINT = '#ffffff';
const GRAY = '#f7f8fa';
const LIGHT_GRAY = '';

interface ColorPalette {
  // primary: string;
  // secondary: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  // success: string;
  // error: string;
  gray: string;
  whiteShade: string;
}

type Theme = {
  light: typeof lightColor;
  dark: typeof darkColor;
};

const lightColor: ColorPalette = {
  // primary: '#007bff',
  // secondary: '#6c757d',
  background: WHITE,
  textPrimary: '#6E7682',
  textSecondary: BLACK,
  // success: '#28a745',
  // error: '#dc3545',
  gray: GRAY,
  whiteShade: WHITE_SHADE
};

const darkColor: ColorPalette = {
  // primary: '#007bff',
  // secondary: '#6c757d',
  background: BLACK_TINT,
  textPrimary: BLACK_TINT,
  textSecondary: BLACK,
  // success: '#28a745',
  // error: '#dc3545',
  gray: GRAY,
  whiteShade: WHITE_SHADE
};

const color: Theme = {
  light: lightColor,
  dark: darkColor
};

/**
 * export color based on the system mode
 * TODO: get this from system settings
 */
const prefersDarkMode = window.matchMedia(
  `(prefers-color-scheme: ${ThemeMode.DARK})`
).matches;
const themeMode = prefersDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;

const colorMode: ColorPalette = color[themeMode];
export default colorMode;

import color from './color';
import layout from './layout';

export type Color = typeof color;
export type Layout = typeof layout;

export type AppTheme = {
  color: Color;
  layout: Layout;
};

export type AppPropKeys = 'theme' | any;

export type AppThemeContext = {
  [propName in AppPropKeys]: AppTheme;
};
/**
 * Utilizes all the application theme settings Makes use of use of
 * all the application then definitions
 */
const theme: AppTheme = {
  color: color,
  layout: layout
};
export default theme;

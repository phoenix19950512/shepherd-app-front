/**
 * Defines application layout by each segment
 */

type Layout = {
  padding: typeof padding;
  margin: typeof margin;
};

const padding = {
  paddingSmall: 5,
  paddingMedium: 10,
  paddingEditor: 50
};

const margin = {
  marginSmall: 5
};

export const layout: Layout = {
  padding: padding,
  margin: margin
};
export default layout;

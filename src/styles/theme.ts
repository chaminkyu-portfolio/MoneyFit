import { colors } from './colors';
import { fontWeights, fontSizes } from './fonts';

export const theme = {
  colors,
  fonts: {
    ...fontSizes,
    ...fontWeights,
  },
};

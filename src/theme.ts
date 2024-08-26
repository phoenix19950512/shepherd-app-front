import { alertAnatomy } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  defineStyleConfig,
  extendTheme
} from '@chakra-ui/react';

const {
  definePartsStyle: defineAlertPartsStyle,
  defineMultiStyleConfig: defineAlertMultiStyleConfig
} = createMultiStyleConfigHelpers(alertAnatomy.keys);

const borderRadius = {
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '6px',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  }
};

const colors = {
  blue: {
    '100': '#EFF4FA',
    '200': '#207DF7'
  },
  red: {
    '50': '#FEE7E7',
    '100': '#FCBBBB',
    '200': '#F98F8F',
    '300': '#F76363',
    '400': '#F53535',
    '500': '#F30C0C',
    '600': '#C20A0A',
    '700': '#920707',
    '800': '#610505',
    '900': '#310202'
  },
  text: {
    200: '#212224',
    300: '#585F68',
    400: '#6E7682',
    500: '#969CA6',
    600: '#5C5F64',
    700: '#9A9DA2'
  },
  primary: {
    '50': '#EBF4FE',
    '100': '#BAD7FD',
    '200': '#7AA7FB',
    '300': '#4D8DF9',
    '400': '#207DF7',
    '500': '#072D5F'
  },
  secondary: {
    50: '#e1f5ff',
    100: '#bde1f3',
    200: '#96cfe8',
    300: '#70b4de',
    400: '#4a96d4',
    500: '#3275ba',
    600: '#245391',
    700: '#173569',
    800: '#071941',
    900: '#00051a'
  }
};

const mutedText = defineStyle({
  color: '#696969',
  fontSize: 'var(--chakra-fontSizes-xs)'
});

const solidButton = defineStyle({
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '20px',
  background: colors.primary[400],
  borderRadius: '8px',
  color: '#fff',

  _hover: {
    background: '#0C67DD',
    color: '#fff'
  },

  _disabled: {
    opacity: 1,
    color: '#C7C9CC',
    background: '#F1F1F1',
    pointerEvents: 'none'
  }
});

const destructiveSolidLightButton = defineStyle({
  ...solidButton,
  color: colors.red[400],
  background: '#FEF0F0',
  _hover: {
    background: colors.red[400],
    color: '#FFF'
  }
});

const destructiveSolidButton = defineStyle({
  ...solidButton,
  color: '#FFF',
  background: colors.red[400],
  _hover: {
    background: colors.red[600],
    color: '#FFF'
  }
});

const flatButton = defineStyle({
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '20px',
  background: '#F2F2F3',
  borderRadius: '8px',
  color: '#5C5F64',

  _hover: {
    background: '#F2F2F3',
    color: '#212224'
  },

  _disabled: {
    opacity: 1,
    color: '#C7C9CC',
    background: '#F2F2F3',
    pointerEvents: 'none'
  }
});

const floatingButton = defineStyle({
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '20px',
  background: '#fff',
  borderRadius: '8px',
  color: '#5C5F64',
  border: '1px solid #E7E8E9',
  boxShadow: '0px 2px 6px rgba(136, 139, 143, 0.1)',

  _hover: {
    borderColor: '#DCDDDE',
    color: '#212224'
  },

  _disabled: {
    opacity: 1,
    color: '#C7C9CC',
    background: '#F2F2F3',
    pointerEvents: 'none'
  }
});

const linkButton = defineStyle({
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px',
  color: colors.primary[400]
});

const inputFieldStyle = {
  border: '1px solid #E4E6E7',
  boxShadow: '0px 2px 6px rgba(136, 139, 143, 0.1)',
  color: '#212224',
  borderRadius: '6px',
  padding: '14px 14px 14px 16px',

  '::placeholder': {
    color: '#9A9DA2'
  },

  _hover: {
    border: '1px solid #DDDEDF !important'
  },

  _active: {
    border: `1.5px solid ${colors.primary[400]} !important`
  },

  _focus: {
    border: `1.5px solid ${colors.primary[400]} !important`
  },

  _invalid: {
    border: `1.5px solid #F53535 !important`,
    boxShadow: '0 0 0 1px #F53535 !important'
    // ':after': {

    // }
  }
};

const inputField = defineStyle({
  addon: {
    background: '#FFF',
    position: 'relative',

    '&.chakra-input__left-addon': {
      borderBottomLeftRadius: '6px',
      borderTopLeftRadius: '6px',
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        right: '-1px',
        top: 0,
        bottom: 0,
        width: '5px',
        background: '#FFF'
      }
    },

    '&.chakra-input__right-addon': {
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: '-1px',
        top: 0,
        bottom: 0,
        width: '5px',
        background: '#FFF'
      }
    }
  },
  '.chakra-divider': {
    display: 'none'
  },
  field: inputFieldStyle
});

const textareaTheme = defineStyleConfig({
  variants: {
    outline: defineStyle(inputFieldStyle)
  }
});

const looneyCheckbox = defineStyle({
  control: {
    borderRadius: '100%'
  }
});

export const buttonTheme = defineStyleConfig({
  variants: {
    solid: solidButton,
    destructiveSolid: destructiveSolidButton,
    destructiveSolidLight: destructiveSolidLightButton,
    flat: flatButton,
    floating: floatingButton,
    link: linkButton
  }
});

export const textTheme = defineStyleConfig({
  variants: { muted: mutedText }
});

export const checkboxTheme = defineStyleConfig({
  variants: { looney: looneyCheckbox }
});

export const formLabelTheme = defineStyleConfig({
  baseStyle: defineStyle({
    color: '#5C5F64',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    letterSpacing: '-0.001em',
    marginInlineEnd: '0'
  })
});

export const breadcrumbTheme = defineStyleConfig({
  baseStyle: {
    link: defineStyle({
      color: '#6E7682',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      '&[aria-current="page"]': {
        color: colors.primary[400]
      }
    }),
    list: {
      padding: 0
    }
  }
});

export const menuListTheme = defineStyle({
  baseStyle: defineStyle({
    list: {
      boxShadow:
        '0px 6px 16px rgba(10, 9, 11, 0.08), 0px 0px 0px 1px rgba(10, 9, 11, 0.05)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px'
    },
    item: {
      borderRadius: '6px',
      background: '#FFF'
    }
  })
});

export const popoverTheme = defineStyle({
  baseStyle: defineStyle({
    content: {
      boxShadow:
        '0px 8px 20px rgba(77, 77, 77, 0.14), 0px 1px 3px 1px rgba(77, 77, 77, 0.05)',
      borderRadius: '12px',
      border: 'none'
    }
  })
});

export const inputTheme = defineStyleConfig({
  variants: { outline: inputField }
});

export const modalTheme = defineStyleConfig({
  baseStyle: defineStyle({
    dialog: {
      overflow: 'hidden'
    },
    closeButton: {
      background: '#F3F5F6',
      borderRadius: '40px',
      width: 'auto',
      height: 'auto',
      color: '#969CA6',
      paddingInline: '8px',
      paddingBlock: '4px',
      fontSize: '9px',
      marginTop: '10px',
      ':before': {
        content: '"Close"',
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '15px',
        color: '#969CA6',
        marginRight: '4px'
      },
      ':hover': {
        color: '#000',
        ':before': {
          color: '#000'
        }
      }
    },
    footer: {
      background: '#F7F7F8',
      borderRadius: `0 0 ${borderRadius.radii.md} ${borderRadius.radii.md}`
    },
    body: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
      color: '#585F68',
      padding: '24px',
      paddingBottom: '32px !important',

      '.modal-title': {
        color: '#212224',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '21px',
        letterSpacing: '-0.012em',
        marginBottom: '8px'
      }
    }
  })
});

const alertTheme = defineAlertMultiStyleConfig({
  baseStyle: defineAlertPartsStyle({
    container: {
      borderRadius: borderRadius.radii.md,
      alignItems: 'flex-start'
    },
    description: {
      color: colors.text[400],
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '20px'
    },
    icon: {
      marginRight: '1.5px',
      alignItems: 'center'
    }
  })
});

const breakpoints = {
  sm: '320px',
  md: '768px',
  lg: '1020px',
  xl: '1200px',
  '2xl': '1536px'
};

const theme = extendTheme({
  colors,
  breakpoints,
  ...borderRadius,
  components: {
    Button: buttonTheme,
    Text: textTheme,
    Checkbox: checkboxTheme,
    Alert: alertTheme,
    Input: inputTheme,
    FormLabel: formLabelTheme,
    Modal: modalTheme,
    Menu: menuListTheme,
    Breadcrumb: breadcrumbTheme,
    Textarea: textareaTheme,
    Popover: popoverTheme
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: '#f5f5f5'
      }
    })
  }
});

export default theme;

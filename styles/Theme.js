import { createTheme } from '@material-ui/core/styles';

const primary = '#009efb';
const info = '#604dcf';
const danger = '#f62d51';
const success = '#39c449';
const warning = '#ffbc34';
const dark = '#343a40';
const light = '#eaf2fb';
const blackSecondary = '#35363b';

export default createTheme({
  typography: {
    h3: {
      fontWeight: 100,
    },
  },
  palette: {
    common: {
      blue: `${primary}`,
      orange: `${warning}`,
      green: `${success}`,
      purple: `${info}`,
      darkGrey: `${dark}`,
      lightGrey: `${light}`,
      grey: `${blackSecondary}`,
    },
    primary: {
      main: `${primary}`,
    },
    secondary: {
      main: `${danger}`,
    },
  },
});

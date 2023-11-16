import { createTheme } from '@mui/material';

export const green = {
  50: '#dbece2',
  100: '#a7d0b8',
  200: '#6eb18b',
  300: '#2a9461',
  400: '#008044',
  500: '#006c27',
  600: '#006020',
  700: '#005116',
  800: '#00410b',
  900: '#002700',
};
export const purple = {
  50: '#e9eaf0',
  100: '#c7cada',
  200: '#a3a8c1',
  300: '#8186a7',
  400: '#686c95',
  500: '#505485',
  600: '#494c7d',
  700: '#414371',
  800: '#393964',
  900: '#2d2a4c',
};

const primary = '#009efb';
const info = '#604dcf';
const danger = '#f62d51';
const success = '#39c449';
const warning = '#ffbc34';
const dark = '#343a40';
const light = '#eaf2fb';
const blackSecondary = '#35363b';
const closeButtonBackground = '#f50057';

export const Theme = createTheme({
  typography: {
    h3: {
      fontWeight: 100,
    },
  },
  palette: {
    closeButton: {
      main: `${closeButtonBackground}`,
    },
    primary: {
      main: `${primary}`,
    },
    secondary: {
      main: `${danger}`,
    },
  },
  colors: {
    blue: `${primary}`,
    orange: `${warning}`,
    green: `${success}`,
    purple: `${info}`,
    darkGrey: `${dark}`,
    lightGrey: `${light}`,
    grey: `${blackSecondary}`,
    closeButton: `${closeButtonBackground}`,
  },
});

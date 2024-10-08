import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// @material-ui/core components
import { makeStyles } from '@mui/styles';
// @material-ui/icons

import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  darkCardHeader,
  alternateCardHeader,
  whiteColor,
} from '../../assets/jss/nextjs-material-dashboard.js';

const cardHeaderStyle = {
  cardHeader: {
    padding: '0.75rem 1.25rem',
    marginBottom: '0',
    borderBottom: 'none',
    background: 'transparent',
    zIndex: '3 !important',
    '&$cardHeaderPlain,&$cardHeaderIcon,&$cardHeaderStats,&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$alternateCardHeader,&$roseCardHeader,&$darkCardHeader':
      {
        margin: '0 15px',
        padding: '0',
        position: 'relative',
        color: whiteColor,
      },
    '&:first-child': {
      borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0',
    },
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$alternateCardHeader,&$roseCardHeader,&$darkCardHeader':
      {
        '&:not($cardHeaderIcon)': {
          borderRadius: '3px',
          marginTop: '-20px',
          padding: '15px',
        },
      },
    '&$cardHeaderStats svg': {
      fontSize: '36px',
      lineHeight: '56px',
      textAlign: 'center',
      width: '36px',
      height: '36px',
      margin: '10px 10px 4px',
    },
    '&$cardHeaderStats i,&$cardHeaderStats .material-icons': {
      fontSize: '36px',
      lineHeight: '56px',
      width: '56px',
      height: '56px',
      textAlign: 'center',
      overflow: 'unset',
      marginBottom: '1px',
    },
    '&$cardHeaderStats$cardHeaderIcon': {
      textAlign: 'right',
    },
  },
  cardHeaderPlain: {
    marginLeft: '0px !important',
    marginRight: '0px !important',
  },
  cardHeaderStats: {
    '& $cardHeaderIcon': {
      textAlign: 'right',
    },
    '& h1,& h2,& h3,& h4,& h5,& h6': {
      margin: '0 !important',
    },
  },
  cardHeaderIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$alternateCardHeader,&$roseCardHeader,&$darkCardHeader':
      {
        background: 'transparent',
        boxShadow: 'none',
      },
    '& i,& .material-icons': {
      width: '33px',
      height: '33px',
      textAlign: 'center',
      lineHeight: '33px',
    },
    '& svg': {
      width: '24px',
      height: '24px',
      textAlign: 'center',
      lineHeight: '33px',
      margin: '5px 4px 0px',
    },
  },
  warningCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...warningCardHeader,
    },
  },
  successCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...successCardHeader,
    },
  },
  dangerCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...dangerCardHeader,
    },
  },
  infoCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...infoCardHeader,
    },
  },
  primaryCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...primaryCardHeader,
    },
  },
  alternateCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...alternateCardHeader,
    },
  },
  roseCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...roseCardHeader,
    },
  },
  darkCardHeader: {
    color: whiteColor,
    '&:not($cardHeaderIcon)': {
      ...darkCardHeader,
    },
  },
};

export default function CardHeader(props) {
  const useStyles = makeStyles(cardHeaderStyle);
  const classes = useStyles();
  const { className, children, color, plain, stats, icon, ...rest } = props;

  const cardHeaderClasses = classNames({
    [classes.cardHeader]: true,
    [classes[color + 'CardHeader']]: color,
    [classes.cardHeaderPlain]: plain,
    [classes.cardHeaderStats]: stats,
    [classes.cardHeaderIcon]: icon,
    [className]: className !== undefined,
  });
  return (
    <div className={cardHeaderClasses} {...rest}>
      {children}
    </div>
  );
}

CardHeader.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'warning',
    'success',
    'danger',
    'info',
    'primary',
    'alternate',
    'rose',
    'dark',
  ]),
  plain: PropTypes.bool,
  stats: PropTypes.bool,
  icon: PropTypes.bool,
  children: PropTypes.node,
};

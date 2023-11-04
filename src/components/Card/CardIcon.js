import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';

import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  darkCardHeader,
} from '../../assets/jss/nextjs-material-dashboard';

const cardIconStyle = {
  cardIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader,&$darkCardHeader':
      {
        borderRadius: '3px',
        backgroundColor: '#e6e6e6',
        padding: '15px',
        marginTop: '-20px',
        marginRight: '15px',
        float: 'left',
      },
  },

  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  darkCardHeader,

  // $warningCardHeader: '#ffc656',
  // $successCardHeader: '#8db255',
  // $dangerCardHeader: '#e12c2c',
  // $infoCardHeader: '#43c0fe',
  // $primaryCardHeader: '#604dcf',
  // $roseCardHeader: '#fcb0ff',
  // $darkCardHeader: '#1f262a ',
};
export default function CardIcon(props) {
  const useStyles = makeStyles(cardIconStyle);
  const classes = useStyles();
  const { className, children, color, ...rest } = props;
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [classes[color + 'CardHeader']]: color,
    [className]: className !== undefined,
  });
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  );
}

CardIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'rose', 'dark']),
  children: PropTypes.node,
};

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import { makeStyles } from '@mui/styles';
import FormControl from '@material-ui/core/FormControl';
import { TextField } from '@mui/material';
import Input from '@material-ui/core/Input';
// @material-ui/icons
import Clear from '@material-ui/icons/Clear';
import Check from '@material-ui/icons/Check';
// core components
// import styles from "assets/jss/nextjs-material-dashboard/components/customInputStyle.js";

export default function TextForm(props) {
  const {
    formControlProps,
    label,
    id,
    name,
    placeholder,
    value,
    variant,
    InputLabelProps,
    InputProps,
    error,
    success,
    onChange,
    type,
    disabled,
    fullwidth,
    helperText,
    required,
    size,
    rows,
    multiline,
  } = props;

  const styles = {
    // root: {
    //   "&.MuiInputLabel-root": {
    //     fontSize: 8,
    //   },
    // },
    textField: {
      color: '#DEEE !important',
      fontWeight: '400',
      marginTop: 30,
    },
    input: {
      // fontSize: value !== "" ? 14 : 24,
      fontSize: 14,
      paddingLeft: 6,
      height: 32,
      //color: "#DEEE !important",
    },
    focused: {
      background: 'yellow',
      // color: "yellow",
    },
    underline: {
      '&:hover:not($disabled):before,&:before': {
        borderColor: '#555555 !important',
        borderWidth: '1px !important',
      },
      '&:after': {
        borderColor: '#ab47bc',
      },
    },
  };

  const useStyles = makeStyles(styles);

  const classes = useStyles();

  const labelClasses = classNames({
    [' ' + classes.labelRootError]: error,
    [' ' + classes.labelRootSuccess]: success && !error,
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
  });
  const marginTop = classNames({
    [classes.marginTop]: label === undefined,
  });

  return (
    // <FormControl {...formControlProps} className={" "}>
    <>
      <TextField
        className={classes.textField}
        // className={classes.labelRoot + labelClasses}
        key={id}
        name={name}
        onChange={onChange}
        type={type}
        value={value}
        disabled={disabled}
        fullwidth={fullwidth}
        helperText={helperText}
        variant={variant}
        label={label}
        placeholder={placeholder}
        required={required}
        size={size}
        multiline={multiline}
        rows={rows}
        InputProps={{
          // className: classes.input,
          classes: {
            // root: classes.x,
            // disabled: classes.disabled,
            input: classes.input,
            underline: classes.underline,
          },
        }}
        // {...InputLabelProps}
      ></TextField>
      {/* {label !== undefined ? (
        <TextField
          className={classes.textField}
          key={id}
          name={name}
          onChange={onChange}
          type={type}
          value={value}
          disabled={disabled}
          fullWidth={fullWidth}
          helperText={helperText}
          label={label}
          placeholder={placeholder}
          required={required}
          size={size}
          InputProps={{
            className: classes.input,
            classes: {
              root: classes.root,
              focused: classes.focused,
            },
          }}
          {...InputLabelProps}
        ></TextField>
      ) : null}
      <Input
        classes={{
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses,
        }}
        id={id}
        {...InputProps}
      /> */}
      {error ? (
        <Clear className={classes.feedback + ' ' + classes.labelRootError} />
      ) : success ? (
        <Check className={classes.feedback + ' ' + classes.labelRootSuccess} />
      ) : null}
    </>
  );
}

TextForm.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  // variant: PropTypes.string,
  size: PropTypes.string,
  rows: PropTypes.number || PropTypes.string,
  multiline: PropTypes.bool,
  placeholder: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullwidth: PropTypes.bool,
  helperText: PropTypes.node,
  onChange: PropTypes.func,
  formControlProps: PropTypes.object,
  // error: PropTypes.bool,
  // success: PropTypes.bool,
};

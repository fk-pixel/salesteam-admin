import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { Check } from 'react-feather';

export default function TextForm(props) {
  const {
    label,
    id,
    name,
    placeholder,
    value,
    variant,
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

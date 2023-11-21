// nodejs library to set properties for components
import { Autocomplete, TextField } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid-pro';
import React from 'react';

export default function AutocompleteEditInputCell(props) {
  const {
    autoHighlight,
    disableClearable,
    options,
    freeSolo,
    getOptionLabel,
    multiple,
    ...params
  } = props;

  const getValue = React.useCallback(() => {
    if (params.value) return params.value.title;

    if (multiple) return [];

    return null;
  }, [params.value, multiple]);

  const [value] = React.useState(getValue);
  const [open, setOpen] = React.useState(true);

  const apiRef = useGridApiContext();

  const handleChange = React.useCallback(
    (event, newValue) => {
      // event.stopPropagation();
      apiRef.current.setEditCellValue({
        id: params.id,
        field: params.field,
        value: newValue?.title !== undefined ? newValue.title : newValue,
      });
    },
    [apiRef, params.field, params.id],
  );

  const handleInputChange = (e, data) => {
    return data;
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      onInputChange={(event, value) =>
        freeSolo && !multiple && event && handleInputChange(event, value)
      }
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      fullWidth
      sx={{
        '&.MuiAutocomplete-endAdornment': {
          top: 0,
        },
      }}
      multiple={multiple}
      options={options ?? []}
      freeSolo={freeSolo}
      autoHighlight={autoHighlight}
      autoSelect={true}
      getOptionLabel={getOptionLabel}
      disableClearable={disableClearable}
      renderInput={(inputParams) => (
        <TextField {...inputParams} fullWidth size="small" error={params.error} />
      )}
    />
  );
}

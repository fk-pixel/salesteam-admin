import { Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import Image from 'next/image';

import { buildURL } from '../../../sanity/lib/image';
import noImage from '../..//assets/images/users/noimage.png';
import { urlFor } from '../../../sanity/utils/client';
import { Field } from 'formik';
import React from 'react';

export default function ImageDialog({
  values,
  setValues,
  setFieldValue,
  onChangeCargoLabel,
  openImage,
  handleClose,
}) {
  //   const rowData = data.find((x) => x._id === rowID);

  //   console.log('rowData', rowData);
  const [cargoLabel, setCargoLabel] = React.useState();
  // console.log('c', cargoLabel);
  // console.log('values', values);

  return (
    <Dialog key={'imageDialog'} open={openImage} onClose={handleClose} fullScreen={true}>
      <DialogContent>
        <Image
          src={
            values.cargoLabel === null || values.cargoLabel === undefined
              ? noImage
              : values.cargoLabel?.asset?._ref
              ? urlFor(values.cargoLabel)?.url()
              : URL.createObjectURL(values.cargoLabel)
          }
          layout="fill"
          objectFit="none"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#f50057',
            '&:hover': {
              backgroundColor: '#f50057',
            },
          }}
          onClick={handleClose}
        >
          Kapat
        </Button>
        <Field id={`${values.cargoLabel}`} name={`${values.cargoLabel}`}>
          {({ field }) => (
            <>
              <input
                {...field}
                id={`${values.cargoLabel}`}
                name={`${values.cargoLabel}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  onChangeCargoLabel(e, field, values, setValues);
                  // setFieldValue('values.cargoLabel', e.currentTarget.files[0]);
                  // setCargoLabel(e.currentTarget.files[0]);
                  // setValues({ ...values, cargoLabel });
                }}
                style={{ display: 'none' }}
              />
              <label htmlFor={`${values.cargoLabel}`}>
                <Button variant="contained" color="inherit" component={'span'}>
                  Resmi Degistir
                </Button>
              </label>
            </>
          )}
        </Field>

        <a href={`${buildURL(values.cargoLabel?.asset)}?dl=`} download>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="contained"
            disabled={values.cargoLabel?.asset._ref === undefined}
            color="primary"
          >
            Resmi Indir
          </Button>
        </a>
      </DialogActions>
    </Dialog>
  );
}

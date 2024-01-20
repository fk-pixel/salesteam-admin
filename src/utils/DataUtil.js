import React from 'react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const getSalesInfos = (orders, dateRange) => {
  const productSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) => (x.products?.length > 0 ? x.products.map((y) => y.productPiece) : 0))
          .reduce((acc, val) => acc + val, 0)
      : 0;

  const giftSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) => (x.gifts?.length > 0 ? x.gifts.map((y) => y.giftPiece) : 0))
          .reduce((acc, val) => acc + val, 0)
      : 0;

  const panelSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) =>
            x.products?.length > 0
              ? x.products.map((y) => (y.productMainType === 'panel' ? y.productPiece : 0))
              : 0,
          )
          .reduce((acc, val) => acc + val, 0)
      : 0;

  const ruloSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) =>
            x.products?.length > 0
              ? x.products.map((y) => (y.productMainType === 'roll' ? y.productPiece : 0))
              : 0,
          )
          .reduce((acc, val) => acc + val, 0)
      : 0;

  return { productSalesInfo, giftSalesInfo, panelSalesInfo, ruloSalesInfo };
};

export const makeDateRange = (range, setDateRange) => {
  const last360 = 365;
  const last39 = 30;
  const last7 = 7;
  switch (range) {
    case 365:
      break;
    case 30:
      break;
    case 7:
      break;
    default:
      break;
  }
};

export const useDateRanger = (setDateRange) => {
  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack direction={'row'} spacing={3} sx={{ marginBottom: 6 }}>
          <DatePicker
            id={'start'}
            name="start"
            format="dd/MM/yyyy"
            value={start}
            label="Başlangıç tarihi"
            onChange={(val) => setStart(val)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <DatePicker
            id={'end'}
            name="end"
            format="dd/MM/yyyy"
            value={end}
            label="Bitiş tarihi"
            onChange={(val) => setEnd(val)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Stack>
      </LocalizationProvider>
    </>
  );
};

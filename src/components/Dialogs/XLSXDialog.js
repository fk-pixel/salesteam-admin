import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createDownloadExcel } from '../../utils/ExcelUtil';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function XLSXDialog({ data, openXLSX, handleClose }) {
  const [XLSXState, setXLSXState] = React.useState({
    id: uuidv4(),
    startDate: new Date(),
    endDate: new Date(),
    hideColumn: {
      product: false,
      productSize: false,
      productMainType: false,
      productSubType: false,
      productCargoType: false,
      description: false,
    },
  });

  const columns = [
    'Siparis ID',
    'Store',
    'Ürün Adi',
    'Ölcü',
    'Ürün Ana Tipi',
    'Ürün Alt Tipi',
    'Ürün Kargo Tipi',
    'Maliyet',
    'Paketleme Maliyeti',
    'Kargo Maliyeti',
    'Satis Fiyati',
    'Tarih',
    'Ay',
  ];

  const sheetName = 'Siparis Tablosu';

  const fileName = 'siparis_tablo';

  const createXLSX = () => {
    createDownloadExcel(data, columns, sheetName, fileName, [
      XLSXState.startDate,
      XLSXState.endDate,
    ]);
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={openXLSX} onClose={handleClose} id={'createExcel'}>
        <DialogTitle>Excel Oluştur</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 6 }}>
            xlsx dosyasını oluşturmak için bir tarih aralığı seçin
          </DialogContentText>
          <form>
            <Stack direction={'row'} spacing={3} sx={{ marginBottom: 6 }}>
              <DatePicker
                id={'startDate'}
                name="startDate"
                format="dd/MM/yyyy"
                value={XLSXState.startDate}
                label="Başlangıç tarihi"
                onChange={(val) =>
                  setXLSXState({
                    ...XLSXState,
                    startDate: val,
                  })
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <DatePicker
                id={'endDate'}
                name="endDate"
                format="dd/MM/yyyy"
                value={XLSXState.endDate}
                label="Bitiş tarihi"
                onChange={(val) =>
                  setXLSXState({
                    ...XLSXState,
                    endDate: val,
                  })
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              backgroundColor: '#f50057',
              '&:hover': {
                backgroundColor: '#f50057',
              },
              color: '#fff',
            }}
            variant="contained"
          >
            Kapat
          </Button>
          <Button
            onClick={createXLSX}
            style={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              color: '#fff',
            }}
            variant="contained"
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDownloadExcel } from '../../common/Utils/ExcelUtil';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Stack } from '@mui/material';

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

  //   const handleChange = (target) => {
  //     setXLSXState((prev) => ({
  //       ...prev,
  //       [target.id]: target.value,
  //     }));

  //     // setXLSXState({ ...XLSXState, startDate: target });
  //   };

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
    useDownloadExcel(data, columns, sheetName, fileName, [XLSXState.startDate, XLSXState.endDate]);
    handleClose();
  };

  return (
    <Dialog
      open={openXLSX}
      onClose={handleClose}
      //BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      //hideBackdrop
      id={'createExcel'}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DialogTitle>Excel Oluştur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            xlsx dosyasını oluşturmak için bir tarih aralığı seçin
          </DialogContentText>
          <form>
            <Stack direction={'row'} spacing={3} sx={{ marginBottom: 6 }}>
              <KeyboardDatePicker
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
                style={{ marginTop: 36 }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
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
                style={{ marginTop: 36 }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Stack>

            {/* <Box style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={<Checkbox id={'showColumns'} />}
                  label={`Sütunlari gizle:`}
                  options={[
                    { id: 'product', label: 'Product' },
                    { id: 'productSize', label: 'Product Size' },
                    { id: 'productMainType', label: 'Product Main Type' },
                    { id: 'productSubType', label: 'Product Sub Type' },
                    { id: 'productCargoType', label: 'Product Cargo Type' },
                    { id: 'description', label: 'Description' },
                  ]}
                  onChange={(e) =>
                    setXLSXState({
                      ...XLSXState,
                      hideColumn: {
                        product: e.target.checked,
                        productSize: e.target.checked,
                        productMainType: e.target.checked,
                        productSubType: e.target.checked,
                        productCargoType: e.target.checked,
                        description: e.target.checked,
                      },
                    })
                  }
                />
              </Box> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Kapat
          </Button>
          <Button onClick={createXLSX} color="primary" variant="contained">
            Oluştur
          </Button>
        </DialogActions>
      </MuiPickersUtilsProvider>
    </Dialog>
  );
}

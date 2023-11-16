import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Save from '@mui/icons-material/Save';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
  Tooltip,
} from '@mui/material';
import { toast } from 'react-toastify';
import { deleteOrder, updateOrder } from '../../../sanity/utils/order-utils';
import { STATUS_OPTIONS } from '../../utils/FormsUtil';
import { sendContactForm } from '../../../controller/api';

const classes = {
  closeButtonSX: {
    backgroundColor: '#f50057',
    '&:hover': {
      backgroundColor: '#f50057',
    },
  },
};

export function MailAction({ convertedData, selectedRowID, openMail, handleClose }) {
  const [mailState, setMailState] = React.useState({
    id: uuidv4(),
    sender: 'salesteam.ilk@gmail.com',
    recipient: '',
    context: '',
    message: '',
  });

  const handleChange = ({ target }) => {
    setMailState((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const rowData = convertedData.find((x) => x._id === selectedRowID);
  const mailData = { ...rowData, ...mailState };

  const sendEmail = async () => {
    await sendContactForm(mailData);
    handleClose();
    // e.preventDefault();

    // try {
    //   const req = await sendContactForm(mailData);
    //   if (req.status === 250) {
    //     toast('Email basariyla gönderildi', {
    //       type: 'success',
    //     });
    //     handleClose();
    //   }
    // } catch (e) {
    //   toast(`Kayit isleminiz eksik veya gecersizdir. Sorun: ${e}`, {
    //     type: 'error',
    //   });
    //   handleClose();
    // }

    // try {
    //   const req = await fetch('api/contactWithSeller', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(mailData),
    //   });
    //   if (req.ok) {
    //     toast('Email basariyla gönderildi', {
    //       type: 'success',
    //     });
    //     handleClose();
    //   }
    // } catch (e) {
    //   toast(`Kayit isleminiz eksik veya gecersizdir. Sorun: ${e}`, {
    //     type: 'error',
    //   });
    //   handleClose();
    // }

    // await fetch('/api/contactWithSeller', {
    //   method: 'POST',
    //   body: JSON.stringify(mailData),
    // })
    //   .then(() => {
    //     toast('Email basariyla gönderildi', {
    //       type: 'success',
    //     });
    //     handleClose();
    //   })
    //   .catch(() => {
    //     toast(`Kayit isleminiz eksik veya gecersizdir. Lütfen tekrar deneyin`, {
    //       type: 'error',
    //     });
    //   });
  };

  return (
    <Dialog open={openMail} onClose={handleClose} hideBackdrop id={selectedRowID}>
      <DialogTitle>Mail Gönder</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>'{rowData?._id} '</strong> siparisi icin üreticiyle temasa gecin.
        </DialogContentText>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="sender"
            name="sender"
            label="Email Gönderen"
            value={mailState.sender}
            type="email"
            fullWidth
            variant="standard"
            style={{ marginTop: 24 }}
            disabled
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="recipient"
            name="recipient"
            label="Alici"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="context"
            name="context"
            label="Konu"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="message"
            name="message"
            label="Mesaj"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={12}
            onChange={handleChange}
          />
        </form>
        {mailState.mailFile !== null && <pre>{mailState.mailFile}</pre>}
      </DialogContent>
      <DialogActions>
        <Button
          sx={classes.closeButtonSX}
          variant="contained"
          //color="closeButton"
          onClick={handleClose}
        >
          Kapat
        </Button>
        <Button
          type="submit"
          onClick={sendEmail}
          disabled={!mailState.recipient}
          color="primary"
          variant="contained"
        >
          Gönder
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteAction({ selectedRowID, openDelete, handleClose }) {
  //const rowData = convertedData.find((x) => x._id === selectedRowID);
  const onRemove = async (orderID) => {
    await deleteOrder(orderID)
      .then(async () => {
        toast(`Siparis ${orderID} basariyla silindi`, {
          type: 'success',
        });
        handleClose(orderID);
      })
      .catch((error) => {
        toast(`Kayit isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
          type: 'error',
        });
      });
  };

  return (
    <>
      <Dialog
        id={selectedRowID}
        open={openDelete}
        onClose={handleClose}
        hideBackdrop
        PaperProps={{
          sx: {
            // boxShadow: 'none',
            // backgroundColor: 'rgba(255, 255, 255, .2)',
          },
          // style: {
          //   backgroundColor: 'transparent',
          // },
        }}
      >
        <DialogTitle>Siparisi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong style={{ color: 'red' }}>{selectedRowID}</strong> siparisi silmek istediginizden
            emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={classes.closeButtonSX} onClick={handleClose} variant="contained">
            Kapat
          </Button>
          <Button color="primary" onClick={() => onRemove(selectedRowID)} variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function SaveAction({ params, selectedRowID, convertedData }) {
  const originalData = convertedData.find((x) => x._id === selectedRowID);
  const isEqualRowData = _.isEqual(params.row, originalData);

  const onSave = async (row) => {
    const editedData = {
      cost: row.cost,
      packagingCost: row.packagingCost,
      shippingCost: row.shippingCost,
      description: row.description,
      status: STATUS_OPTIONS.find((o) => o.title === row.status)?.value,
      price: row.price,
    };

    await updateOrder(row._id, editedData)
      .then(() => {
        toast(<div>Siparis basariyla güncellendi</div>, {
          type: 'success',
        });
      })
      .catch((error) => {
        toast(`Güncelleme isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
          type: 'error',
        });
      });
  };

  return (
    <>
      <Tooltip title={!isEqualRowData ? 'Degisikligi kaydet' : ''}>
        <Fab
          key={'save'}
          color="primary"
          size="small"
          disabled={params.id !== selectedRowID || isEqualRowData}
          onClick={() => onSave(params.row)}
        >
          <Save />
        </Fab>
      </Tooltip>
    </>
  );
}

// {
//   field: 'actions',
//   type: 'actions',
//   headerName: 'Actions',
//   width: 100,
//   cellClassName: 'actions',
//   renderCell: (params) => (
//     <Actions
//       {...{
//         params,
//         selectedRowID,
//         onSave,
//         convertedData,
//         isAdmin,
//         openDelete,
//         openMail,
//         handleClose,
//       }}
//     />
//   ),
//   // getActions: (params) => {
//   //  return [<Actions {...{ params, selectedRowID, onSave, convertedData }} />];
//   //  return [<></>];
//   //},
// },

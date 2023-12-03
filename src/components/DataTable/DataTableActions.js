import { Delete, ForwardToInbox, Info, Save, Send } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Fab,
  TextField as MuiTextField,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Autocomplete as MAutocomplete, TextField as MTextField } from 'formik-mui';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

import { sendContactForm } from '../../../controller/api';
import { deleteOrder, updateNotifications, updateOrder } from '../../../sanity/utils/order-utils';
import { STATUS_OPTIONS } from '../../utils/FormsUtil';

const classes = {
  closeButtonSX: {
    backgroundColor: '#f50057',
    '&:hover': {
      backgroundColor: '#f50057',
    },
  },
  updateButtonSX: {
    width: 122,
    borderRadius: 2,
    backgroundColor: '#1d1c1a',
    '&:hover': {
      backgroundColor: '#1d1c1a',
    },
  },
};

export function MailAction({ params, convertedData }) {
  const [openMail, setOpenMail] = React.useState();
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

  const rowData = convertedData.find((x) => x._id === params.row._id);

  const mailData = { ...rowData, ...mailState };

  const sendEmail = async () => {
    await sendContactForm(mailData);
    setOpenMail(false);
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
    <>
      <Tooltip title={'Mail gönder'}>
        <span>
          <GridActionsCellItem
            key={'mail'}
            icon={
              <ForwardToInbox
                sx={classes.tableButtonSX}
                onClick={() => {
                  setOpenMail(true);
                }}
              />
            }
            label="Send"
          />
        </span>
      </Tooltip>

      <Dialog open={openMail} onClose={() => setOpenMail(false)} hideBackdrop id={rowData._id}>
        <DialogTitle>Mail Gönder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>&apos;{rowData?._id}&apos;</strong> siparisi icin üreticiyle temasa gecin.
          </DialogContentText>
          <form>
            <MuiTextField
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
            <MuiTextField
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
            <MuiTextField
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
            <MuiTextField
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
            onClick={() => setOpenMail(false)}
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
    </>
  );
}

export function DeleteAction({ params }) {
  const [openDelete, setOpenDelete] = React.useState(false);

  const selectedID = params.row._id;

  const onRemove = async (orderID) => {
    await deleteOrder(orderID)
      .then(async () => {
        toast(`Siparis ${orderID} basariyla silindi`, {
          type: 'success',
        });
        setOpenDelete(false);
      })
      .catch((error) => {
        toast(`Kayit isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
          type: 'error',
        });
      });
  };

  return (
    <>
      <Tooltip title={'Siparisi sil'}>
        <span>
          <GridActionsCellItem
            key={'delete'}
            icon={
              <Delete
                sx={classes.tableButtonSX}
                onClick={() => {
                  setOpenDelete(true);
                }}
              />
            }
            label="Delete"
          />
        </span>
      </Tooltip>
      <Dialog
        id={selectedID}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
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
            <strong style={{ color: 'red' }}>{selectedID}</strong> siparisi silmek istediginizden
            emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={classes.closeButtonSX}
            onClick={() => setOpenDelete(false)}
            variant="contained"
          >
            Kapat
          </Button>
          <Button color="primary" onClick={() => onRemove(selectedID)} variant="contained">
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

export function SupportAction({ params, convertedData, isAdmin }) {
  //const isNonMobile = useMediaQuery('(min-width:600px)');
  console.log('isAdmin', isAdmin);
  const [openSupportDrawer, setOpenSupportDrawer] = React.useState(false);

  const rowData = convertedData.find((x) => x._id === params.row._id);

  const initialValues = {
    _createdAt: new Date(),
    flag: { value: '', title: '' },
    context: '',
    note: '',
    noteToAdmin: [],
  };

  //console.log(rowData);

  const onSave = async (values, resetForm) => {
    const { notifications } = rowData;

    const editedData = [...notifications, { ...values, flag: values.flag.value }];

    await updateNotifications(rowData._id, editedData)
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

    resetForm();
  };

  const setChipColor = (criteria) => {
    switch (criteria) {
      case 'warning':
        return '#ff9800';
      case 'danger':
        return '#f44336';
      case 'success':
        return '#4caf50';

      default:
        return '#42a5f5';
    }
  };

  // React.useEffect(() => {
  //   if (!isAdmin) {
  //     const adminUsers = async () => {
  //       const data = await fetchAdmins();
  return (
    <>
      <Tooltip title={'Admin destek hatti'}>
        <span>
          <GridActionsCellItem
            key={'support'}
            icon={<Info sx={classes.tableButtonSX} onClick={() => setOpenSupportDrawer(true)} />}
            label="Support"
          />
        </span>
      </Tooltip>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
        <Drawer
          //key={initialValues?._id}
          sx={{ '& .MuiDrawer-paper': { width: '475px', justifyContent: 'space-between' } }}
          anchor={'right'}
          open={openSupportDrawer}
          onClose={() => setOpenSupportDrawer(false)}
        >
          <Box
            sx={{
              padding: 2,
              // overflow: initialValues.length > 0 ? 'scroll' : '-moz-hidden-unscrollable',
              // overflow: initialValues.notifications !== null ? 'scroll' : 'hidden',
              overflow: 'scroll',
            }}
          >
            {rowData.notifications?.map((x, i) => (
              <Box
                key={i}
                sx={{
                  display: 'block',
                  //justifyContent: 'space-between',
                  marginBottom: 2,
                  marginLeft: 4,
                  backgroundColor: '#dddd',
                  borderRadius: 4,
                  borderBottomRightRadius: 0,
                  padding: 2,
                }}
              >
                {/* <Chip
                  label={x.context}
                  sx={{ fontWeight: 600, backgroundColor: setChipColor(x.flag), marginBottom: 1 }}
                /> */}
                <div
                  style={{
                    fontWeight: 600,
                    backgroundColor: setChipColor(x.flag),
                    marginBottom: 4,
                    marginTop: -20,
                    padding: 4,
                    borderRadius: 2,
                    width: 'fit-content',
                    minWidth: 55,
                    color: 'white',
                  }}
                >
                  {x.context}
                </div>
                <Box sx={{}} display={'block'}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: 'grey',
                      //color: #daf6ff,
                      //fontFamily: 'Share Tech Mono',
                      //transform: 'translate(-50%, -50%)',
                      //textShadow: '0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0)',
                    }}
                  >
                    {format(new Date(x._createdAt), 'dd/MM/yyyy, HH:mm')}
                  </Typography>
                  <Typography>{x.note}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            sx={{ position: 'sticky', borderTop: '1px solid #dddd', margin: 2 }}
          >
            <Formik
              onSubmit={(values, { resetForm }) => onSave(values, resetForm)}
              //innerRef={formRef}
              //onChange={onChange}
              // onSubmit={(values, actions) => {
              //   setSupportMessage([...supportMesage, { ...values, createdAt: new Date() }]);
              //   actions.resetForm();
              //   //await new Promise((resolve) => setSupportMessage([...supportMesage, resolve]));
              // }}
              initialValues={initialValues}
              //onSubmit={(values) => onSave(values)}
              // validationSchema={validationSchema}
              //validateOnChange={false}
            >
              {({
                //values,
                // errors,
                // touched,
                // setValues,
                setFieldValue,
              }) => (
                <Form>
                  <Box sx={{ marginTop: 6, padding: 2 }} display={'block'}>
                    <Stack direction={'row'}>
                      <Field
                        name={`flag`}
                        component={MAutocomplete}
                        options={[
                          { value: 'danger', title: '🟥 Kritik' },
                          { value: 'warning', title: '🟧 Uyari' },
                          { value: 'info', title: '🟦 Bilgilendirme' },
                          { value: 'success', title: '🟩 Basarili' },
                        ]}
                        getOptionLabel={(o) => o.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(e, value) => {
                          setFieldValue('flag', value ? value : { value: '', title: '' });
                        }}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`flag`}
                            label="Destek kriteri"
                            variant="outlined"
                          />
                        )}
                      />
                    </Stack>
                    {/* <Field
                      name={`noteToAdmin`}
                      component={MAutocomplete}
                      options={makeOptionFromSanity(adminss)}
                      getOptionLabel={(o) => o.title}
                      //isOptionEqualToValue={(option, value) => option.id === value.id}
                      fullWidth
                      renderOptions={(props, o) => (
                        <li {...props} key={o._id}>
                          {o.title}
                        </li>
                      )}
                      filterSelectedOptions
                      // filterOptions={(f) => f}
                      filterOptions={(options) =>
                        options.filter((o) => {
                          o;
                          //console.log('res', o);
                          //console.log('values.noteToAdmin', values.noteToAdmin);
                          // values.noteToAdmin?.length > 0
                          //   ? !values.noteToAdmin.includes(o)
                          //   : undefined;
                        })
                      }
                      multiple
                      disableClearable
                      onChange={(e, v) =>
                        setFieldValue(
                          'noteToAdmin',
                          //v !== null ? [...values.noteToAdmin, v] : [{ value: '', title: '' }],
                          v,
                        )
                      }
                      // onChange={(event, newPet) => {
                      //   setSelectedPets(newPet);
                      // }}
                      // inputValue={petInputValue}
                      // onInputChange={(event, newPetInputValue) => {
                      //   setPetInputValue(newPetInputValue);
                      // }}
                      //onInputChange={(e, v) => setFieldValue('noteToAdmin', v)}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          //name={`noteToAdmin`}
                          //   error={Boolean(
                          //     values.products?.[i]?.productMainType?.value === undefined ||
                          //       values.products?.[i]?.productMainType?.value === '',
                          //   )}
                          //onChange={({ target }) => setFieldValue('noteToAdmin', target.value)}
                          label="Admin Destek"
                          variant="outlined"
                          //margin="dense"
                          //   size="small"
                        />
                      )}
                    /> */}
                    <Stack direction={'column'}>
                      <Field
                        fullWidth
                        component={MTextField}
                        type="text"
                        id={`context`}
                        name={`context`}
                        label="Konu"
                        onChange={(e) => {
                          setFieldValue('context', e.target.value);
                        }}
                      />
                      <Field
                        fullWidth
                        component={MTextField}
                        type="text"
                        id={`note`}
                        name={`note`}
                        label="Not"
                        multiline
                        rows={4}
                        onChange={(e) => {
                          setFieldValue('note', e.target.value);
                        }}
                      />
                    </Stack>
                  </Box>
                  <Box display={'flex'} justifyContent={'center'}>
                    {' '}
                    <Button variant="contained" sx={classes.updateButtonSX} type="submit">
                      <Send fontSize="small" />
                      Gönder
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

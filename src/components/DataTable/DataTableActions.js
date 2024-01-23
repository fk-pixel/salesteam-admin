import React from 'react';
import { Delete, ForwardToInbox, Info, Save, Send } from '@mui/icons-material';
import {
  Avatar,
  AvatarGroup,
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
import { Field, Form, Formik } from 'formik';
import { Autocomplete as MAutocomplete, TextField as MTextField } from 'formik-mui';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

import { sendContactForm } from '../../../controller/api';
import { deleteOrder, createNotifications, updateOrder } from '../../../sanity/utils/order-utils';
import { STATUS_OPTIONS } from '../../utils/FormsUtil';
import { getAdminNameWithAvatar, makeOptionFromSanity } from '../../utils/DashboardUtil';
import { fetchAdmins } from '../../../sanity/utils/notification-utils';

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
  const [isSubmitting, setIsSubmiting] = React.useState(false);

  const onSave = async (row) => {
    const editedData = {
      cost: row.cost,
      packagingCost: row.packagingCost,
      shippingCost: row.shippingCost,
      description: row.description,
      status: STATUS_OPTIONS.find((o) => o.title === row.status)?.value,
      price: row.price,
    };

    setIsSubmiting(false);

    await updateOrder(row._id, editedData)
      .then(() => {
        toast(<div>Siparis basariyla güncellendi</div>, {
          type: 'success',
        });
        setIsSubmiting(true);
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
          disabled={params.id !== selectedRowID || isEqualRowData || isSubmitting}
          onClick={() => onSave(params.row)}
        >
          <Save />
        </Fab>
      </Tooltip>
    </>
  );
}

export function SupportAction({ params, convertedData }) {
  //const isNonMobile = useMediaQuery('(min-width:600px)');

  const [openSupportDrawer, setOpenSupportDrawer] = React.useState(false);
  const [admins, setAdmins] = React.useState([]);

  const rowData = convertedData.find((x) => x._id === params.row._id);
  const answers = rowData.notifications?.flatMap((notification) =>
    notification.answers?.map((answer) => ({
      ...answer,
      createdAt: format(new Date(answer.createdAt), 'dd.MM.yyyy, HH:mm'),
    })),
  );
  // .toSorted();
  const [initialValues] = React.useState({
    createdAt: new Date(),
    flag: { value: '', title: '' },
    context: '',
    note: '',
    noteToAdmin: [],
    answers: [],
  });

  const hasNotifications = rowData.notifications?.length > 0;

  const onSave = async (values, resetForm) => {
    const { notifications } = rowData;

    const setNotifications =
      notifications === null
        ? []
        : notifications.map((notification) => ({
            ...notification,
            noteToAdmin: notification?.noteToAdmin?.map((admin) => ({
              _type: 'reference',
              _ref: admin._id,
            })),
            answers:
              notification?.answers === null
                ? []
                : notification?.answers?.map((answer) => ({
                    ...answer,
                    answeredBy: {
                      _type: 'reference',
                      _ref: answer.answeredBy._id,
                    },
                  })),
          }));

    const editedData = [
      ...setNotifications,
      {
        ...values,
        flag: values.flag.value,
        noteToAdmin: values.noteToAdmin.map((admin) => ({ _type: 'reference', _ref: admin.value })),
        answers: [],
      },
    ];

    await createNotifications(rowData._id, editedData)
      .then(() => {
        toast(<div>Destek hattina mesajiniz iletildi</div>, {
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

  React.useEffect(() => {
    const adminUsers = async () => {
      const data = await fetchAdmins();
      if (data !== undefined) {
        setAdmins(data);
      }
    };

    adminUsers();
  }, []);

  const adminOptions = makeOptionFromSanity(admins);

  return (
    <>
      <Tooltip title={'Admin destek hatti'}>
        <span>
          <GridActionsCellItem
            key={'support'}
            icon={
              <Info
                sx={classes.tableButtonSX}
                onClick={() => setOpenSupportDrawer(true)}
                color={hasNotifications ? 'info' : 'inherit'}
              />
            }
            label="Support"
          />
        </span>
      </Tooltip>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
        <Drawer
          sx={{ '& .MuiDrawer-paper': { width: '475px', justifyContent: 'space-between' } }}
          anchor={'right'}
          open={openSupportDrawer}
          onClose={() => setOpenSupportDrawer(false)}
        >
          <Box
            sx={{
              padding: 2,
              minHeight: '62dvh',
              overflow: 'scroll',
            }}
          >
            {rowData.notifications?.map((x, i) => (
              <>
                <Box sx={{ display: 'block' }}>
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
                        textAlign: 'center',
                      }}
                    >
                      {x.context}
                    </div>
                    <Box sx={{ display: 'block' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: 'grey',
                          }}
                        >
                          {format(new Date(x?.createdAt), 'dd/MM/yyyy, HH:mm')}
                        </Typography>
                        <AvatarGroup max={5} sx={{ marginTop: -3 }}>
                          {x.noteToAdmin?.map((admin, index) => {
                            return (
                              <Tooltip key={index} title={`${admin?.username} | ${admin?.email} `}>
                                <Avatar
                                  key={index}
                                  sx={{
                                    bgcolor: 'warning.main',
                                    cursor: 'pointer',
                                    ':hover:not(:last-of-type)': {
                                      transform: 'translate(5px)',
                                      transition: 'transform 0.3s ease',
                                    },
                                    '& .MuiAvatar-root': {
                                      border: '1px solid #c7c7c7',
                                    },
                                  }}
                                >
                                  {getAdminNameWithAvatar(admin?.username)}
                                </Avatar>
                              </Tooltip>
                            );
                          })}
                        </AvatarGroup>
                      </Box>
                      <Typography>{x.note}</Typography>
                    </Box>
                  </Box>
                  {x.answers?.map((answer) => (
                    <>
                      <Box sx={{ display: 'flex' }}>
                        <AvatarGroup
                          max={5}
                          sx={{ paddingRight: 1, paddingTop: 1, alignSelf: 'end' }}
                        >
                          <Tooltip
                            title={`${answer?.answeredBy?.username} | ${answer?.answeredBy?.email} `}
                          >
                            <Avatar
                              sx={{
                                bgcolor: 'warning.main',
                                cursor: 'pointer',
                                ':hover:not(:last-of-type)': {
                                  transform: 'translate(5px)',
                                  transition: 'transform 0.3s ease',
                                },
                                '& .MuiAvatar-root': {
                                  border: '1px solid #c7c7c7',
                                },
                              }}
                            >
                              {getAdminNameWithAvatar(answer?.answeredBy?.username)}
                            </Avatar>
                          </Tooltip>
                        </AvatarGroup>

                        <Box
                          sx={{
                            backgroundColor: '#007aff',
                            borderRadius: 4,
                            borderBottomLeftRadius: 0,
                            padding: 2,
                            marginBottom: 3.5,
                            marginRight: 4,
                            width: '-webkit-fill-available',
                          }}
                        >
                          <Box sx={{ display: 'block' }}>
                            <Typography color={'white'}>{answer?.answer}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  color: 'white',
                                  justifyContent: 'flex-end',
                                }}
                              >
                                {format(new Date(answer?.createdAt), 'dd.MM.yyyy, HH:mm')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ))}
                </Box>
              </>
            ))}

            {/* {answers?.map((x) => (
              <>
                <Box sx={{ display: 'flex' }}>
                  <AvatarGroup max={5} sx={{ paddingRight: 1, paddingTop: 1, alignSelf: 'end' }}>
                    <Tooltip title={`${x?.answeredBy?.username} | ${x?.answeredBy?.email} `}>
                      <Avatar
                        sx={{
                          bgcolor: 'warning.main',
                          cursor: 'pointer',
                          ':hover:not(:last-of-type)': {
                            transform: 'translate(5px)',
                            transition: 'transform 0.3s ease',
                          },
                          '& .MuiAvatar-root': {
                            border: '1px solid #c7c7c7',
                          },
                        }}
                      >
                        {getAdminNameWithAvatar(x?.answeredBy?.username)}
                      </Avatar>
                    </Tooltip>
                  </AvatarGroup>

                  <Box
                    sx={{
                      backgroundColor: '#007aff',
                      borderRadius: 4,
                      borderBottomLeftRadius: 0,
                      padding: 2,
                      marginBottom: 3.5,
                      marginRight: 4,
                      width: '-webkit-fill-available',
                    }}
                  >
                    <Box sx={{ display: 'block' }}>
                      <Typography color={'white'}>{x?.answer}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: 'white',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {x?.createdAt}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            ))} */}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '1px solid #dddd',
              paddingLeft: 2,
              paddingRight: 2,
              height: '45dvh',
            }}
          >
            <Formik
              onSubmit={(values, { resetForm }) => onSave(values, resetForm)}
              initialValues={initialValues}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form>
                  <Stack
                    direction={'column'}
                    spacing={1}
                    sx={{
                      marginTop: 4,
                      display: 'block',
                      position: 'absolute',
                      minWidth: '93%',
                      maxWidth: '93%',
                    }}
                  >
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
                    <Field
                      name={`noteToAdmin`}
                      component={MAutocomplete}
                      options={adminOptions}
                      getOptionLabel={(o) => o.title}
                      fullWidth
                      filterSelectedOptions
                      multiple
                      disableClearable
                      onChange={(e, v) => setFieldValue('noteToAdmin', v)}
                      renderInput={(params) => (
                        <MuiTextField {...params} label="Admin Destek" variant="outlined" />
                      )}
                    />
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
                      rows={3}
                      onChange={(e) => {
                        setFieldValue('note', e.target.value);
                      }}
                    />
                  </Stack>
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      top: '415px',
                    }}
                  >
                    {' '}
                    <Button
                      variant="contained"
                      sx={classes.updateButtonSX}
                      type="submit"
                      disabled={isSubmitting}
                    >
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

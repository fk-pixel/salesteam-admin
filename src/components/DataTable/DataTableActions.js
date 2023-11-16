import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Save from '@mui/icons-material/Save';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Fab,
  Stack,
  TextField as MuiTextField,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';
import { deleteOrder, updateOrder } from '../../../sanity/utils/order-utils';
import { STATUS_OPTIONS } from '../../utils/FormsUtil';
import { sendContactForm } from '../../../controller/api';
import _ from 'lodash';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Delete, ForwardToInbox, Info, Send } from '@mui/icons-material';
import { Field, Form, Formik } from 'formik';
import { TextField as FormikTextField, Autocomplete as FormikAutocomplete } from 'formik-mui';

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
            <strong>'{rowData?._id} '</strong> siparisi icin üreticiyle temasa gecin.
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

export function SupportAction({ params, convertedData }) {
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const [selectedPets, setSelectedPets] = React.useState([]);
  const [petInputValue, setPetInputValue] = React.useState('');
  const [openSupportDrawer, setOpenSupportDrawer] = React.useState(false);

  const rowData = convertedData.find((x) => x._id === params.row._id);

  // const initialValues = {
  //   id: uuidv4(),
  //   createdAt: new Date(),
  //   flag: { value: '', title: '' },
  //   context: '',
  //   note: '',
  //   noteToAdmin: [],
  //   noteByCreated: '',
  // };

  const [supportMesage, setSupportMessage] = React.useState([]);

  const formRef = React.useRef();

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const initialValues = rowData.notifications;

  console.log('supportMesage', rowData.notifications);
  //   const validationSchema = yup.object().shape({
  //     // productNumber: yup.string().required('Lütfen ürün sayisini girin'),
  //     products: yup.array().of(
  //       yup.object().shape({
  //         productName: yup.string().required('Lütfen ürün adini girin'),
  //         productFile: yup
  //           .mixed()
  //           .required('Lütfen ürün resmini yükleyin')
  //           .test('fileFormat', 'image sadece', (value) => {
  //             // console.log(value);
  //             return value && ['image'].includes(value._type);
  //           }),
  //         // productFile: yup.string().required('Lütfen ürün resmini yükleyin'),
  //         productWidth: yup
  //           .string()
  //           .required('Lütfen ürün en ölcüsünü girin')
  //           .matches(/^[0-9]+$/, 'Sadece numara girin')
  //           .min(2, 'En az 2 haneli olmalidir')
  //           .max(3, 'En fazla 3 haneli olmalidir'),
  //         productHeight: yup
  //           .string()
  //           .required('Lütfen ürün boy ölcüsünü girin')
  //           .matches(/^[0-9]+$/, 'Sadece numara girin')
  //           .min(2, 'En az 2 haneli olmalidir')
  //           .max(3, 'En fazla 3 haneli olmalidir'),
  //         productPiece: yup
  //           .string()
  //           .required('Lütfen ürün adedini girin')
  //           .matches(/^[0-9]+$/, 'Sadece numara girin')
  //           .min(1, 'En az 1 haneli olmalidir')
  //           .max(3, 'En fazla 3 haneli olmalidir'),
  //       }),
  //     ),
  //     gifts: yup.array().of(
  //       yup.object().shape({
  //         giftName: yup.string().required('Lütfen hediye adini girin'),
  //         giftFile: yup.string().required('Lütfen hediye resmini yükleyin'),
  //         giftWidth: yup
  //           .string()
  //           .required('Lütfen hediye en ölcüsünü girin')
  //           .matches(/^[0-9]+$/, 'Sadece numara girin')
  //           .min(2, 'En az 2 haneli olmalidir')
  //           .max(4, 'En fazla 4 haneli olmalidir'),
  //         giftHeight: yup
  //           .string()
  //           .required('Lütfen hediye boy ölcüsünü girin')
  //           .matches(/^[0-9]+$/, 'Sadece numara girin')
  //           .min(2, 'En az 2 haneli olmalidir')
  //           .max(4, 'En fazla 4 haneli olmalidir'),
  //         giftPiece: yup
  //           .string()
  //           .required('Lütfen hediye adedini girin')
  //           .matches(/^[0-9]+$/, 'Sadece numara girin')
  //           .min(1, 'En az 1 haneli olmalidir')
  //           .max(3, 'En fazla 3 haneli olmalidir'),
  //       }),
  //     ),
  //   });

  //   function onChangeProducts(e, field, values, setValues) {
  //     const products = [...values.products];

  //     // const Values = values.map((x) => Object.keys(x).filter((y) => y !== 'cargoLabel'));
  //     const {
  //       _id,
  //       _createdAt,
  //       avatar,
  //       cost,
  //       createdBy,
  //       description,
  //       gifts,
  //       isEdiMode,
  //       packagingCost,
  //       price,
  //       shippingCost,
  //       status,
  //       store,
  //     } = values;

  //     setValues({
  //       _id,
  //       _createdAt,
  //       avatar,
  //       cost,
  //       createdBy,
  //       description,
  //       gifts,
  //       isEdiMode,
  //       packagingCost,
  //       price,
  //       shippingCost,
  //       status,
  //       store,
  //       products,
  //     });

  //     // field.onChange(e);
  //   }

  //   function onChangeGifts(e, field, values, setValues) {
  //     const gifts = [...values.gifts];

  //     const {
  //       _id,
  //       _createdAt,
  //       avatar,
  //       cost,
  //       createdBy,
  //       description,
  //       products,
  //       isEdiMode,
  //       packagingCost,
  //       price,
  //       shippingCost,
  //       status,
  //       store,
  //     } = values;

  //     setValues({
  //       _id,
  //       _createdAt,
  //       avatar,
  //       cost,
  //       createdBy,
  //       description,
  //       products,
  //       isEdiMode,
  //       packagingCost,
  //       price,
  //       shippingCost,
  //       status,
  //       store,
  //       products,
  //     });

  //     field.onChange(e);
  //   }

  //   function onChangeCargoLabel(e, field, values, setValues) {
  //     const cargoLabel = e.currentTarget.files[0];
  //     // console.log('cargoLabel', cargoLabel);

  //     setValues({ ...values, cargoLabel });

  //     field.onChange(e);

  //     // console.log('valuesDATA', values);
  //   }

  //   const onChangeOpenDrawer = () => {
  //     setOpenDrawer(!openDrawer);
  //   };

  //   const onSubmit = async (values) => {
  //     const productsWithAssets = values.products?.map(async (product) => {
  //       if (product.productFile?.asset._ref === undefined) {
  //         const asset = await productRegisterToAssets(product);
  //         const file = {
  //           _type: 'image',
  //           asset: {
  //             _type: 'reference',
  //             _ref: asset._id,
  //           },
  //         };

  //         return {
  //           ...product,
  //           productFile: await Promise.resolve(file).then((result) => (product.productFile = result)),
  //         };
  //       } else {
  //         return {
  //           ...product,
  //         };
  //       }
  //     });

  //     const giftsWithAssets = values.gifts?.map(async (gift) => {
  //       if (gift.giftFile?.asset._ref === undefined) {
  //         const asset = await giftRegisterToAssets(gift);
  //         const file = {
  //           _type: 'image',
  //           asset: {
  //             _type: 'reference',
  //             _ref: asset._id,
  //           },
  //         };

  //         return {
  //           ...gift,
  //           giftFile: await Promise.resolve(file).then((result) => (gift.giftFile = result)),
  //         };
  //       } else {
  //         return {
  //           ...gift,
  //         };
  //       }
  //     });

  //     const cargoLabelWithAsset = async () => {
  //       if (values.cargoLabel?.asset._ref === undefined) {
  //         const asset = await imageRegisterToAssets(values.cargoLabel);

  //         const file = {
  //           _type: 'image',
  //           asset: {
  //             _type: 'reference',
  //             _ref: asset._id,
  //           },
  //         };

  //         return {
  //           cargoLabel: await Promise.resolve(file).then((result) => (cargoLabel = result)),
  //         };
  //       } else {
  //         return cargoLabel;
  //       }
  //     };

  //     const products = await Promise.all(productsWithAssets).then((res) => (values.products = res));

  //     const gifts = await Promise.all(giftsWithAssets).then((res) => (values.gifts = res));

  //     const cargoLabel = await cargoLabelWithAsset();

  //     const editedData = {
  //       products,
  //       gifts,
  //       cargoLabel,
  //     };

  //     await updateProductsAndGifts(values._id, editedData)
  //       .then(() => {
  //         toast(<div>Siparis basariyla güncellendi</div>, {
  //           type: 'success',
  //         });
  //       })
  //       .catch((error) => {
  //         toast(`Güncelleme isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
  //           type: 'error',
  //         });
  //       });
  //   };

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
          key={rowData?._id}
          sx={{ '& .MuiDrawer-paper': { width: '475px', justifyContent: 'space-between' } }}
          anchor={'right'}
          open={openSupportDrawer}
          onClose={() => setOpenSupportDrawer(false)}
        >
          <Box sx={{ padding: 2, overflow: 'scroll' }}>
            {initialValues?.map((x, i) => (
              <Box
                key={i}
                sx={{
                  marginBottom: 2,
                  // backgroundColor: 'InactiveCaptionText',
                  backgroundColor: '#dddd',
                  // color: 'white',
                  borderRadius: 4,
                  padding: 2,
                  flex: 'column',
                  //justifyContent: 'space-between',
                }}
              >
                <Chip label={x.context} color={'info'} /> {x.note}
                {/* {x.flag.title} */} ( {format(new Date(x._createdAt), 'dd-MM-yyyy, HH:mm')} )
              </Box>
            ))}
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            sx={{ position: 'sticky', borderTop: '1px solid #dddd', margin: 2 }}
          >
            <Formik
              innerRef={formRef}
              onSubmit={(values, actions) => {
                setSupportMessage([...supportMesage, { ...values, createdAt: new Date() }]);
                actions.resetForm();
                //await new Promise((resolve) => setSupportMessage([...supportMesage, resolve]));
              }}
              initialValues={initialValues}
              // validationSchema={validationSchema}
              //validateOnChange={false}
            >
              {({
                values,
                errors,
                touched,
                setValues,
                setFieldValue,
                handleSubmit /* handleChange */,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Box sx={{ marginTop: 6, padding: 2 }} display={'block'}>
                    <Stack direction={'row'}>
                      <Field
                        name={`flag`}
                        component={FormikAutocomplete}
                        options={[
                          { value: 'important', title: '🟥' },
                          { value: 'warning', title: '🟨' },
                          { value: 'info', title: '🟦' },
                          { value: 'success', title: '🟩' },
                        ]}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`flag`}
                            //   error={Boolean(
                            //     values.products?.[i]?.productMainType?.value === undefined ||
                            //       values.products?.[i]?.productMainType?.value === '',
                            //   )}
                            label="Destek kriteri"
                            variant="outlined"
                            //   size="small"
                          />
                        )}
                      />
                      <Field
                        name={`noteToAdmin`}
                        component={FormikAutocomplete}
                        options={[
                          { value: 'admin1', title: 'admin1' },
                          { value: 'admin2', title: 'admin2' },
                          { value: 'admin3', title: 'admin3' },
                          { value: 'admin4', title: 'admin4' },
                        ]}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        multiple
                        onChange={(e, v) =>
                          setFieldValue('noteToAdmin', v ? [...rest, v] : { value: '', title: '' })
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
                            name={`noteToAdmin`}
                            //   error={Boolean(
                            //     values.products?.[i]?.productMainType?.value === undefined ||
                            //       values.products?.[i]?.productMainType?.value === '',
                            //   )}
                            onChange={({ target }) => setFieldValue('noteToAdmin', target.value)}
                            label="Admin Destek"
                            variant="outlined"
                            //   size="small"
                          />
                        )}
                      />
                    </Stack>
                    <Stack direction={'column'}>
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="text"
                        id={`context`}
                        name={`context`}
                        label="Konu"
                        // error={Boolean(errors.products?.[i]?.productWidth)}
                        // helperText={errors.products?.[i]?.productWidth}
                        //   size="small"
                      />
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="text"
                        id={`note`}
                        name={`note`}
                        label="Not"
                        multiline
                        rows={4}
                        // error={Boolean(errors.products?.[i]?.productWidth)}
                        // helperText={errors.products?.[i]?.productWidth}
                        //   size="small"
                      />
                    </Stack>
                  </Box>
                </Form>
              )}
            </Formik>
            <Box display={'flex'} justifyContent={'center'}>
              {' '}
              <Button
                variant="contained"
                //disabled={Object.keys(errors)?.length > 0}
                sx={classes.updateButtonSX}
                type="submit"
                onClick={handleSubmit}
              >
                <Send fontSize="small" />
                Gönder
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

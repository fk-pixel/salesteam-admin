import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Avatar,
  Drawer,
  TextField,
  CssBaseline,
  Divider,
  useMediaQuery,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  Button,
  Tooltip,
  Typography,
} from '@mui/material';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Save from '@mui/icons-material/Save';
import Delete from '@mui/icons-material/Delete';
import Image from 'next/image';
import { ArrowBack, Print, QrCode, Info } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import { faFileEdit, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';

import AutocompleteEditCell from '../Autocomplete/AutocompleteEditCell.js';
import { sendContactForm } from '../../../controller/api.js';
import {
  deleteOrder,
  updateOrder,
  updateProductsAndGifts,
} from '../../../sanity/utils/order-utils.js';
import {
  PANELTYPE_OPTIONS,
  MAINTYPE_OPTIONS,
  ROLLTYPE_OPTIONS,
  SHIPPING_OPTIONS,
  STATUS_OPTIONS,
  getDataWithAvatar,
  giftRegisterToAssets,
  productRegisterToAssets,
  imageRegisterToAssets,
} from '../../common/Utils/FormsUtil.js';
import { ProductComponent } from '../Forms/ProductComponent.js';
import { GiftComponent } from '../Forms/GiftComponent.js';
import XLSXDialog from '../Dialogs/XLSXDialog.js';
import { urlFor } from '../../../sanity/utils/client';
import noImage from '../../assets/images/users/noimage.png';
import ImageDialog from '../Dialogs/ImageDialog.js';
import SupportDrawer from '../Drawers/SupportDrawer.js';

const tableButtonSX = {
  '&:hover': {
    color: '#1769aa',
  },
};
const updateButtonSX = {
  width: 222,
  backgroundColor: '#1d1c1a',
  '&:hover': {
    backgroundColor: '#1d1c1a',
  },
};
const closeButtonSX = {
  backgroundColor: '#f50057',
  '&:hover': {
    backgroundColor: '#f50057',
  },
};
const cellImageSX = {
  position: 'relative',
  width: '2.25rem',
  height: '2.25rem',
  minWidth: '2.255rem',
  borderRadius: '0.0625rem',
  display: '-webkit-box',
  display: '-webkit-flex',
  display: '-ms-flexbox',
  display: 'flex',
  overflow: 'hidden',
  overflow: 'clip',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function DataTable(props) {
  const { data, userData } = props;

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const newData = getDataWithAvatar(data);

  const isAdmin = userData?.role === 'admin' || userData?.role === 'superAdmin';

  const convertedData = newData?.flatMap((x) => ({
    ...x,
    products: x.products?.map((y) => ({
      ...y,
      productSize: y.productWidth + '*' + y.productHeight,
      productMainType: MAINTYPE_OPTIONS.find((o) => o.value === y.productMainType),
      productSubType: PANELTYPE_OPTIONS.concat(ROLLTYPE_OPTIONS).find(
        (o) => o.value === y.productSubType,
      ),
      productCargoType: SHIPPING_OPTIONS.find((o) => o.value === y.productCargoType),
    })),
    gifts: x.gifts?.map((y) => ({
      ...y,
      giftSize: y.giftWidth + '*' + y.giftHeight,
      giftMainType: MAINTYPE_OPTIONS.find((o) => o.value === y.giftMainType),
      giftSubType: PANELTYPE_OPTIONS.concat(ROLLTYPE_OPTIONS).find(
        (o) => o.value === y.giftSubType,
      ),
      giftCargoType: SHIPPING_OPTIONS.find((o) => o.value === y.giftCargoType),
    })),
    status: STATUS_OPTIONS.find((o) => o.value === x.status)?.title,
  }));

  let componentRef = React.useRef();

  const [selectedRowID, setSelectedRowID] = React.useState();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openSupportDrawer, setOpenSupportDrawer] = React.useState(false);
  const [openMail, setOpenMail] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [openXLSX, setOpenXLSX] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const handleOpenMailDialog = (rowID) => {
    setOpenMail(true);
    setSelectedRowID(rowID);
  };

  const handleOpenXLSXDialog = () => {
    setOpenXLSX(true);
  };

  const handleOpenImageDialog = (rowID) => {
    setOpenImage(true);
    setSelectedRowID(rowID);
  };

  const handleClose = () => {
    setOpenMail(false);
    setOpenXLSX(false);
    setOpenDelete(false);
    setOpenImage(false);
    setSelectedRowID(() => undefined);
  };

  const handleOpenDeleteDialog = (rowID) => {
    setOpenDelete(true);
    setSelectedRowID(rowID);
  };

  const onChangeSupport = () => {
    setOpenSupportDrawer(!openSupportDrawer);
  };

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

  function MailDialog() {
    // const fileInputMail = React.useRef(null);

    const [mailState, setMailState] = React.useState({
      id: uuidv4(),
      sender: 'salesteam.ilk@gmail.com',
      recipient: '',
      context: '',
      message: '',
      //showAutoContext: false,
      //autoContext: '',
      //mailFile: null,
      //defineNumberOfSales: false,
      //pieceOfProduct: 0,
      //pieceOfGift: 0,
    });

    // const handleChangeMailFile = (event) => {
    //   setMailState({
    //     ...mailState,
    //     mailFile: URL.createObjectURL(event.target.files[0]),
    //   });
    // };

    // function onUploadMail(e) {
    //   e.preventDefault();
    //   fileInputMail.current.click();
    // }

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
            {/* <Autocomplete
              id="sender"
              name="sender"
              options={[
                { value: userData.email, title: userData.email },
                { value: defaultSender, title: defaultSender },
              ]}
              getOptionLabel={(o) => o.title || ''}
              fullWidth
              freeSolo={false}
              disableClearable={true}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  style={{ width: 300 }}
                  {...params}
                  // onChange={handleChange}
                  label="Email Gönderen"
                  placeholder=""
                />
              )}
            /> */}
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
            {/* <Box style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Checkbox id={'showAutoContext'} />}
                label={`Otomoatik icerik iste`}
                onChange={(e) =>
                  setMailState({
                    ...mailState,
                    showAutoContext: e.target.checked,
                  })
                }
              />
              <Autocomplete
                id="autoContext"
                name="autoContext"
                options={AUTOCONTEXT_OPTIONS}
                disabled={mailState.showAutoContext === false}
                getOptionLabel={(o) => o.title || ''}
                freeSolo={false}
                disableClearable={true}
                onChange={handleChange}
                // onChange={(e) =>
                //   setMailState({
                //     ...mailState,
                //     autoContext: e.target.value.label,
                //   })
                // }
                renderInput={(params) => (
                  <TextField
                    style={{ width: 300 }}
                    {...params}
                    // onChange={handleChange}
                    label="Otomatik Icerik"
                    placeholder=""
                  />
                )}
              />
            </Box>
            <Box style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Checkbox id={'defineNumberOfSales'} />}
                label={`Ürün ve Hediye sayilarini girin`}
                onChange={(e) =>
                  setMailState({
                    ...mailState,
                    defineNumberOfSales: e.target.checked,
                  })
                }
              />
              {mailState.defineNumberOfSales &&
                rowData?.products.map((x) => (
                  <ul>
                    <li>{x.productName}</li>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="piece"
                      name="piece"
                      label="Adet"
                      type="number"
                      fullWidth
                      onChange={handleChange}
                    />
                  </ul>
                ))}
            </Box> */}
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
            sx={closeButtonSX}
            variant="contained"
            // color="error"
            onClick={handleClose}
          >
            Kapat
          </Button>
          {/* <>
            <input
              id={`mailFile`}
              ref={fileInputMail}
              type="file"
              accept="image/*"
              onChange={(e) => handleChangeMailFile(e)}
              style={{ display: 'none' }}
            />
            <Button startIcon={<UploadFile />} onClick={(e) => onUploadMail(e)} type="file">
              Ekle
            </Button>
          </> */}
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

  function DeleteDialog() {
    const rowData = convertedData.find((x) => x._id === selectedRowID);

    return (
      <>
        <CssBaseline />
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
              <strong style={{ color: 'red' }}>{rowData?._id}</strong> siparisi silmek
              istediginizden emin misiniz?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button sx={closeButtonSX} onClick={handleClose} variant="contained">
              Kapat
            </Button>
            <Button color="primary" onClick={() => onRemove(rowData._id)} variant="contained">
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function EditItemsDrawer() {
    const rowData = convertedData.find((x) => x._id === rowSelectionModel[0]);

    const initialValues = rowData;

    const validationSchema = yup.object().shape({
      // productNumber: yup.string().required('Lütfen ürün sayisini girin'),
      products: yup.array().of(
        yup.object().shape({
          productName: yup.string().required('Lütfen ürün adini girin'),
          productFile: yup
            .mixed()
            .required('Lütfen ürün resmini yükleyin')
            .test('fileFormat', 'image sadece', (value) => {
              // console.log(value);
              return value && ['image'].includes(value._type);
            }),
          // productFile: yup.string().required('Lütfen ürün resmini yükleyin'),
          productWidth: yup
            .string()
            .required('Lütfen ürün en ölcüsünü girin')
            .matches(/^[0-9]+$/, 'Sadece numara girin')
            .min(2, 'En az 2 haneli olmalidir')
            .max(3, 'En fazla 3 haneli olmalidir'),
          productHeight: yup
            .string()
            .required('Lütfen ürün boy ölcüsünü girin')
            .matches(/^[0-9]+$/, 'Sadece numara girin')
            .min(2, 'En az 2 haneli olmalidir')
            .max(3, 'En fazla 3 haneli olmalidir'),
          productPiece: yup
            .string()
            .required('Lütfen ürün adedini girin')
            .matches(/^[0-9]+$/, 'Sadece numara girin')
            .min(1, 'En az 1 haneli olmalidir')
            .max(3, 'En fazla 3 haneli olmalidir'),
        }),
      ),
      gifts: yup.array().of(
        yup.object().shape({
          giftName: yup.string().required('Lütfen hediye adini girin'),
          giftFile: yup.string().required('Lütfen hediye resmini yükleyin'),
          giftWidth: yup
            .string()
            .required('Lütfen hediye en ölcüsünü girin')
            .matches(/^[0-9]+$/, 'Sadece numara girin')
            .min(2, 'En az 2 haneli olmalidir')
            .max(4, 'En fazla 4 haneli olmalidir'),
          giftHeight: yup
            .string()
            .required('Lütfen hediye boy ölcüsünü girin')
            .matches(/^[0-9]+$/, 'Sadece numara girin')
            .min(2, 'En az 2 haneli olmalidir')
            .max(4, 'En fazla 4 haneli olmalidir'),
          giftPiece: yup
            .string()
            .required('Lütfen hediye adedini girin')
            .matches(/^[0-9]+$/, 'Sadece numara girin')
            .min(1, 'En az 1 haneli olmalidir')
            .max(3, 'En fazla 3 haneli olmalidir'),
        }),
      ),
    });

    function onChangeProducts(e, field, values, setValues) {
      const products = [...values.products];

      // const Values = values.map((x) => Object.keys(x).filter((y) => y !== 'cargoLabel'));
      const {
        _id,
        _createdAt,
        avatar,
        cost,
        createdBy,
        description,
        gifts,
        isEdiMode,
        packagingCost,
        price,
        shippingCost,
        status,
        store,
      } = values;

      setValues({
        _id,
        _createdAt,
        avatar,
        cost,
        createdBy,
        description,
        gifts,
        isEdiMode,
        packagingCost,
        price,
        shippingCost,
        status,
        store,
        products,
      });

      // field.onChange(e);
    }

    function onChangeGifts(e, field, values, setValues) {
      const gifts = [...values.gifts];

      const {
        _id,
        _createdAt,
        avatar,
        cost,
        createdBy,
        description,
        products,
        isEdiMode,
        packagingCost,
        price,
        shippingCost,
        status,
        store,
      } = values;

      setValues({
        _id,
        _createdAt,
        avatar,
        cost,
        createdBy,
        description,
        products,
        isEdiMode,
        packagingCost,
        price,
        shippingCost,
        status,
        store,
        products,
      });

      field.onChange(e);
    }

    function onChangeCargoLabel(e, field, values, setValues) {
      const cargoLabel = e.currentTarget.files[0];
      // console.log('cargoLabel', cargoLabel);

      setValues({ ...values, cargoLabel });

      field.onChange(e);

      // console.log('valuesDATA', values);
    }

    const onChangeOpenDrawer = () => {
      setOpenDrawer(!openDrawer);
    };

    const onSubmit = async (values) => {
      const productsWithAssets = values.products?.map(async (product) => {
        if (product.productFile?.asset._ref === undefined) {
          const asset = await productRegisterToAssets(product);
          const file = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          };

          return {
            ...product,
            productFile: await Promise.resolve(file).then(
              (result) => (product.productFile = result),
            ),
          };
        } else {
          return {
            ...product,
          };
        }
      });

      const giftsWithAssets = values.gifts?.map(async (gift) => {
        if (gift.giftFile?.asset._ref === undefined) {
          const asset = await giftRegisterToAssets(gift);
          const file = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          };

          return {
            ...gift,
            giftFile: await Promise.resolve(file).then((result) => (gift.giftFile = result)),
          };
        } else {
          return {
            ...gift,
          };
        }
      });

      const cargoLabelWithAsset = async () => {
        if (values.cargoLabel?.asset._ref === undefined) {
          const asset = await imageRegisterToAssets(values.cargoLabel);

          const file = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          };

          return {
            cargoLabel: await Promise.resolve(file).then((result) => (cargoLabel = result)),
          };
        } else {
          return cargoLabel;
        }
      };

      const products = await Promise.all(productsWithAssets).then((res) => (values.products = res));

      const gifts = await Promise.all(giftsWithAssets).then((res) => (values.gifts = res));

      const cargoLabel = await cargoLabelWithAsset();

      const editedData = {
        products,
        gifts,
        cargoLabel,
      };

      await updateProductsAndGifts(values._id, editedData)
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
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
        <Drawer
          key={rowData?._id}
          sx={{ '& .MuiDrawer-paper': { width: '475px', justifyContent: 'space-between' } }}
          anchor={'right'}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnChange={false}
            >
              {({
                values,
                errors,
                touched,
                setValues,
                setFieldValue /* handleChange, handleSubmit */,
              }) => (
                <Form>
                  <Box display={'block'}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: 475,
                        zIndex: 1,
                        overflow: 'auto',
                      }}
                    >
                      <Button
                        sx={{
                          marginLeft: isNonMobile ? '' : 13,
                          paddingLeft: isNonMobile ? 1 : 0,
                          position: 'fixed',
                        }}
                      >
                        <ArrowBack onClick={onChangeOpenDrawer} />
                      </Button>
                      <Tooltip
                        title={
                          values.cargoLabel === null
                            ? 'Kargo etiketi ekleyin'
                            : 'Kargo etkieti degistirin'
                        }
                      >
                        <Button
                          sx={{
                            position: 'fixed',
                            marginLeft: 46,
                            color: values.cargoLabel?.asset === undefined ? '#d32f2f' : '#1976d2',
                          }}
                          // disabled={values.cargoLabel?.asset === undefined}
                        >
                          <QrCode onClick={() => setOpenImage(true)} />
                        </Button>
                      </Tooltip>
                    </Box>
                    <ProductComponent
                      key={'products'}
                      errors={errors}
                      onChangeProducts={onChangeProducts}
                      setValues={setValues}
                      touched={touched}
                      values={values}
                      setFieldValue={setFieldValue}
                      isNonMobile={isNonMobile}
                      isDrawer={true}
                      // onChangeOpenDrawer={onChangeOpenDrawer}
                    />
                    <GiftComponent
                      key={'gifts'}
                      errors={errors}
                      onChangeGifts={onChangeGifts}
                      setValues={setValues}
                      touched={touched}
                      values={values}
                      setFieldValue={setFieldValue}
                      isNonMobile={isNonMobile}
                      isDrawer={true}
                      // onChangeOpenDrawer={onChangeOpenDrawer}
                    />
                    <ImageDialog
                      values={values}
                      setValues={setValues}
                      openImage={openImage}
                      handleClose={handleClose}
                      setFieldValue={setFieldValue}
                      onChangeCargoLabel={onChangeCargoLabel}
                    />
                  </Box>
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1,
                      backgroundColor: '#ffff', //'rgba(220, 220, 220, 0.9)',
                      height: 60,
                      position: 'sticky',
                      bottom: 0,
                      top: 0,
                      alignSelf: 'flex-end',
                      marginLeft: isNonMobile ? '' : 78,
                    }}
                  >
                    <Button
                      variant="contained"
                      disabled={Object.keys(errors)?.length > 0}
                      sx={updateButtonSX}
                      type="submit"
                      onClick={() => onSubmit(values)}
                    >
                      Güncelle
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          {/* <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              backgroundColor: '#ffff', //'rgba(220, 220, 220, 0.9)',
              height: 60,
              position: 'sticky',
              bottom: 3,
              top: 0,
            }}
          >
            <Button
              variant="contained"
              // disabled={!values?.productName || !values?.price}
              //color="#1d1c1a"
              sx={updateButtonSX}
              type="submit"
              style={{ position: 'absolute', zIndex: 10 }}
            >
              Güncelle
            </Button>
          </Box> */}
        </Drawer>
      </Box>
    );
  }

  const columns = React.useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Sira',
        width: 40,
        editable: false,
        renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row._id) + 1,
      },
      {
        field: 'avatar',
        headerName: 'Kullanici',
        width: 60,
        renderCell: (params) => {
          return (
            <Tooltip title={`Kaydi Olusturan: ${params.row.createdBy?.username}`}>
              <Avatar key={'avatar'} sx={{ bgcolor: 'warning.main' }} alt="">
                {params.value}
              </Avatar>
            </Tooltip>
          );
        },
      },
      {
        field: 'store',
        headerName: 'Magaza',
        width: 70,
        editable: false,
      },
      {
        field: 'products',
        headerName: 'Ürünler',
        width: 330,
        editable: false,
        renderCell: (params) => (
          <Tooltip
            title={` Toplam(${params.row.products?.length}):  ${params.row.products?.map((x, i) => {
              return ` Ürün${i + 1}(${x.productName}-${x.productSize}(${
                x.productPiece ?? 0
              } adet)-${x.productMainType?.title}) ${
                i !== params.row.products.length - 1 ? '  ' : ''
              }`;
            })} `}
            componentsProps={{
              tooltip: {
                sx: {
                  color: 'Highlight',
                  backgroundColor: 'lightgoldenrodyellow',
                  fontSize: '1em',
                },
              },
            }}
          >
            <ul className="flex">
              {params.row.products?.map((x, index) => (
                <li key={index}>
                  Ü{index + 1}: {x.productName} / {x.productSize}({x.productPiece ?? 0} adet) /{' '}
                  {x.productMainType?.title}
                </li>
              ))}
            </ul>
          </Tooltip>
        ),
      },
      {
        field: 'gifts',
        headerName: 'Hediyeler',
        width: 330,
        editable: false,
        renderCell: (params) => (
          <Tooltip
            title={` Toplam(${params.row.gifts?.length}):  ${params.row.gifts?.map((x, i) => {
              return ` Hediye${i + 1}(${x.giftName}-${x.giftSize}(${x.giftPiece ?? 0} adet)-${
                x.giftMainType?.title
              }) ${i !== params.row.gifts.length - 1 ? '  ' : ''}`;
            })} `}
            componentsProps={{
              tooltip: {
                sx: {
                  color: 'Highlight',
                  backgroundColor: 'lightgoldenrodyellow',
                  fontSize: '1em',
                },
              },
            }}
          >
            <ul className="flex">
              {params.row.gifts?.map((x, index) => (
                <li key={index}>
                  H{index + 1}: {x.giftName} / {x.giftSize}({x.giftPiece ?? 0} adet) /{' '}
                  {x.giftMainType?.title}
                </li>
              ))}
            </ul>
          </Tooltip>
        ),
      },
      {
        field: 'cargoLabel',
        headerName: 'Kargo Etiketi',
        type: 'actions',
        width: 90,
        editable: false,
        align: 'center',
        renderCell: (params) => {
          return (
            <>
              {params.row.cargoLabel !== null || params.row.cargoLabel?.asset._ref !== undefined ? (
                <Box sx={cellImageSX}>
                  <Image src={urlFor(params.row.cargoLabel)?.url()} layout="fill" />
                </Box>
              ) : (
                <Box sx={cellImageSX}>
                  <Image src={noImage} layout="fill" />
                </Box>
              )}
            </>
          );
        },
      },
      { field: 'cost', headerName: 'Maliyet', width: 100, type: 'number', editable: isAdmin },
      {
        field: 'packagingCost',
        headerName: 'Paket Maliyeti',
        width: 100,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'shippingCost',
        headerName: 'Kargo Maliyeti',
        width: 100,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'price',
        headerName: 'Satis Tutari',
        type: 'number',
        width: 100,
        editable: isAdmin,
      },
      {
        field: 'description',
        headerName: 'Aciklama',
        width: 200,
        editable: isAdmin,
      },
      {
        field: 'status',
        headerName: 'Statü',
        width: 150,
        editable: isAdmin,
        renderEditCell: (params) => {
          return (
            <AutocompleteEditCell
              {...params}
              key={'status'}
              value={params.row.status}
              options={STATUS_OPTIONS}
              getOptionLabel={(o) => o.title || ''}
              freeSolo={true}
              autoHighlight={false}
              multiple={false}
              disableClearable={true}
            />
          );
        },
      },
      {
        field: '_createdAt',
        headerName: 'Kayit Tarihi',
        type: 'dateTime',
        valueGetter: ({ value }) => new Date(value),
        editable: false,
      },
      // {isAdmin && (
      //   <>
      //     <Tooltip title={'Mail gönder'}>
      //       <GridActionsCellItem
      //         icon={
      //           <ForwardToInboxIcon
      //             sx={tableButtonSX}
      //             onClick={() => {
      //               handleOpenMailDialog(params.row._id);
      //             }}
      //           />
      //         }
      //         label="Send"
      //       />
      //     </Tooltip>
      //     <MailDialog /* key={params.row._id} */ />
      //   </>
      // )}
      {
        field: 'actions',
        type: 'actions',
        width: 100,
        getActions: (params) => [
          <>
            {isAdmin && (
              <>
                <Tooltip title={'Mail gönder'}>
                  <span>
                    <GridActionsCellItem
                      key={'mail'}
                      icon={
                        <ForwardToInboxIcon
                          sx={tableButtonSX}
                          onClick={() => {
                            handleOpenMailDialog(params.row._id);
                          }}
                        />
                      }
                      label="Send"
                    />
                  </span>
                </Tooltip>
                <MailDialog key={params.row._id} />
              </>
            )}
          </>,
          <>
            {!isAdmin && (
              <>
                <Tooltip title={'Admin destek hatti'}>
                  <span>
                    <GridActionsCellItem
                      key={'support'}
                      icon={<Info sx={tableButtonSX} onClick={() => setOpenSupportDrawer(true)} />}
                      label="Support"
                    />
                  </span>
                </Tooltip>
                <SupportDrawer
                  key={params.row._id}
                  rowID={params.row._id}
                  data={convertedData}
                  openSupportDrawer={openSupportDrawer}
                  onChangeSupport={onChangeSupport}
                />
              </>
            )}
          </>,
          <>
            <Tooltip title={'Siparisi güncelle'}>
              <span>
                <GridActionsCellItem
                  key={'update'}
                  icon={<Save sx={tableButtonSX} onClick={() => onSave(params.row)} />}
                  label="Save"
                />
              </span>
            </Tooltip>
          </>,
          <>
            <Tooltip title={'Siparisi sil'}>
              <span>
                <GridActionsCellItem
                  key={'delete'}
                  icon={
                    <Delete
                      sx={tableButtonSX}
                      onClick={() => {
                        handleOpenDeleteDialog(params.row._id);
                      }}
                    />
                  }
                  label="Delete"
                />
              </span>
            </Tooltip>
            <DeleteDialog />
          </>,
        ],
      },
    ],
    [handleOpenMailDialog, handleOpenDeleteDialog, handleClose],
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, //.current,
    documentTitle: 'new document',
    // pageStyle: 'print',
  });

  const printableOrder = convertedData?.filter((x) => rowSelectionModel?.includes(x._id));

  return (
    <div style={{ height: 850, width: '100%' }}>
      <Box height={820}>
        {isAdmin ? (
          <Stack sx={{ marginBottom: 1 }} direction={'row'} spacing={1}>
            <Tooltip title={'Tablodan Excel olustur'}>
              <span>
                <Button
                  key={'mainActions[0]'}
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => handleOpenXLSXDialog()}
                >
                  <FontAwesomeIcon icon={faFileExcel} />
                </Button>
              </span>
            </Tooltip>
            <XLSXDialog data={convertedData} openXLSX={openXLSX} handleClose={handleClose} />

            <Box>
              <Box
                display={'flex'}
                sx={{
                  display: 'none',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  '@media print': {
                    display: 'flex',
                  },
                }}
                ref={componentRef}
              >
                {printableOrder.map((x) => (
                  <div style={{ margin: '12px 60px 12px 60px' }}>
                    <Box display={'block'} /* style={{ margin: 'auto' }} */>
                      <Image
                        src={x.cargoLabel?.asset._ref ? urlFor(x.cargoLabel)?.url() : noImage}
                        width="225"
                        height="250"
                      />
                      <div style={{ width: 225, backgroundColor: 'InactiveCaption' }}>
                        <Divider sx={{ marginBottom: 1, maxHeight: 6 }} />
                        <Typography sx={{ fontSize: 6 }}>
                          <strong>Siparis İçeriği: </strong>
                          {x.products.map(
                            (y, i) => {
                              if (i < 3) {
                                return (
                                  y.productName +
                                  ' ' +
                                  y.productSize +
                                  ' ' +
                                  y.productMainType?.title +
                                  ' | '
                                );

                                //getSeperator(i, x.products.length)
                              }
                            },
                            //   ||
                            // ((i !== x.products.length - 1) !== 1 ? ' & ' : ''),
                          )}
                        </Typography>
                        <Divider style={{ marginBottom: 6 }} />
                      </div>
                    </Box>
                  </div>
                ))}
              </Box>
              <Tooltip title={'Kargo etiketlerini yazdir'}>
                <span>
                  <Button
                    key={'mainActions[1]'}
                    variant="outlined"
                    color="primary"
                    disabled={rowSelectionModel.length < 1}
                  >
                    <Print onClick={handlePrint} fontSize="small" />
                  </Button>
                </span>
              </Tooltip>
            </Box>

            <Tooltip title={'Satilan ürünleri düzenle'}>
              <span>
                <Button
                  key={'mainActions[2]'}
                  variant="outlined"
                  color="primary"
                  size="large"
                  disabled={rowSelectionModel.length !== 1}
                  onClick={() => setOpenDrawer(true)}
                >
                  <FontAwesomeIcon icon={faFileEdit} />
                </Button>
              </span>
            </Tooltip>

            <EditItemsDrawer />
          </Stack>
        ) : (
          <></>
        )}
        <DataGrid
          key={'dataGrid'}
          showCellVerticalBorder
          getRowId={(row) => row._id}
          rows={convertedData ?? []}
          columns={columns}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          rowsPerPageOptions={[25]}
          checkboxSelection={isAdmin}
          rowHeight={75}
          // isRowSelectable={(params) => params.row.cargoLabel !== null}
        />
      </Box>
    </div>
  );
}

export function getSeperator(i, length) {
  const lastItem = length - 1;
  return i !== lastItem ? ' | ' : unefined;
}

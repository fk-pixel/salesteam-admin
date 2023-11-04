import React from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Delete from '@mui/icons-material/Delete';
import { Button, Box, ThemeProvider, CssBaseline, Stack, Divider } from '@mui/material';
import {
  FormControl,
  Grid,
  Input,
  MenuItem,
  Select,
  Typography,
  createTheme,
  useMediaQuery,
} from '@material-ui/core';
import { Upload } from '@mui/icons-material';
import QrCodeIcon from '@mui/icons-material/QrCode';

import Card from '../src/components/Card/Card.js';
import CardHeader from '../src/components/Card/CardHeader.js';
import CardBody from '../src/components/Card/CardBody.js';
import CardFooter from '../src/components/Card/CardFooter.js';
import { FileUpload } from '../src/components/FileUpload/FileUpload.js';
import {
  Autocomplete,
  TextField as MuiTextField,
  Tooltip,
  Collapse,
  IconButton,
} from '@mui/material';
import { TextField as FormikTextField, Autocomplete as FormikAutocomplete } from 'formik-mui';
// import TextForm from '/src/components/TextForm/TextForm';

import FullLayout from '../src/layouts/FullLayout';
import { whiteColor, grayColor, hexToRgb } from '../src/assets/jss/nextjs-material-dashboard.js';
import { Field, FieldArray, Form, Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router.js';
import { updateOrder, uploadImage } from '../sanity/utils/order-utils.js';
import { client } from '../sanity/utils/config.js';
import AutocompleteEditInputCell from '../src/components/Autocomplete/AutocompleteEditCell.js';
import { indexOf } from 'lodash';
import UploadField from '../src/components/Formik/UploadField.js';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(' + hexToRgb(whiteColor) + ',.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

const fileUploadProp = {
  accept: 'image/*',
  onChange: (event) => {
    if (event.target.files !== null && event.target?.files?.length > 0) {
      console.log(`Saving ${event.target.value}`);
    }
  },
  onDrop: (event) => {
    console.log(`Drop ${event.dataTransfer.files[0].name}`);
  },
};

const theme = createTheme();

export default function OrderForm() {
  const router = useRouter();

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const useStyles = makeStyles(() => styles);
  const classes = useStyles();

  const fileInputProduct = React.useRef(null);
  const fileInputGift1 = React.useRef(null);
  const fileInputGift2 = React.useRef(null);
  const fileInputCargoLabel = React.useRef(null);

  const [user, setUser] = React.useState({});
  const [orderState, setOrderState] = React.useState({
    productNumber: null,
    giftNumber: null,
    products: [],
    gifts: [],
    cost: null,
    packagingCost: null,
    shippingCost: null,
    description: '',
    cargoLabel: undefined,
    status: null,
    price: null,
    createdBy: undefined,
    // productFile: undefined,
    // productSize: '',
    // productMainType: '',
    // productSubType: '',
    // productCargoType: '',
    // gift1: '',
    // gift1File: undefined,
    // gift2: '',
    // gift2File: undefined,
  });
  const [openProductFile, setOpenProductFile] = React.useState(false);
  const [openGift1File, setOpenGift1File] = React.useState(false);
  const [openGift2File, setOpenGift2File] = React.useState(false);
  const [isHoverProduct, setIsHoverProduct] = React.useState(false);
  const [isHoverGift1, setIsHoverGift1] = React.useState(false);
  const [isHoverGift2, setIsHoverGift2] = React.useState(false);
  const [imagesAssetsProductFile, setImagesAssetsProductFile] = React.useState(null);
  const [imagesAssetsGift1File, setImagesAssetsGift1File] = React.useState(null);
  const [imagesAssetsGift2File, setImagesAssetsGift2File] = React.useState(null);
  const [imagesAssetsCargoLabel, setImagesAssetsCargoLabel] = React.useState(null);
  const [wrongTypeofImage, setWrongTypeofImage] = React.useState(false);
  const [setField] = React.useState();

  const initialValues = {
    productNumber: null,
    giftNumber: null,
    products: [],
    gifts: [],
    cost: null,
    packagingCost: null,
    shippingCost: null,
    description: '',
    cargoLabel: undefined,
    status: null,
    price: null,
    createdBy: undefined,
  };

  const validationSchema = yup.object().shape({
    productNumber: yup.string().required('Formu kaydetmek icin ürün sayisini giriniz'),
    //productName: yup.string().required('Formu kaydetmek icin bir ürün giriniz'),
    // price: yup
    //   .number()
    //   .positive()
    //   .required('Ürün fiyati ekleyin')
    //   .when(['cost'], {
    //     is: () => cost > price,
    //     then: yup.string().required('hey olmaz'),
    //   }),
  });

  React.useEffect(() => {
    const ISSERVER = typeof window === 'undefined';

    if (!ISSERVER) {
      const userData = JSON.parse(localStorage.getItem('userData'));

      if (userData) {
        setUser(userData);
      }
    }
  }, []);

  // client.fetch('*[ _type == "user"]{id: }');

  const onSubmit = (values /* resetForm */) => {
    // const userData = await JSON.parse(localStorage.getItem('userData'));

    const newOrderState = {
      ...values,
      productFile: imagesAssetsProductFile
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsProductFile?._id,
            },
          }
        : undefined,
      gift1File: imagesAssetsGift1File
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsGift1File?._id,
            },
          }
        : undefined,
      gift2File: imagesAssetsGift2File
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsGift2File?._id,
            },
          }
        : undefined,
      cargoLabel: imagesAssetsCargoLabel
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsCargoLabel?._id,
            },
          }
        : undefined,
      createdBy: {
        _type: 'reference',
        user: {
          _type: 'reference',
          _ref: user.id,
        },
        // to: [{ _type: 'user', _ref: userData.id }],
      },
      //{ _ref: user.id, _type: 'reference' },
      //cargoLabel: orderState.cargoLabel ?? undefined,
      // productSize:
      //   values.productSizeWidth !== null || values.productSizeHeight !== null
      //     ? values.productSizeWidth + '*' + values.productSizeHeight
      //     : null,
      // gift1Size:
      //   values.gift1SizeWidth !== null || values.gift1SizeHeight !== null
      //     ? values.gift1SizeWidth + '*' + values.gift1SizeHeight
      //     : null,
      // gift2Size:
      //   values.gift2SizeWidth !== null || values.gift2SizeHeight !== null
      //     ? values.gift2SizeWidth + '*' + values.gift2SizeHeight
      //     : null,
    };

    // await fetch('/api/createOrder', {
    //   method: 'POST',
    //   body: JSON.stringify(newOrderState),
    // })
    //   .then(() => {
    //     resetForm();
    //     toast('Siparis basariyla kaydedildi', {
    //       type: 'success',
    //     });
    //     router.push('/dashboard');
    //   })
    //   .catch(() => {
    //     toast(`Kayit isleminiz eksik veya gecersizdir. Lütfen tekrar deneyin`, {
    //       type: 'error',
    //     });
    //   });
  };

  const uploadImageProductFile = (e) => {
    const selectedImage = e.target.files[0];

    if (
      selectedImage.type === 'image/png' ||
      selectedImage.type === 'image/svg' ||
      selectedImage.type === 'image/jpeg' ||
      selectedImage.type === 'image/gif' ||
      selectedImage.type === 'image/tiff'
    ) {
      setWrongTypeofImage(false);

      client.assets
        .upload('image', selectedImage, {
          contentType: selectedImage.type,
          filename: selectedImage.name,
        })
        .then((document) => {
          setImagesAssetsProductFile(document);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setWrongTypeofImage(true);
    }
  };
  const uploadImageGift1File = (e) => {
    const selectedImage = e.target.files[0];

    if (
      selectedImage.type === 'image/png' ||
      selectedImage.type === 'image/svg' ||
      selectedImage.type === 'image/jpeg' ||
      selectedImage.type === 'image/gif' ||
      selectedImage.type === 'image/tiff'
    ) {
      setWrongTypeofImage(false);

      client.assets
        .upload('image', selectedImage, {
          contentType: selectedImage.type,
          filename: selectedImage.name,
        })
        .then((document) => {
          setImagesAssetsGift1File(document);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setWrongTypeofImage(true);
    }
  };

  const uploadImageGift2File = (e) => {
    const selectedImage = e.target.files[0];

    if (
      selectedImage.type === 'image/png' ||
      selectedImage.type === 'image/svg' ||
      selectedImage.type === 'image/jpeg' ||
      selectedImage.type === 'image/gif' ||
      selectedImage.type === 'image/tiff'
    ) {
      setWrongTypeofImage(false);

      client.assets
        .upload('image', selectedImage, {
          contentType: selectedImage.type,
          filename: selectedImage.name,
        })
        .then((document) => {
          setImagesAssetsGift2File(document);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setWrongTypeofImage(true);
    }
  };

  const uploadImageCargoLabel = (e) => {
    const selectedImage = e.target.files[0];

    if (
      selectedImage.type === 'image/png' ||
      selectedImage.type === 'image/svg' ||
      selectedImage.type === 'image/jpeg' ||
      selectedImage.type === 'image/gif' ||
      selectedImage.type === 'image/tiff'
    ) {
      setWrongTypeofImage(false);

      client.assets
        .upload('image', selectedImage, {
          contentType: selectedImage.type,
          filename: selectedImage.name,
        })
        .then((document) => {
          setImagesAssetsCargoLabel(document);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setWrongTypeofImage(true);
    }
  };

  const saveImage = async (val1, val2, val3) => {
    if (imagesAssetsProductFile?._id) {
      if (val1) {
        const doc1 = {
          _type: 'order',
          productFile: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsProductFile?._id,
            },
          },
        };

        client.create(doc1).then(() => {
          // navigate('/');
        });
      }
      if (val2) {
        const doc2 = {
          _type: 'order',
          gift1File: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsProductFile?._id,
            },
          },
        };

        client.order.create(doc2).then(() => {
          // navigate('/');
        });
      }
      if (val3) {
        const doc3 = {
          _type: 'order',
          gift2File: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imagesAssetsProductFile?._id,
            },
          },
        };

        client.order.create(doc3).then(() => {
          // navigate('/');
        });
      }
    } else {
      setField(true);

      setTimeout(() => {
        setField(false);
      }, 2000);
    }
  };

  function onUploadProduct(e) {
    e.preventDefault();
    fileInputProduct.current.click();
  }

  function onUploadGift1(e) {
    e.preventDefault();
    fileInputGift1.current.click();
  }

  function onUploadGift2(e) {
    e.preventDefault();
    fileInputGift2.current.click();
  }

  function onUploadCargoLabel(e) {
    e.preventDefault();
    fileInputCargoLabel.current.click();
  }

  // const handleChangeProduct = async (event) => {
  //   // const fileReader = new FileReader();
  //   // fileReader.readAsText(event.target.files[0]);
  //   // fileReader.onload = (e) => {
  //   //   const result = e.target.result;
  //   //   const typeResult = typeof result;
  //   //   const content = JSON.parse(result);
  //   //   setOrderState({ productFile: content, ...orderState });
  //   // };
  //   setOrderState({
  //     ...orderState,
  //     productFile: URL.createObjectURL(event.target.files[0]),
  //   });
  // };

  // const handleChangeGift1 = (event) => {
  //   setOrderState({
  //     ...orderState,
  //     gift1File: URL.createObjectURL(event.target.files[0]),
  //   });
  // };

  // const handleChangeGift2 = (event) => {
  //   setOrderState({
  //     ...orderState,
  //     gift2File: URL.createObjectURL(event.target.files[0]),
  //   });
  // };

  // const handleChangeCargoLabel = (event) => {
  //   setOrderState({
  //     ...orderState,
  //     cargoLabel: URL.createObjectURL(event.target.files[0]),
  //   });
  // };

  const handleMouseEnter = (image) => {
    if (image === 'product') {
      setIsHoverProduct(true);
    }

    if (image === 'gift1') {
      setIsHoverGift1(true);
    }

    if (image === 'gift2') {
      setIsHoverGift2(true);
    }
  };

  const handleMouseLeave = (image) => {
    if (image === 'product') {
      setIsHoverProduct(false);
    }

    if (image === 'gift1') {
      setIsHoverGift1(false);
    }

    if (image === 'gift2') {
      setIsHoverGift2(false);
    }
  };

  const removeImage = (image) => {
    if (image === 'product') {
      setOrderState({ ...orderState, productFile: null });
    }

    if (image === 'gift1') {
      setOrderState({ ...orderState, gift1File: null });
    }

    if (image === 'gift2') {
      setOrderState({ ...orderState, gift2File: null });
    }
  };

  function onChangeProducts(e, field, values, setValues) {
    const products = [...values?.products];

    const productNumber = e.target.value || 0;
    const previousNumber = parseInt(field.value || '0');
    if (previousNumber < productNumber) {
      for (let i = previousNumber; i < productNumber; i++) {
        products.push({
          id: uuidv4(),
          productName: '',
          productFile: undefined,
          productWidth: null,
          productHeight: null,
          productMainType: { id: '', label: '' },
          productSubType: { id: '', label: '' },
          productCargoType: { id: '', label: '' },
        });
      }
    } else {
      for (let i = previousNumber; i >= productNumber; i--) {
        products.splice(i, 1);
      }
    }

    setValues({ ...values, products });

    field.onChange(e);
  }

  function onChangeGifts(e, field, values, setValues) {
    const gifts = [...values.gifts];

    const giftNumber = e.target.value || 0;
    const previousNumber = parseInt(field.value || '0');
    if (previousNumber < giftNumber) {
      for (let i = previousNumber; i < giftNumber; i++) {
        gifts.push({
          id: uuidv4(),
          giftName: '',
          giftFile: undefined,
          giftWidth: null,
          giftHeight: null,
          giftMainType: { id: '', label: '' },
          giftSubType: { id: '', label: '' },
          giftCargoType: { id: '', label: '' },
        });
      }
    } else {
      for (let i = previousNumber; i >= giftNumber; i--) {
        gifts.splice(i, 1);
      }
    }

    setValues({ ...values, gifts });

    field.onChange(e);
  }

  function onSubmit2(values) {
    // console.log('values', values);
  }

  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      {/* <CssBaseline /> */}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Sipariş Formu</h4>
              <p className={classes.cardCategoryWhite}>Yeni bir sipariş girin</p>
            </CardHeader>
            <CardBody>
              <Formik
                // onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                onSubmit={onSubmit2}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  setValues,
                  setFieldValue /* handleChange, handleSubmit */,
                }) => (
                  <Form>
                    <Stack spacing={3} direction={'row'} style={{ marginTop: 12 }}>
                      <Field name="productNumber">
                        {({ field }) => (
                          //label={'Ürün Adedi'}
                          //placeholder="Siparisiniz icin gireceginiz ürün sayisini giriniz"
                          <>
                            <p style={{ marginBottom: 0 }}> Ürün Adedi</p>
                            <select
                              {...field}
                              className={
                                'form-control' +
                                (errors.numberOfTickets && touched.numberOfTickets
                                  ? ' is-invalid'
                                  : '')
                              }
                              onChange={(e) => onChangeProducts(e, field, values, setValues)}
                            >
                              <option value=""></option>
                              {[
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                                20,
                              ].map((i) => (
                                <option key={i} value={i}>
                                  {i}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                      </Field>
                      <ErrorMessage
                        name="productNumber"
                        component="div"
                        className="invalid-feedback"
                      />

                      {/* <Field
                        name={`productNumber`}
                        component={FormikAutocomplete}
                        options={PRODUCTNUMBER_OPTIONS2}
                        getOptionLabel={(option) => option.id}
                        fullWidth
                        onChange={(e, v) => setFieldValue('productNumber', v.id)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`productNumber`}
                            // error={touched['productMainType'] && !!errors['productMainType']}
                            label="Ürün Adedi"
                            placeholder="Siparisiniz icin gireceginiz ürün sayisini giriniz"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      /> */}
                      <Field name="giftNumber">
                        {({ field }) => (
                          <>
                            <p style={{ marginBottom: 0 }}>Hediye Adedi</p>
                            <select
                              {...field}
                              className={
                                'form-control' +
                                (errors.numberOfTickets && touched.numberOfTickets
                                  ? ' is-invalid'
                                  : '')
                              }
                              onChange={(e) => onChangeGifts(e, field, values, setValues)}
                            >
                              <option value=""></option>
                              {[1, 2, 3, 4, 5].map((i) => (
                                <option key={i} value={i}>
                                  {i}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                      </Field>
                      <ErrorMessage
                        name="giftNumber"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Stack>
                    <Stack spacing={3} direction={isNonMobile ? 'row' : 'column'}>
                      <ProductComponent
                        key={'products'}
                        errors={errors}
                        onChangeProducts={onChangeProducts}
                        setValues={setValues}
                        touched={touched}
                        values={values}
                        setFieldValue={setFieldValue}
                        isNonMobile={isNonMobile}
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
                      />
                    </Stack>

                    <Stack sx={{ marginBottom: 3, marginTop: 3 }}>
                      <Field
                        fullwidth
                        component={FormikTextField}
                        type="text"
                        id={`description`}
                        name={`description`}
                        label="Açıklama"
                        multiline
                        rows={4}
                      />
                    </Stack>

                    {/* 1.  + */}
                    {/* <Grid container style={{ justifyContent: 'space-between' }}>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          type="text"
                          label="Ürün Adı"
                          id="product"
                          fullWidth
                          value={values.product}
                          error={!!touched.product && !!errors.product}
                          helperText={touched.product && errors.product}
                          size={'small'}
                          variant={'outlined'}
                          onChange={handleChange}
                        />
                        {values.productFile !== null && (
                          <>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => setOpenProductFile(!openProductFile)}
                            >
                              {openProductFile ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <>
                                  <KeyboardArrowDownIcon />
                                  <Typography style={{ marginLeft: 12, marginTop: 0 }}>
                                    {'Resmi göster'}
                                  </Typography>{' '}
                                </>
                              )}
                            </IconButton>
                            <Collapse in={openProductFile} timeout="auto" unmountOnExit>
                              <Box display={'flex'}>
                                <Image
                                  src={values.productFile}
                                  width={350}
                                  height={300}
                                  // layout="fill"
                                  style={{ width: '100%', maxWidth: 800 }}
                                />
                                <Tooltip title={'Resmi sil'}>
                                  <Button
                                    variant="contained"
                                    color="inherit"
                                    onMouseEnter={() => handleMouseEnter('product')}
                                    onMouseLeave={() => handleMouseLeave('product')}
                                    style={{
                                      marginLeft: 12,
                                      alignSelf: 'end',
                                      color: isHoverProduct ? 'red' : 'black',
                                    }}
                                    onClick={() => removeImage('product')}
                                  >
                                    <Delete />
                                  </Button>
                                </Tooltip>
                              </Box>
                            </Collapse>
                          </>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6} md={2}>
                        <TextField
                          type="number"
                          label="En"
                          id="productSizeWidth"
                          fullWidth
                          value={values.productSizeWidth}
                          size={'small'}
                          variant={'outlined'}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Typography style={{ marginTop: 40 }}>x</Typography>
                      <Grid item xs={12} sm={6} md={2}>
                        <TextField
                          type="number"
                          label="Boy"
                          id="productSizeHeight"
                          fullWidth
                          value={values.productSizeHeight}
                          size={'small'}
                          variant={'outlined'}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item style={{ marginTop: 36 }}>
                        <input
                          id={`productFile`}
                          ref={fileInputProduct}
                          type="file"
                          accept="image/*"
                          onChange={handleChangeProduct}
                          style={{ display: 'none' }}
                        />
                        <Button
                          onClick={(e) => onUploadProduct(e)}
                          variant="contained"
                          color={values.productFile !== null ? 'primary' : 'inherit'}
                          size="small"
                          type="file"
                        >
                          <Upload fontSize="small" />
                        </Button>
                      </Grid>
                    </Grid> */}

                    {/* 2.  + */}
                    {/* <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={4} style={{ marginTop: 36 }}>
                      <Autocomplete
                        id="productMainType"
                        onChange={
                          (e, item) => {
                            setOrderState({
                              ...orderState,
                              productMainType: item.label,
                            });
                          }
                          // handleChange
                        }
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        options={PRODUCTMAINTYPE_OPTIONS}
                        getOptionLabel={(option) => option.label || ''}
                        disableClearable={true}
                        freeSolo={false}
                        renderInput={(params) => (
                          <TextField {...params} label="Ürün Ana Tipi" placeholder="" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} style={{ marginTop: 36 }}>
                      <Autocomplete
                        id="productSubType"
                        onChange={
                          // (e, v) =>
                          // setOrderState({
                          //   ...orderState,
                          //   productSubType: v.label,
                          // })
                          handleChange
                        }
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        disabled={values.productMainType === '' || values.productMainType === 'Cam'}
                        options={selectSubOptions(values.productMainType)}
                        getOptionLabel={(o) => o.label || ''}
                        freeSolo={false}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField {...params} label="Ürün Alt Tipi" placeholder="" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} style={{ marginTop: 36 }}>
                      <Autocomplete
                        id="productCargoType"
                        onChange={
                          // (e, v) =>
                          // setOrderState({
                          //   ...orderState,
                          //   productCargoType: v.label,
                          // })
                          handleChange
                        }
                        disabled={values.productMainType !== 'Panel'}
                        options={selectShippingOptions(values.productMainType)}
                        getOptionLabel={(o) => o.label || ''}
                        freeSolo={false}
                        disableClearable={true}
                        renderInput={(params) => (
                          <TextField {...params} label="Ürün Kargo Tipi" placeholder="" />
                        )}
                      />
                    </Grid>
                  </Grid> */}

                    {/* 3. */}
                    {/* <Grid container style={{ justifyContent: 'space-between' }}>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        type={'text'}
                        label="Hediye1"
                        id="gift1"
                        value={values.gift1}
                        size={'small'}
                        fullWidth
                        variant={'outlined'}
                        onChange={handleChange}
                      />
                      {values.gift1File !== null && (
                        <>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenGift1File(!openGift1File)}
                          >
                            {openGift1File ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <>
                                <KeyboardArrowDownIcon />
                                <Typography style={{ marginLeft: 12, marginTop: 0 }}>
                                  {'Resmi göster'}
                                </Typography>{' '}
                              </>
                            )}
                          </IconButton>
                          <Collapse in={openGift1File} timeout="auto" unmountOnExit>
                            <Box display={'flex'}>
                              <Image
                                src={values.gift1File}
                                width={350}
                                height={300}
                                style={{ width: '100%', maxWidth: 800 }}
                              />
                              <Tooltip title={'Resmi sil'}>
                                <Button
                                  variant="contained"
                                  color="inherit"
                                  onMouseEnter={() => handleMouseEnter('gift1')}
                                  onMouseLeave={() => handleMouseLeave('gift1')}
                                  style={{
                                    marginLeft: 12,
                                    alignSelf: 'end',
                                    color: isHoverGift1 ? 'red' : 'black',
                                  }}
                                  onClick={() => removeImage('gift1')}
                                >
                                  <Delete />
                                </Button>
                              </Tooltip>
                            </Box>
                          </Collapse>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        type="number"
                        label="En"
                        id="gift1SizeWidth"
                        fullWidth
                        value={values.gift1SizeWidth}
                        size={'small'}
                        variant={'outlined'}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Typography style={{ marginTop: 40 }}>x</Typography>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        type="number"
                        label="Boy"
                        id="gift1SizeHeight"
                        fullWidth
                        value={values.gift1SizeHeight}
                        size={'small'}
                        variant={'outlined'}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item style={{ marginTop: 36 }}>
                      <input
                        id={`gift1File`}
                        ref={fileInputGift1}
                        type="file"
                        accept="image/*"
                        onChange={handleChangeGift1}
                        style={{ display: 'none' }}
                      />
                      <Button
                        onClick={(e) => onUploadGift1(e)}
                        variant="contained"
                        color={values.gift1File !== null ? 'primary' : 'inherit'}
                        size="small"
                        type="file"
                      >
                        <Upload fontSize="small" />
                      </Button>
                    </Grid>
                  </Grid> */}

                    {/* 4. */}
                    {/* <Grid container style={{ justifyContent: 'space-between' }}>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        type={'text'}
                        label="Hediye2"
                        id="gift2"
                        value={values.gift2}
                        size={'small'}
                        fullWidth
                        onChange={handleChange}
                      />
                      {values.gift2File !== null && (
                        <>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenGift2File(!openGift2File)}
                          >
                            {openGift2File ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <>
                                <KeyboardArrowDownIcon />
                                <Typography style={{ marginLeft: 12, marginTop: 0 }}>
                                  {'Resmi göster'}
                                </Typography>{' '}
                              </>
                            )}
                          </IconButton>
                          <Collapse in={openGift2File} timeout="auto" unmountOnExit>
                            <Box display={'flex'}>
                              <Image
                                src={values.gift2File}
                                width={350}
                                height={300}
                                style={{ width: '100%', maxWidth: 800 }}
                              />
                              <Tooltip title={'Resmi sil'}>
                                <Button
                                  onMouseEnter={() => handleMouseEnter('gift2')}
                                  onMouseLeave={() => handleMouseLeave('gift2')}
                                  style={{
                                    marginLeft: 12,
                                    alignSelf: 'end',
                                    color: isHoverGift2 ? 'red' : 'black',
                                  }}
                                  onClick={() => removeImage('gift2')}
                                >
                                  <Delete />
                                </Button>
                              </Tooltip>
                            </Box>
                          </Collapse>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        type="number"
                        label="En"
                        id="gift2SizeWidth"
                        fullWidth
                        value={values.gift2SizeWidth}
                        size={'small'}
                        variant={'outlined'}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Typography style={{ marginTop: 40 }}>x</Typography>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        type="number"
                        label="Boy"
                        id="gift2SizeHeight"
                        fullWidth
                        value={values.gift2SizeHeight}
                        size={'small'}
                        variant={'outlined'}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item style={{ marginTop: 36 }}>
                      <input
                        id={`gift2File`}
                        ref={fileInputGift2}
                        type="file"
                        accept="image/*"
                        onChange={handleChangeGift2}
                        style={{ display: 'none' }}
                      />
                      <Button
                        onClick={(e) => onUploadGift2(e)}
                        variant="contained"
                        color={values.gift2File !== null ? 'primary' : 'inherit'}
                        size="small"
                        type="file"
                      >
                        <Upload fontSize="small" />
                      </Button>
                    </Grid>
                  </Grid> */}

                    {/* 5. */}
                    {/* <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextField
                        type={'number'}
                        label="Maliyet"
                        id="cost"
                        value={values.cost}
                        disabled
                        size={'small'}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextField
                        type={'number'}
                        label="Paketleme Maliyeti"
                        id="packagingCost"
                        value={values.packagingCost}
                        disabled
                        size={'small'}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextField
                        type={'number'}
                        label="Kargolama Maliyeti"
                        id="shippingCost"
                        value={values.shippingCost}
                        disabled
                        size={'small'}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <TextField
                        type={'number'}
                        label="Satış Tutarı"
                        id="price"
                        value={values.price}
                        error={!!touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                        fullWidth
                        size={'small'}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField
                        type={'text'}
                        label="Açıklama"
                        id="description"
                        value={values.descriptioncost}
                        fullWidth
                        multiline
                        rows={4}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid> */}

                    <CardFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="contained"
                        // disabled={!values?.productName || !values?.price}
                        color="primary"
                        type="submit"
                      >
                        Kaydet
                      </Button>
                      <input
                        id={`cargoLabel`}
                        name={`cargoLabel`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue(`cargoLabel`, e.currentTarget.files[0]);
                        }}
                        style={{ display: 'none' }}
                      />
                      <Tooltip title={'Kargo Etiketi Ekle'}>
                        <label htmlFor={`cargoLabel`}>
                          <Button
                            variant="contained"
                            color={values.cargoLabel !== undefined ? 'primary' : 'inherit'}
                            size="large"
                            type="file"
                            component={'span'}
                            // style={{
                            //   maxWidth: 128,
                            //   maxHeight: 128,
                            // }}
                            style={{ fontSize: isNonMobile ? 96 : 36 }}
                          >
                            <QrCodeIcon />
                          </Button>
                        </label>
                      </Tooltip>
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Grid>
      </Grid>
      {/* </ThemeProvider> */}
    </>
  );
}

function selectSubOptions(mainOption) {
  switch (mainOption) {
    case 'Panel':
      return PANELTYPE_OPTIONS;

    case 'Rulo':
      return ROLLTYPE_OPTIONS;

    default:
      return [{ id: '', label: '' }];
  }
}

function selectShippingOptions(mainOption) {
  switch (mainOption) {
    case 'Panel':
      return SHIPPING_OPTIONS;

    default:
      return [{ id: '', label: '' }];
  }
}

function getCost(size) {
  const splittedData = size.split('x') ?? '';

  const br = 1.87;

  const calculateCost = splittedData[0] * splittedData[1] * br;

  return calculateCost;
}

function ProductComponent({ values, errors, touched, isNonMobile, setFieldValue }) {
  const [openProductFile, setOpenProductFile] = React.useState([]);

  React.useEffect(() => {
    if (values.products.length > 0 && values.products !== undefined) {
      const openProductFilesSituations = Array(values.products.length).fill(false);
      setOpenProductFile(openProductFilesSituations);
    }
  }, [values.products]);
  return (
    <>
      <Stack direction={'column'} style={{ marginTop: 12, width: '100%' }}>
        <FieldArray key={'products'} name="products">
          {() =>
            values.products?.map((product, i) => {
              const productErrors = (errors.products?.length && errors.products[i]) || {};
              const productTouched = (touched.products?.length && touched.products[i]) || {};
              return (
                <>
                  <Box
                    key={i}
                    style={{
                      borderTopRightRadius: 18,
                      borderBottomRightRadius: 18,
                      width: 104,
                      backgroundColor: '#027148',
                      marginBottom: 6,
                      marginTop: i === 0 ? 24 : isNonMobile ? 0 : 12,
                      padding: 3,
                      color: '#fff',
                    }}
                  >
                    <h5 className="card-title">Ürün {i + 1}</h5>
                  </Box>
                  <Box display={'block'}>
                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2, marginTop: 2 }}>
                      <Field
                        fullwidth
                        component={FormikTextField}
                        id={`products.${i}.productName`}
                        name={`products.${i}.productName`}
                        label="Ürün adi"
                        type="text"
                        error={touched.productName && Boolean(errors.productName)}
                        size="small"
                      />
                      <input
                        id={`products.${i}.productFile`}
                        name={`products.${i}.productFile`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue(`products.${i}.productFile`, e.currentTarget.files[0]);
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor={`products.${i}.productFile`}>
                        <Button
                          variant="contained"
                          color={'inherit'}
                          component={'span'}
                          size="medium"
                        >
                          <AddPhotoAlternateIcon />
                        </Button>
                      </label>
                      {product.productFile !== '' && (
                        <>
                          <Button
                            variant="contained"
                            aria-label="expand row"
                            size="medium"
                            onClick={() =>
                              setOpenProductFile(
                                openProductFile.map((x, index) => (index === i ? !x : x)),
                              )
                            }
                          >
                            {openProductFile[i] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <>
                                {/* <Button aria-label="show-image" color="primary"> */}
                                <KeyboardArrowDownIcon color="white" />
                                {/* </Button> */}
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </Stack>
                    {product.productFile !== undefined && openProductFile[i] && (
                      <Collapse in={openProductFile[i]} timeout="auto" unmountOnExit>
                        <Box display={'block'}>
                          <div className="form-group col-12">
                            <Box style={{ display: 'block' }}>
                              <Box
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                <Image
                                  src={URL.createObjectURL(product.productFile)}
                                  width={350}
                                  height={300}
                                  style={{ width: '100%', maxWidth: 800 }}
                                />
                              </Box>
                              <Box display={'flex'} style={{ justifyContent: 'center' }}>
                                <Box
                                  display={'flex'}
                                  style={{
                                    justifyContent: 'space-between',
                                    border: '1px solid',
                                    paddingLeft: 3,
                                    marginTop: 12,
                                    marginBottom: 12,
                                    width: '100%',
                                    maxWidth: 350,
                                  }}
                                >
                                  <p style={{ marginTop: 3 }}>
                                    {product.productFile.name.length > 67
                                      ? product.productFile.name.slice(0, 67) + '...'
                                      : product.productFile.name}
                                  </p>
                                  <Tooltip title={'Resmi sil'}>
                                    <Button
                                      variant="text"
                                      color="inherit"
                                      // onMouseEnter={() => handleMouseEnter('product')}
                                      // onMouseLeave={() => handleMouseLeave('product')}
                                      style={
                                        {
                                          //marginLeft: 12,
                                          //alignSelf: 'end',
                                          // color: isHoverProduct ? 'red' : 'black',
                                        }
                                      }
                                      onClick={() => setFieldValue(`products.${i}.productFile`, '')}
                                    >
                                      <Delete />
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          </div>
                        </Box>
                      </Collapse>
                    )}

                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2 }}>
                      {/* <label>En</label>
                          <Field
                            name={`products.${i}.productWidth`}
                            type="text"
                            className={
                              'form-control' +
                              (productErrors.productWidth && productTouched.productWidth
                                ? ' is-invalid'
                                : '')
                            }
                          />
                          <ErrorMessage
                            name={`products.${i}.productWidth`}
                            component="div"
                            className="invalid-feedback"
                          /> */}
                      <Field
                        fullwidth
                        component={FormikTextField}
                        type="number"
                        id={`products.${i}.productWidth`}
                        name={`products.${i}.productWidth`}
                        label="En"
                        error={touched.productWidth && Boolean(errors.productWidth)}
                        size="small"
                      />
                      {/* <label>Boy</label>
                          <Field
                            name={`products.${i}.productHeight`}
                            type="text"
                            className={
                              'form-control' +
                              (productErrors.productHeight && productTouched.productHeight
                                ? ' is-invalid'
                                : '')
                            }
                          />
                          <ErrorMessage
                            name={`products.${i}.productHeight`}
                            component="div"
                            className="invalid-feedback"
                          /> */}
                      <Field
                        fullwidth
                        component={FormikTextField}
                        type="number"
                        id={`products.${i}.productHeight`}
                        name={`products.${i}.productHeight`}
                        label="Boy"
                        error={touched.productHeight && Boolean(errors.productHeight)}
                        size="small"
                      />
                    </Stack>
                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: isNonMobile ? 4 : 1 }}>
                      {/* <Field name="productMainType">
                            {({ field }) => (
                              <select
                                {...field}
                                className={
                                  'form-control' +
                                  (errors.productNumber && touched.productNumber
                                    ? ' is-invalid'
                                    : '')
                                }
                                onChange={(e) => onChangeProducts(e, field, values, setValues)}
                              >
                                <option value=""></option>
                                {[
                                  { id: 'panel', label: 'Panel' },
                                  { id: 'roll', label: 'Rulo' },
                                  { id: 'glas', label: 'Cam' },
                                ].map((i) => (
                                  <option key={i} value={i.id}>
                                    {i.value}
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="productMainType"
                            component="div"
                            className="invalid-feedback"
                          /> */}
                      <Field
                        name={`products.${i}.productMainType`}
                        component={FormikAutocomplete}
                        options={PRODUCTMAINTYPE_OPTIONS}
                        getOptionLabel={(option) => option.label}
                        fullwidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`products.${i}.productMainType`}
                            // error={touched['productMainType'] && !!errors['productMainType']}
                            label="Ürün Ana Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {/* <Field name="productSubType">
                            {({ field }) => (
                              <select
                                {...field}
                                className={
                                  'form-control' +
                                  (errors.productNumber && touched.productNumber
                                    ? ' is-invalid'
                                    : '')
                                }
                                onChange={(e) => onChangeProducts(e, field, values, setValues)}
                              >
                                <option value=""></option>
                                {[
                                  { id: 'panel', label: 'Panel' },
                                  { id: 'roll', label: 'Rulo' },
                                  { id: 'glas', label: 'Cam' },
                                ].map((i) => (
                                  <option key={i} value={i.id}>
                                    {i.value}
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="productSubType"
                            component="div"
                            className="invalid-feedback"
                          /> */}
                      <Field
                        name={`products.${i}.productSubType`}
                        component={FormikAutocomplete}
                        options={selectSubOptions(product.productMainType.label)}
                        disabled={
                          product.productMainType.label === '' ||
                          product.productMainType.label === 'Cam'
                        }
                        getOptionLabel={(option) => option.label}
                        fullwidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`products.${i}.productSubType`}
                            // error={touched['productSubType'] && !!errors['productSubType']}
                            label="Ürün Alt Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      {/* <Field name="productCargoType">
                            {({ field }) => (
                              <select
                                {...field}
                                className={
                                  'form-control' +
                                  (errors.productNumber && touched.productNumber
                                    ? ' is-invalid'
                                    : '')
                                }
                                onChange={(e) => onChangeProducts(e, field, values, setValues)}
                              >
                                <option value=""></option>
                                {[
                                  { id: 'panel', label: 'Panel' },
                                  { id: 'roll', label: 'Rulo' },
                                  { id: 'glas', label: 'Cam' },
                                ].map((i) => (
                                  <option key={i} value={i.id}>
                                    {i.value}
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="productCargoType"
                            component="div"
                            className="invalid-feedback"
                          /> */}
                      <Field
                        name={`products.${i}.productCargoType`}
                        component={FormikAutocomplete}
                        options={selectShippingOptions(product.productMainType.label)}
                        disabled={product.productMainType.label !== 'Panel'}
                        getOptionLabel={(option) => option.label}
                        fullwidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`products.${i}.productCargoType`}
                            // error={touched['productCargoType'] && !!errors['productCargoType']}
                            label="Ürün Kargo Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Stack>

                    {i === values.productNumber - 1 && (
                      <Box
                        style={{
                          marginBottom: isNonMobile ? 48 : 12,
                          marginTop: 32,
                          height: 1,
                          width: '100%',
                          backgroundColor: 'lightgray',
                        }}
                      />
                    )}
                  </Box>
                </>
                //   </div>
                // </div>
              );
            })
          }
        </FieldArray>
      </Stack>
    </>
  );
}

function GiftComponent({ values, errors, touched, isNonMobile, setFieldValue }) {
  const [openGiftFile, setOpenGiftFile] = React.useState([]);

  React.useEffect(() => {
    if (values.gifts.length > 0 && values.gifts !== undefined) {
      const openGiftFilesSituations = Array(values.gifts.length).fill(false);
      setOpenGiftFile(openGiftFilesSituations);
    }
  }, [values.gifts]);

  return (
    <>
      <Stack direction={'column'} style={{ marginTop: 12, width: '100%' }}>
        <FieldArray key={'gifts'} name="gifts">
          {() =>
            values.gifts?.map((gift, i) => {
              const giftErrors = (errors.gifts?.length && errors.gifts[i]) || {};
              const giftTouched = (touched.gifts?.length && touched.gifts[i]) || {};
              return (
                <>
                  <Box
                    key={i}
                    style={{
                      borderTopRightRadius: 18,
                      borderBottomRightRadius: 18,
                      width: 104,
                      backgroundColor: 'darkgray',
                      marginBottom: 6,
                      marginTop: i === 0 ? 24 : isNonMobile ? 0 : 12,
                      padding: 3,
                      color: '#fff',
                    }}
                  >
                    <h5 className="card-title">Hediye {i + 1}</h5>
                  </Box>
                  <Box display={'block'}>
                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2, marginTop: 2 }}>
                      <Field
                        fullwidth
                        component={FormikTextField}
                        id={`gifts.${i}.giftName`}
                        name={`gifts.${i}.giftName`}
                        label="Hediye adi"
                        type="text"
                        error={touched.giftName && Boolean(errors.giftName)}
                        size="small"
                      />
                      <input
                        id={`gifts.${i}.giftFile`}
                        name={`gifts.${i}.giftFile`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue(`gifts.${i}.giftFile`, e.currentTarget.files[0]);
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor={`gifts.${i}.giftFile`}>
                        <Button
                          variant="contained"
                          color={'inherit'}
                          component={'span'}
                          size="medium"
                          //fontSize="8"
                        >
                          <AddPhotoAlternateIcon />
                        </Button>
                      </label>
                      {gift.giftFile !== '' && (
                        <>
                          <Button
                            variant="contained"
                            aria-label="expand row"
                            size="medium"
                            onClick={() =>
                              setOpenGiftFile(
                                openGiftFile.map((x, index) => (index === i ? !x : x)),
                              )
                            }
                          >
                            {openGiftFile[i] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <>
                                {/* <Typography style={{ marginLeft: 12, marginTop: 0 }}>
                                  {'Resmi göster'}
                                </Typography>{' '} */}

                                <KeyboardArrowDownIcon color={'white'} />
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </Stack>
                    {gift.giftFile !== undefined && openGiftFile[i] && (
                      <Collapse in={openGiftFile[i]} timeout="auto" unmountOnExit>
                        <Box display={'block'}>
                          <div className="form-group col-12">
                            <Box style={{ display: 'block' }}>
                              <Box
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                <Image
                                  src={URL.createObjectURL(gift.giftFile)}
                                  width={350}
                                  height={300}
                                  style={{ width: '100%', maxWidth: 800 }}
                                />
                              </Box>
                              <Box display={'flex'} style={{ justifyContent: 'center' }}>
                                <Box
                                  display={'flex'}
                                  style={{
                                    justifyContent: 'space-between',
                                    border: '1px solid',
                                    paddingLeft: 3,
                                    marginTop: 12,
                                    marginBottom: 12,
                                    width: '100%',
                                    maxWidth: 350,
                                  }}
                                >
                                  <p style={{ marginTop: 3 }}> {gift.giftFile.name}</p>
                                  <Tooltip title={'Resmi sil'}>
                                    <Button
                                      variant="text"
                                      color="inherit"
                                      // onMouseEnter={() => handleMouseEnter('gift')}
                                      // onMouseLeave={() => handleMouseLeave('gift')}
                                      style={
                                        {
                                          //marginLeft: 12,
                                          //alignSelf: 'end',
                                          // color: isHoverProduct ? 'red' : 'black',
                                        }
                                      }
                                      onClick={() => setFieldValue(`gifts.${i}.giftFile`, '')}
                                    >
                                      <Delete />
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          </div>
                        </Box>

                        {/* <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2 }}> */}
                        {/* <Stack sp direction={'row'}> */}

                        {/* </Box> */}
                        {/* </Stack> */}
                      </Collapse>
                    )}

                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2 }}>
                      <Field
                        fullwidth
                        component={FormikTextField}
                        type="number"
                        id={`gifts.${i}.giftWidth`}
                        name={`gifts.${i}.giftWidth`}
                        label="En"
                        error={touched.giftWidth && Boolean(errors.giftWidth)}
                        size="small"
                      />
                      <Field
                        fullwidth
                        component={FormikTextField}
                        type="number"
                        id={`gifts.${i}.giftHeight`}
                        name={`gifts.${i}.giftHeight`}
                        label="Boy"
                        error={touched.giftHeight && Boolean(errors.giftHeight)}
                        size="small"
                      />
                    </Stack>

                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: isNonMobile ? 4 : 1 }}>
                      <Field
                        name={`gifts.${i}.giftMainType`}
                        component={FormikAutocomplete}
                        options={PRODUCTMAINTYPE_OPTIONS}
                        getOptionLabel={(option) => option.label}
                        fullwidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`gifts.${i}.giftMainType`}
                            // error={touched['giftMainType'] && !!errors['giftMainType']}
                            label="Hediye Ana Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <Field
                        name={`gifts.${i}.giftSubType`}
                        component={FormikAutocomplete}
                        options={selectSubOptions(gift.giftMainType.label)}
                        disabled={
                          gift.giftMainType.label === '' || gift.giftMainType.label === 'Cam'
                        }
                        getOptionLabel={(option) => option.label}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`gifts.${i}.giftSubType`}
                            // error={touched['giftSubType'] && !!errors['giftSubType']}
                            label="Hediye Alt Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <Field
                        name={`gifts.${i}.giftCargoType`}
                        component={FormikAutocomplete}
                        options={selectShippingOptions(gift.giftMainType.label)}
                        disabled={gift.giftMainType.label !== 'Panel'}
                        getOptionLabel={(option) => option.label}
                        fullwidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`gifts.${i}.giftCargoType`}
                            // error={touched['giftCargoType'] && !!errors['giftCargoType']}
                            label="Hediye Kargo Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Stack>

                    {i === values.giftNumber - 1 && (
                      <Box
                        style={{
                          marginBottom: 48,
                          marginTop: 32,
                          height: 1,
                          width: '100%',
                          backgroundColor: 'lightgray',
                        }}
                      />
                    )}
                  </Box>
                </>
              );
            })
          }
        </FieldArray>
      </Stack>
    </>
  );
}

export const PRODUCTMAINTYPE_OPTIONS = [
  { id: 'panel', label: 'Panel' },
  { id: 'roll', label: 'Rulo' },
  { id: 'glas', label: 'Cam' },
];

export const PANELTYPE_OPTIONS = [
  { id: 'thinHoop', label: 'Ince Kasnak' },
  { id: 'normalHoop', label: 'Normal Kasnak' },
];

export const ROLLTYPE_OPTIONS = [
  { id: 'normalRoll', label: 'Normal Rulo' },
  { id: 'NonReflectiveRoll', label: 'Yansimasiz Rulo' },
  { id: 'coatedPaper', label: 'Kuse Kagit' },
];

export const SHIPPING_OPTIONS = [
  { id: 'singlePanel', label: 'Single Panel' },
  { id: 'twoPanels', label: 'Two Panels' },
  { id: 'threePanels', label: 'Three Panels' },
  { id: 'threeBalancedPanels', label: 'Three Balanced Panels' },
  { id: 'fourPanels', label: 'Four Panels' },
  { id: 'fivePanels', label: 'Five Panels' },
  { id: 'fiveBalancedPanels', label: 'Five Balanced Panels' },
];

// export const PRODUCTNUMBER_OPTIONS = [
//   { id: 1, label: '1' },
//   { id: 2, label: '2' },
//   { id: 3, label: '3' },
//   { id: 4, label: '4' },
//   { id: 5, label: '5' },
//   { id: 6, label: '6' },
//   { id: 7, label: '7' },
//   { id: 8, label: '8' },
//   { id: 9, label: '9' },
//   { id: 10, label: '10' },
//   { id: 11, label: '11' },
//   { id: 12, label: '12' },
//   { id: 13, label: '13' },
//   { id: 14, label: '14' },
//   { id: 15, label: '15' },
//   { id: 16, label: '16' },
//   { id: 17, label: '17' },
//   { id: 18, label: '18' },
//   { id: 19, label: '19' },
//   { id: 20, label: '20' },
// ];

export const PRODUCTNUMBER_OPTIONS2 = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
];

export const GIFTNUMBER_OPTIONS = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
];

OrderForm.layout = FullLayout;

// eski componenter
function ProductComponent1({ productNumber, values, handleChange }) {
  // const { productNumber, values } = props;
  const bos = [];
  //bos.map((x) =>  )
  const productTemplate = {
    productName: '',
    productWidth: '',
    productHeight: '',
    productMainType: '',
    productSubType: '',
    productCargoType: '',
    productImage: '',
  };

  const deneme = [{ id: uuidv4(), ...productTemplate }];
  const Products = new Map(deneme !== null ? deneme?.map((x) => [x.id, x]) : []);

  const productTemplate2 = [
    'productName',
    'productWidth',
    'productHeight',
    'productMainType',
    'productSubType',
    'productCargoType',
    'productImage',
  ];
  const arrProduct = new Array(productNumber ?? 0).fill(productTemplate2);

  const Products2 = new Map(arrProduct?.map((x) => [x.id, x]));

  const convertArrayToObject = (array, key) =>
    array.reduce(
      (obj, item) => ({
        ...obj,
        [item[key]]: item,
      }),
      {},
    );

  const t = convertArrayToObject(arrProduct);
  const obj = Object.fromEntries(
    productTemplate2.map((year) => [
      {
        id: uuidv4(),
        [year]: '',
      },
    ]),
  );

  // console.log(obj);
  // console.log('qw', Array.from(arrProduct.values()));

  // const [products, setProducts] = React.useState(
  //   arrProduct.map(([key, val], i) => ({ id: uuidv4(), [val]: '' })),
  // );

  const [product1, setProduct1] = React.useState({ products: [], productTemplate });

  // const handleChangeProducts = (name, val) => {
  //   // if (value?.id !== undefined) {
  //   values.set(name, val);

  //   handleChange(Array.from(Products.values()));
  //   // }
  // };

  // const handleChange2 = ({ target }) => {
  //   setProduct1((prev) => ({
  //     ...prev,
  //     productTemplate: {
  //       ...productTemplate,
  //       [target.name]: target.value,
  //     },
  //   }));
  // };

  const handleRemove = (id) => {
    Products.delete(id);

    onChartSettingsChanged(Array.from(Products.values()));
  };

  return (
    <>
      {arrProduct.length > 0 &&
        arrProduct.map((x, i) => (
          <FieldArray name={'products'}>
            <Box
              display={'block'}
              //style={{ flexWrap: 'wrap' }}
              key={`${i}-product`}
              id={`${i}-product`}
            >
              {i === 0 && (
                <Box
                  // key={i}
                  // id={i}
                  style={{
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    marginTop: 60,
                    height: 12,
                    width: 36,
                    backgroundColor: 'orange',
                  }}
                />
              )}
              <Stack
                spacing={3}
                direction={'row'}
                sx={{ marginBottom: 2 /* marginBottom: 3, marginTop: 3 */ }}
              >
                <Field
                  id={`${i}-${x[0]}`}
                  name="productName"
                  //type="text"
                  label="Ürün Adı"
                  fullwidth
                  component={MuiTextField}
                  //value={values?.productName}
                  // error={!!touched?.productName && !!errors?.productName}
                  // helperText={touched?.productName && errors?.productName}
                  //size={'small'}
                  //variant={'outlined'}
                  //onChange={handleChange}
                />
                <input
                  id={`${i}-${x[6]}`}
                  // ref={fileInputProduct}
                  type="file"
                  accept="image/*"
                  // onChange={uploadImageProductFile /* (e) => handleChangeProduct(e) */}
                  style={{ display: 'none' }}
                />
                <Button
                  // onClick={(e) => onUploadProduct(e)}
                  variant="contained"
                  color={'primary'}
                  size="small"
                  type="file"
                >
                  <Upload fontSize="small" />
                </Button>
              </Stack>

              <Stack
                spacing={3}
                direction={'row'}
                sx={{ marginBottom: 2 /* marginBottom: 3, marginTop: 3 */ }}
              >
                <Field
                  id={`${i}-${x[1]}`}
                  name="productWidth"
                  //type="number"
                  label="En"
                  fullwidth
                  //value={values?.productWidth}
                  // error={!!touched?.productName && !!errors?.productName}
                  // helperText={touched?.productName && errors?.productName}
                  component={MuiTextField}
                  //size={'small'}
                  //variant={'outlined'}
                  //onChange={handleChange}
                />
                <Field
                  id={`${i}-${x[2]}`}
                  name="productHeight"
                  //type="number"
                  label="Boy"
                  fullwidth
                  component={MuiTextField}
                  //value={values?.productHeight}
                  // error={!!touched?.productName && !!errors?.productName}
                  // helperText={touched?.productName && errors?.productName}
                  //size={'small'}
                  //variant={'outlined'}
                  //onChange={handleChange}
                />
              </Stack>

              <Stack
                spacing={3}
                direction={'row'}
                sx={{
                  marginBottom: 4,
                  /* marginBottom: 3, marginTop: 3 */
                }}
              >
                <Autocomplete
                  id={`${i}-${x[3]}`}
                  name="productMainType"
                  onChange={
                    handleChange
                    // (e, v) =>
                    //   setOrderState({
                    //     ...orderState,
                    //     productMainType: v.label,
                    //   })
                    // (e, v) => handleChangeProducts('productMainType', v.id)
                  }
                  value={values?.productMainType}
                  // disabled={values?.productMainType !== 'Panel'}
                  options={PRODUCTMAINTYPE_OPTIONS}
                  getOptionLabel={(o) => o.label || ''}
                  freeSolo={false}
                  disableClearable={true}
                  fullwidth
                  renderInput={(params) => (
                    <MuiTextField {...params} label="Ürün Ana Tip" placeholder="" />
                  )}
                />
                <Autocomplete
                  id={`${i}-${x[4]}`}
                  name="productSubType"
                  onChange={
                    (e, v) =>
                      setOrderState({
                        ...orderState,
                        productSubType: v.label,
                      })
                    // handleChange
                  }
                  value={values?.productSubType}
                  // disabled={values?.productMainType !== 'Panel'}
                  options={selectShippingOptions(values?.productMainType)}
                  getOptionLabel={(o) => o.label || ''}
                  freeSolo={false}
                  disableClearable={true}
                  fullWidth
                  renderInput={(params) => (
                    <MuiTextField {...params} label="Ürün Alt Tipi" placeholder="" />
                  )}
                />
                <Autocomplete
                  id={`${i}-${x[5]}`}
                  name="productCargoType"
                  onChange={
                    (e, v) =>
                      setOrderState({
                        ...orderState,
                        productCargoType: v.label,
                      })
                    // handleChange
                  }
                  value={values?.productCargoType}
                  // disabled={values?.productMainType !== 'Panel'}
                  options={selectShippingOptions(values?.productMainType)}
                  getOptionLabel={(o) => o.label || ''}
                  freeSolo={false}
                  disableClearable={true}
                  fullwidth
                  renderInput={(params) => (
                    <MuiTextField {...params} label="Ürün Kargo Tipi" placeholder="" />
                  )}
                />
              </Stack>

              {i !== productNumber - 1 && (
                <Box
                  style={{
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                    marginTop: 12,
                    height: 12,
                    width: 36,
                    backgroundColor: 'orange',
                  }}
                />
              )}

              {i === productNumber - 1 && (
                <Box
                  style={{
                    marginBottom: 60,
                    marginTop: 24,
                    height: 1,
                    width: '100%',
                    backgroundColor: 'lightgray',
                  }}
                />
              )}
            </Box>
          </FieldArray>
        ))}
    </>
  );
}
function GiftComponent1({ giftNumber, values }) {
  // const { productNumber, values } = props;

  const giftTemplate = [
    'giftName',
    'giftWidth',
    'giftHeight',
    'giftMainType',
    'giftSubType',
    'giftCargoType',
    'giftImage',
  ];
  const arrGift = new Array(giftNumber ?? 0).fill(giftTemplate);

  const [gifts, setGifts] = React.useState(arrGift);

  return (
    <>
      {arrGift.length > 0 &&
        arrGift.map((x, i) => (
          <Box
            display={'block'}
            //style={{ flexWrap: 'wrap' }}
            key={`${i}-gift`}
            id={`${i}-gift`}
          >
            {i === 0 && (
              <Box
                // key={i}
                // id={i}
                style={{
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                  marginTop: 18,
                  height: 12,
                  width: 36,
                  backgroundColor: 'darkblue',
                }}
              />
            )}
            <Stack
              spacing={3}
              direction={'row'}
              sx={{ marginBottom: 2 /* marginBottom: 3, marginTop: 3 */ }}
            >
              <MuiTextField
                type="text"
                label="Hediye Adı"
                id={`${i}-${x[0]}`}
                fullwidth
                value={values?.giftName}
                // error={!!touched?.giftName && !!errors?.giftName}
                // helperText={touched?.giftName && errors?.giftName}
                size={'small'}
                variant={'outlined'}
                // onChange={handleChange}
              />
              <input
                id={`${i}-${x[6]}`}
                // ref={fileInputProduct}
                type="file"
                accept="image/*"
                // onChange={uploadImageProductFile /* (e) => handleChangeProduct(e) */}
                style={{ display: 'none' }}
              />
              <Button
                // onClick={(e) => onUploadProduct(e)}
                variant="contained"
                color={'primary'}
                size="small"
                type="file"
              >
                <Upload fontSize="small" />
              </Button>
            </Stack>

            <Stack
              spacing={3}
              direction={'row'}
              sx={{ marginBottom: 2 /* marginBottom: 3, marginTop: 3 */ }}
            >
              <MuiTextField
                type="number"
                label="En"
                id={`${i}-${x[1]}`}
                fullWidth
                value={values?.giftWidth}
                // error={!!touched?.giftName && !!errors?.giftName}
                // helperText={touched?.giftName && errors?.giftName}
                size={'small'}
                variant={'outlined'}
                // onChange={handleChange}
              />
              <MuiTextField
                type="number"
                label="Boy"
                id={`${i}-${x[2]}`}
                fullwidth
                value={values?.giftHeight}
                // error={!!touched?.giftName && !!errors?.giftName}
                // helperText={touched?.giftName && errors?.giftName}
                size={'small'}
                variant={'outlined'}
                // onChange={handleChange}
              />
            </Stack>

            <Stack
              spacing={3}
              direction={'row'}
              sx={{
                marginBottom: 4,
                /* marginBottom: 3, marginTop: 3 */
              }}
            >
              <Autocomplete
                id={`${i}-${x[3]}`}
                onChange={
                  (e, v) =>
                    setOrderState({
                      ...orderState,
                      giftMainType: v.label,
                    })
                  // handleChange
                }
                value={values?.giftMainType}
                // disabled={values?.giftMainType !== 'Panel'}
                options={PRODUCTMAINTYPE_OPTIONS}
                getOptionLabel={(o) => o.label || ''}
                freeSolo={false}
                disableClearable={true}
                fullwidth
                renderInput={(params) => (
                  <MuiTextField {...params} label="Hediye Ana Tip" placeholder="" />
                )}
              />
              <Autocomplete
                id={`${i}-${x[4]}`}
                onChange={
                  (e, v) =>
                    setOrderState({
                      ...orderState,
                      giftSubType: v.label,
                    })
                  // handleChange
                }
                value={values?.giftSubType}
                // disabled={values?.giftMainType !== 'Panel'}
                options={selectShippingOptions(values?.giftMainType)}
                getOptionLabel={(o) => o.label || ''}
                freeSolo={false}
                disableClearable={true}
                fullWidth
                renderInput={(params) => (
                  <MuiTextField {...params} label="Hediye Alt Tipi" placeholder="" />
                )}
              />
              <Autocomplete
                id={`${i}-${x[5]}`}
                onChange={
                  (e, v) =>
                    setOrderState({
                      ...orderState,
                      giftCargoType: v.label,
                    })
                  // handleChange
                }
                value={values?.giftCargoType}
                // disabled={values?.giftMainType !== 'Panel'}
                options={selectShippingOptions(values?.giftMainType)}
                getOptionLabel={(o) => o.label || ''}
                freeSolo={false}
                disableClearable={true}
                fullwidth
                renderInput={(params) => (
                  <MuiTextField {...params} label="Hediye Kargo Tipi" placeholder="" />
                )}
              />
            </Stack>

            {i !== giftNumber - 1 && (
              <Box
                style={{
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                  marginTop: 12,
                  height: 12,
                  width: 36,
                  backgroundColor: 'darkblue',
                }}
              />
            )}

            {i === giftNumber - 1 && (
              <Box
                style={{
                  marginBottom: 60,
                  marginTop: 24,
                  height: 1,
                  width: '100%',
                  backgroundColor: 'lightgray',
                }}
              />
            )}
          </Box>
        ))}
    </>
  );
}

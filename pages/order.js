import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Grid,
  useMediaQuery,
  Button,
  Box,
  Tooltip,
  Stack,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { TextField as FormikTextField } from 'formik-mui';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router.js';

import { GiftComponent } from '../src/components/Forms/GiftForm.js';
import { ProductComponent } from '../src/components/Forms/ProductForm.js';
import { usePortalContext } from '../src/common/Portal/portal.js';
import FullLayout from '../src/layouts/FullLayout';
import {
  giftRegisterToAssets,
  imageRegisterToAssets,
  productRegisterToAssets,
} from '../src/utils/FormsUtil.js';
import _ from 'lodash';

export default function OrderForm() {
  const router = useRouter();

  const { User } = usePortalContext();

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const [productErrors, setProductErrors] = React.useState();
  const [giftErrors, setGiftErrors] = React.useState();

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
  // TODO: solve autocpmlete error problem : https://stackoverflow.com/questions/74757839/formik-material-ui-with-autocomplete-not-works-as-expected
  // const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

  // const registerSchema = yup.object().shape({
  //   uriImage: yup
  //     .mixed()
  //     .nullable()
  //     .required('A file is required')
  //     .test(
  //       'Fichier taille',
  //       'upload file',
  //       (value) => !value || (value && value.size <= 1024 * 1024),
  //     )
  //     .test(
  //       'format',
  //       'upload file',
  //       (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type)),
  //     ),
  // });

  const validationSchema = yup.object().shape({
    productNumber: yup.string().required('Lütfen ürün sayisini girin'),
    products: yup.array().of(
      yup.object().shape({
        productName: yup.string().required('Lütfen ürün adini girin'),
        // productFile: yup.string().required('Lütfen ürün resmini yükleyin'),
        //productFile: yup.mixed().nullable(),
        // .test('fileSize', 'File is too large', (value) => value.size <= FILE_SIZE)
        // .test('fileType', 'Your Error Message', (value) =>
        //   SUPPORTED_FORMATS.includes(value.type),
        // ),
        // productFile: yup
        //   .mixed()
        //   .required('Lütfen ürün resmini yükleyin')
        //   .test('fileFormat', 'image sadece', (value) => {
        //     // @ts-ignore
        //     return value && ['image'].includes(value._type);
        //   }),
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
        productMainType: yup.object().shape({
          value: yup.string().required('Lütfen ürün ana tipini girin'),
          title: yup.string().required('Lütfen ürün ana tipini girin'),
        }),
      }),
    ),
    gifts: yup.array().of(
      yup.object().shape({
        giftName: yup.string().required('Lütfen hediye adini girin'),
        //giftFile: yup.mixed().nullable(),
        // giftFile: yup.string().required('Lütfen hediye resmini yükleyin'),
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
        giftMainType: yup.object().shape({
          value: yup.string().required('Lütfen hediye ana tipini girin'),
          title: yup.string().required('Lütfen hediye ana tipini girin'),
        }),
      }),
    ),
  });

  const onSubmit = async (values, resetForm) => {
    const productsWithAssets = values.products?.map(async (product) => {
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
        productFile: product.productFile !== undefined && asset !== undefined ? file : undefined,
      };
    });

    const products = await Promise.all(productsWithAssets).then(
      (results) => (values.products = results),
    );

    const giftsWithAssets = values.gifts?.map(async (gift) => {
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
        giftFile: gift.giftFile !== undefined && asset !== undefined ? file : undefined,
      };
    });

    const gifts = await Promise.all(giftsWithAssets).then((results) => (values.gifts = results));

    const cargoLabelWithAsset =
      values.cargoLabel !== undefined ? await imageRegisterToAssets(values?.cargoLabel) : undefined;

    const cargoLabel =
      cargoLabelWithAsset !== undefined
        ? await Promise.resolve(cargoLabelWithAsset).then((result) => {
            if (result._id) {
              return {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: result._id,
                },
              };
            }
          })
        : undefined;

    const orderData = {
      ...values,
      products,
      gifts,
      cargoLabel,
      createdBy: {
        _type: 'reference',
        _ref: User._id,
      },
    };

    await fetch('/api/createOrder', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
      .then(() => {
        resetForm();
        toast('Siparis basariyla kaydedildi', {
          type: 'success',
        });
        router.push('/dashboard');
      })
      .catch(() => {
        toast(`Kayit isleminiz eksik veya gecersizdir. Lütfen tekrar deneyin`, {
          type: 'error',
        });
      });
  };

  // const onchangeX = React.useCallback((e, field, values, setValues, errors) => {
  //   const products = [...values?.products];

  //   const productNumber = e.target.value || 0;
  //   const previousNumber = parseInt(field.value || '0');
  //   if (previousNumber < productNumber) {
  //     for (let i = previousNumber; i < productNumber; i++) {
  //       products.push({
  //         id: uuidv4(),
  //         productName: '',
  //         productFile: undefined,
  //         productWidth: null,
  //         productHeight: null,
  //         productPiece: null,
  //         productMainType: { value: '', title: '' },
  //         productSubType: { value: '', title: '' },
  //         productCargoType: { value: '', title: '' },
  //       });
  //     }
  //   } else {
  //     for (let i = previousNumber; i >= productNumber; i--) {
  //       products.splice(i, 1);
  //     }
  //   }

  //   setValues({ ...values, products });
  //   setProductErrors({ ...errors });

  //   field.onChange(e);
  // }, []);
  // const onchangeY = React.useCallback((e, field, values, setValues, errors) => {
  //   const gifts = [...values.gifts];

  //   const giftNumber = e.target.value || 0;
  //   const previousNumber = parseInt(field.value || '0');
  //   if (previousNumber < giftNumber) {
  //     for (let i = previousNumber; i < giftNumber; i++) {
  //       gifts.push({
  //         id: uuidv4(),
  //         giftName: '',
  //         giftFile: undefined,
  //         giftWidth: null,
  //         giftHeight: null,
  //         giftPiece: null,
  //         giftMainType: { value: '', title: '' },
  //         giftSubType: { value: '', title: '' },
  //         giftCargoType: { value: '', title: '' },
  //       });
  //     }
  //   } else {
  //     for (let i = previousNumber; i >= giftNumber; i--) {
  //       gifts.splice(i, 1);
  //     }
  //   }

  //   setValues({ ...values, gifts });
  //   setGiftErrors({ ...errors });

  //   field.onChange(e);
  // }, []);

  function onChangeProducts(e, field, values, setValues, errors) {
    const products = [...values.products];

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
          productPiece: null,
          productMainType: { value: '', title: '' },
          productSubType: { value: '', title: '' },
          productCargoType: { value: '', title: '' },
        });
      }
    } else {
      for (let i = previousNumber; i >= productNumber; i--) {
        products.splice(i, 1);
      }
    }

    setValues({ ...values, products });

    setProductErrors({ ...errors });

    field.onChange(e);
  }

  function onChangeGifts(e, field, values, setValues, errors) {
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
          giftPiece: null,
          giftMainType: { value: '', title: '' },
          giftSubType: { value: '', title: '' },
          giftCargoType: { value: '', title: '' },
        });
      }
    } else {
      for (let i = previousNumber; i >= giftNumber; i--) {
        gifts.splice(i, 1);
      }
    }

    setValues({ ...values, gifts });

    setGiftErrors({ ...errors });

    field.onChange(e);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  marginTop: '-15px',
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14)',
                  borderRadius: 1,
                  height: 60,
                  width: '100%',
                  backgroundColor: 'orange',
                  alignSelf: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                    fontSize: 21,
                    fontWeight: 500,
                    color: 'white',
                    marginLeft: 1,
                  }}
                  color="text.secondary"
                  gutterBottom
                >
                  Sipariş Formu
                </Typography>
              </Box>
              <Formik
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnChange={false}
              >
                {({ values, errors, touched, setValues, setFieldValue, isSubmitting }) => (
                  <Form>
                    <Stack spacing={3} direction={'row'} style={{ marginTop: 12 }}>
                      <Field name="productNumber" id={'productNumber'}>
                        {({ field }) => (
                          <>
                            <p style={{ marginBottom: 0, color: 'GrayText' }}> Ürün Adedi</p>
                            <select
                              {...field}
                              className={
                                'form-control' +
                                (errors.productNumber && touched.productNumber ? ' is-invalid' : '')
                              }
                              onChange={(e) =>
                                onChangeProducts(e, field, values, setValues, errors)
                              }
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

                      <Field name="giftNumber">
                        {({ field }) => (
                          <>
                            <p style={{ marginBottom: 0, color: 'GrayText' }}>Hediye Adedi</p>
                            <select
                              {...field}
                              className={
                                'form-control' +
                                (errors.giftNumber && touched.giftNumber ? ' is-invalid' : '')
                              }
                              onChange={(e) => onChangeGifts(e, field, values, setValues, errors)}
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

                    <Stack
                      sx={{ justifyContent: 'space-between' }}
                      spacing={2}
                      direction={isNonMobile ? 'row' : 'column'}
                    >
                      <Box width={'100%'}>
                        <ProductComponent
                          key={'products'}
                          errors={errors}
                          onChangeProducts={onChangeProducts}
                          setValues={setValues}
                          touched={touched}
                          values={values}
                          setFieldValue={setFieldValue}
                          isNonMobile={isNonMobile}
                          isDrawer={false}
                          productErrors={productErrors}
                        />
                      </Box>
                      <Box width={'100%'}>
                        <GiftComponent
                          key={'gifts'}
                          errors={errors}
                          onChangeGifts={onChangeGifts}
                          setValues={setValues}
                          touched={touched}
                          values={values}
                          setFieldValue={setFieldValue}
                          isNonMobile={isNonMobile}
                          isDrawer={false}
                          giftErrors={giftErrors}
                        />
                      </Box>
                    </Stack>

                    <Stack sx={{ marginBottom: 3, marginTop: 3 }}>
                      {(values.productNumber !== null || values.giftNumber !== null) && (
                        <Box
                          style={{
                            marginBottom: 24,
                            marginTop: 0,
                            height: 1,
                            width: '100%',
                            backgroundColor: 'lightgray',
                          }}
                        />
                      )}
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
                    <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {/* <Badge fullwidth color="secondary" badgeContent={Object.keys(errors)?.length}> */}
                      <Button
                        variant="contained"
                        disabled={
                          Object.keys(errors)?.length > 0 ||
                          _.isEqual(initialValues, values) ||
                          isSubmitting
                        }
                        color="primary"
                        type="submit"
                        // sx={{
                        //   backgroundColor: '#1d1c1a',
                        //   '&:hover': {
                        //     color: '#1d1c1a',
                        //     backgroundColor: '#ffff',
                        //   },
                        // }}
                        // className={classes.submitButton}
                      >
                        Kaydet
                      </Button>
                      {/* </Badge> */}
                      {/* <pre>{Object.keys(errors)?.length === 0}</pre> */}
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
                      {/* <ErrorMessage
                        name="cargoLabel"
                        component="div"
                        className="invalid-feedback"
                      /> */}
                      <Tooltip
                        title={
                          values.cargoLabel !== undefined
                            ? 'Kargo Etiketi Degistir'
                            : 'Kargo Etiketi Ekle'
                        }
                      >
                        <label htmlFor={`cargoLabel`}>
                          <Button
                            variant={values.cargoLabel !== undefined ? 'contained' : 'outlined'}
                            // color={values.cargoLabel !== undefined ? 'primary' : 'secondary'}
                            color={'primary'}
                            size="large"
                            type="file"
                            component={'span'}
                            //onError={}
                          >
                            <QrCodeIcon fontSize={isNonMobile ? 'large' : 'medium'} />
                          </Button>
                        </label>
                      </Tooltip>
                    </CardActions>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

OrderForm.layout = FullLayout;

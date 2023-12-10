import React from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import {
  giftRegisterToAssets,
  imageRegisterToAssets,
  productRegisterToAssets,
} from '../../utils/FormsUtil';
import { updateProductsAndGifts } from '../../../sanity/utils/order-utils';
import {
  Box,
  Button,
  Drawer,
  Container,
  Tooltip,
  useMediaQuery,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowBack, QrCode } from '@mui/icons-material';
import ImageDialog from '../Dialogs/ImageDialog';
import { GiftComponent } from '../Forms/GiftForm';
import { ProductComponent } from '../Forms/ProductForm';
import _ from 'lodash';

const classes = {
  updateButtonSX: {
    width: 222,
    backgroundColor: '#1d1c1a',
    '&:hover': {
      backgroundColor: '#1d1c1a',
    },
  },
};

export function EditItemsDrawer({ convertedData, rowSelectionModel, openDrawer, handleClose }) {
  const [openImage, setOpenImage] = React.useState(false);

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const rowData = convertedData.find((x) => x._id === rowSelectionModel[0]);

  const initialValues = rowData;

  const validationSchema = yup.object().shape({
    products: yup.array().of(
      yup.object().shape({
        productName: yup.string().required('Lütfen ürün adini girin'),
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
        //giftFile: yup.string().required('Lütfen hediye resmini yükleyin'),
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
    //const gifts = [...values.gifts];

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

  const onSubmit = async (values) => {
    const productsWithAssets = values.products?.map(async (product) => {
      if (product.productFile?.asset?._ref === undefined) {
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
          productFile: await Promise.resolve(file).then((result) => (product.productFile = result)),
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
            _ref: asset?._id,
          },
        };

        return {
          cargoLabel: await Promise.resolve(file).then((result) => result),
        };
      }
      return;
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
        handleClose();
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
        onClose={handleClose}
      >
        <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
          >
            {({ values, errors, touched, setValues, setFieldValue }) => (
              <Form>
                {/* <pre>{JSON.stringify(errors)}</pre> */}
                <AppBar
                  position="sticky"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    //width: 475,
                    zIndex: 100,
                    height: 60,
                    boxShadow: '1px 1px grey',
                    backgroundColor: 'black', //'#383c44',
                    //overflow: 'auto',
                  }}
                >
                  <Toolbar>
                    <Button
                      sx={{
                        marginLeft: isNonMobile ? '' : 13,
                        paddingLeft: isNonMobile ? 1 : 0,
                        position: 'fixed',
                        zIndex: 101,
                        color: 'white',
                      }}
                    >
                      <ArrowBack onClick={handleClose} />
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
                          zIndex: 101,
                          marginLeft: 46,
                          color: values.cargoLabel?.asset === undefined ? '#d32f2f' : '#1976d2',
                        }}
                        // disabled={values.cargoLabel?.asset === undefined}
                      >
                        <QrCode onClick={() => setOpenImage(true)} />
                      </Button>
                    </Tooltip>
                  </Toolbar>
                </AppBar>

                <Container sx={{ height: '100%', minHeight: '1144px', marginTop: 0 }}>
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
                    key={'cargoLabelImage'}
                    values={values}
                    setValues={setValues}
                    openImage={openImage}
                    handleClose={() => setOpenImage(false)}
                    setFieldValue={setFieldValue}
                    onChangeCargoLabel={onChangeCargoLabel}
                  />
                </Container>

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
                    disabled={Object.keys(errors)?.length > 0 || _.isEqual(values, initialValues)}
                    sx={classes.updateButtonSX}
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
      </Drawer>
    </Box>
  );
}

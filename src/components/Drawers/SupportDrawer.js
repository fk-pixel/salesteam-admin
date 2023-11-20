import { Send } from '@mui/icons-material';
import {
  //   Autocomplete,
  Box,
  Button,
  Chip,
  Drawer,
  TextField as MuiTextField,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { format } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import { Autocomplete as FormikAutocomplete, TextField as FormikTextField } from 'formik-mui';
import React from 'react';
import { fetchAdmins } from '../../../sanity/utils/notification-utils';

const updateButtonSX = {
  width: 122,
  borderRadius: 2,
  backgroundColor: '#1d1c1a',
  '&:hover': {
    backgroundColor: '#1d1c1a',
  },
  //marginRight: 2,
  //width: '100%',
};

export default function SupportDrawer({ rowID, data, openSupportDrawer, onChangeSupport }) {
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const [selectedPets, setSelectedPets] = React.useState([]);
  const [petInputValue, setPetInputValue] = React.useState('');

  const rowData = data.find((x) => x._id === rowID);

  const adminUsers = async () => {
    await fetchAdmins();
  };
  console.log('admins', adminUsers());

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
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
      <Drawer
        key={rowData?._id}
        sx={{ '& .MuiDrawer-paper': { width: '475px', justifyContent: 'space-between' } }}
        anchor={'right'}
        open={openSupportDrawer}
        onClose={() => onChangeSupport()}
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
              sx={updateButtonSX}
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
  );
}

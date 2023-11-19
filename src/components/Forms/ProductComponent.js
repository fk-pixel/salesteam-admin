import React from 'react';
import Image from 'next/image';
import {
  Stack,
  TextField as MuiTextField,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Collapse,
  Tooltip,
  Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Delete } from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { FastField, Field, FieldArray } from 'formik';
import { TextField as FormikTextField, Autocomplete as FormikAutocomplete } from 'formik-mui';

import noImage from '../../assets/images/users/noimage.png';
import { MAINTYPE_OPTIONS, SHIPPING_OPTIONS, selectSubOptions } from '../../utils/FormsUtil';
import _ from 'lodash';
import { urlFor } from '../../../sanity/utils/client';
import { buildURL } from '../../../sanity/lib/image';
import DrivePicker from '../DrivePicker/DrivePicker';
import createImageURLFromDrive from '../../utils/ImageUtil';

// const FastTextField = ({ name, handleChange, value }) => {
//   const [localValue, setLocalValue] = useState('');

//   React.useEffect(() => {
//     value && setLocalValue(value);
//   }, [value]);

//   const debouncedValue = useDebounce(localValue, 200);

//   React.useEffect(() => {
//     handleChange(localValue);
//   }, [debouncedValue]);

//   return (
//     <TextField
//       name={name}
//       value={localValue}
//       onChange={(e) => setLocalValue(e.target.value)}
//       type="text"
//     />
//   );
// };

export function ProductComponent({
  values,
  errors,
  //touched,
  isNonMobile,
  setFieldValue,
  //productErrors,
  isDrawer,
  //onChangeOpenDrawer,
}) {
  const [openProductFile, setOpenProductFile] = React.useState([]);

  React.useEffect(() => {
    if (values.products.length > 0 && values.products !== undefined) {
      const openProductFilesSituations = Array(values.products.length).fill(false);
      setOpenProductFile(openProductFilesSituations);
    }
  }, [values.products]);

  //console.log('values', values);
  //console.log('errors', errors);

  return (
    <>
      <Stack
        direction={'column'}
        sx={{
          marginTop: isDrawer ? 1 : 3,
          marginLeft: isDrawer ? (isNonMobile ? 3 : 14) : 0,
          width: isDrawer ? (isNonMobile ? '85%' : '70%') : '100%',
        }}
      >
        <FieldArray key={'products'} name="products">
          {() =>
            values.products?.map((product, i) => {
              //const productErrors = (errors.products?.length && errors.products[i]) || {};
              //const productTouched = (touched.products?.length && touched.products[i]) || {};
              // console.log('productTouched', productTouched);
              //_.set(productErrors, errors.products?.length && errors.products[i]);
              return (
                <>
                  {/* {isDrawer && !isNonMobile && (
                      <Button sx={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 0 }}>
                        <ArrowBack onClick={onChangeOpenDrawer} />
                      </Button>
                    )} */}
                  <Box
                    key={i}
                    sx={{
                      borderTopRightRadius: 18,
                      borderBottomRightRadius: 18,
                      width: isDrawer ? 78 : 104,
                      // backgroundColor: '#027148',
                      // color: '#fff',
                      backgroundColor: '#1d1c1a',
                      color: '#fff',
                      marginBottom: 2,
                      marginTop: i === 0 ? 6 : isNonMobile ? 0 : 3,
                    }}
                  >
                    <h5
                      className="card-title"
                      style={{ marginLeft: 3, marginTop: 5, fontSize: isDrawer ? 'small' : '' }}
                    >
                      Ürün {i + 1}
                    </h5>
                  </Box>
                  <Box display={'block'}>
                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2, marginTop: 2 }}>
                      <Field
                        fullWidth
                        component={FormikTextField}
                        id={`products.${i}.productName`}
                        name={`products.${i}.productName`}
                        label="Ürün adi"
                        type="text"
                        error={
                          // touched.products?.[i]?.productName &&
                          Boolean(errors.products?.[i]?.productName)
                        }
                        size="small"
                      />
                      {/* <FastField name={'last'}>
                        {({ field, form, meta }) => {
                          return (
                            <Input
                              field={field}
                              form={form}
                              meta={meta}
                              //placeholder="last"
                              fullWidth
                              component={FormikTextField}
                              id={`products.${i}.productName`}
                              name={`products.${i}.productName`}
                              label="Ürün adi"
                              type="text"
                              error={Boolean(errors.products?.[i]?.productName)}
                              size="small"
                            />
                          );
                        }}
                      </FastField> */}
                      {product?.productFile === undefined && !isDrawer && (
                        <>
                          <input
                            id={`products.${i}.productFile`}
                            name={`products.${i}.productFile`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              console.log(e);
                              setFieldValue(`products.${i}.productFile`, e.currentTarget.files[0]);
                            }}
                            style={{ display: 'none' }}
                          />
                          <Stack spacing={0} direction={'row'}>
                            <label htmlFor={`products.${i}.productFile`}>
                              <Button
                                variant="contained"
                                color={'error'}
                                component={'span'}
                                size="medium"
                                sx={{
                                  height: 40,
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                }}
                              >
                                <AddPhotoAlternateIcon />
                              </Button>
                            </label>
                            <label htmlFor={`products.${i}.productFile`}>
                              <DrivePicker
                                productFile={`products.${i}.productFile`}
                                setFieldValue={setFieldValue}
                              />
                            </label>
                          </Stack>
                        </>
                      )}
                      {product?.productFile !== undefined && !isDrawer && (
                        <>
                          <Button
                            variant="contained"
                            color={'primary'}
                            aria-label="expand row"
                            size="small"
                            sx={{ height: 40 }}
                            onClick={() =>
                              setOpenProductFile(
                                openProductFile.map((x, index) => (index === i ? !x : x)),
                              )
                            }
                          >
                            {openProductFile[i] ? (
                              <>
                                <Tooltip title={'Resmi gizle'}>
                                  <span>
                                    <KeyboardArrowUpIcon />
                                  </span>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title={'Resmi göster'}>
                                  <span>
                                    <KeyboardArrowDownIcon color="white" />
                                  </span>
                                </Tooltip>
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      {product.productFile !== null && isDrawer && (
                        <div>
                          <Image
                            src={
                              product.productFile.asset?._ref
                                ? urlFor(product.productFile)?.url()
                                : product.productFile !== null || product.productFile !== undefined
                                ? URL.createObjectURL(product.productFile)
                                : noImage.src
                            }
                            width={55}
                            height={50}
                            className={'w-100'}
                            onClick={() =>
                              setOpenProductFile(
                                openProductFile.map((x, index) => (index === i ? !x : x)),
                              )
                            }
                          />
                          <Dialog
                            open={openProductFile[i]}
                            onClose={() => {
                              setOpenProductFile(
                                openProductFile.map((x, index) => (index === i ? !x : x)),
                              );
                            }}
                            fullScreen={true}
                            key={i}
                          >
                            <DialogContent>
                              <Image
                                src={
                                  product?.productFile.asset
                                    ? urlFor(product?.productFile)?.url()
                                    : product?.productFile !== null ||
                                      product?.productFile !== undefined
                                    ? URL.createObjectURL(product?.productFile)
                                    : noImage.src
                                }
                                layout="fill"
                                objectFit="none"
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: '#f50057',
                                  '&:hover': {
                                    backgroundColor: '#f50057',
                                  },
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                }}
                                onClick={() =>
                                  setOpenProductFile(
                                    openProductFile.map((x, index) => (index === i ? !x : x)),
                                  )
                                }
                              >
                                Kapat
                              </Button>
                              <input
                                id={`products.${i}.productFile`}
                                name={`products.${i}.productFile`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  setFieldValue(
                                    `products.${i}.productFile`,
                                    e.currentTarget.files[0],
                                  );
                                }}
                                style={{ display: 'none' }}
                              />
                              <label htmlFor={`products.${i}.productFile`}>
                                <Button
                                  sx={{ borderRadius: 0 }}
                                  variant="contained"
                                  color="inherit"
                                  component={'span'}
                                >
                                  Resmi Degistir
                                </Button>
                              </label>

                              <a href={`${buildURL(product?.productFile?.asset)}?dl=`} download>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  variant="contained"
                                  disabled={product?.productFile?.asset === undefined}
                                  color="primary"
                                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                >
                                  Resmi Indir
                                </Button>
                              </a>
                            </DialogActions>
                          </Dialog>
                        </div>
                      )}
                    </Stack>
                    {product.productFile !== undefined && openProductFile[i] && !isDrawer && (
                      <Collapse in={openProductFile[i]} timeout="auto" unmountOnExit>
                        <Box display={'block'}>
                          <div className="form-group col-12">
                            <Box sx={{ display: 'block' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                <Image
                                  src={
                                    product.productFile.serviceId === 'docs'
                                      ? createImageURLFromDrive(product.productFile.id)
                                      : URL.createObjectURL(product.productFile)
                                  }
                                  width={350}
                                  height={300}
                                  className={'w-100'}
                                />
                              </Box>
                              <Box display={'flex'} sx={{ justifyContent: 'center' }}>
                                <Box
                                  display={'flex'}
                                  sx={{
                                    justifyContent: 'space-between',
                                    border: '1px solid',
                                    paddingLeft: 3,
                                    marginBottom: 12,
                                    width: '100%',
                                    maxWidth: 350,
                                  }}
                                >
                                  <p style={{ marginTop: 3 }}>
                                    {product.productFile?.name.length > 67
                                      ? product.productFile?.name.slice(0, 67) + '...'
                                      : product.productFile?.name}
                                  </p>
                                  <Tooltip title={'Resmi sil'}>
                                    <span>
                                      <Button variant="text" color="inherit">
                                        <Delete
                                          onClick={() =>
                                            setFieldValue(`products.${i}.productFile`, undefined)
                                          }
                                        />
                                      </Button>
                                    </span>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          </div>
                        </Box>
                      </Collapse>
                    )}

                    <Stack
                      spacing={isDrawer && !isNonMobile ? 0 : 2}
                      direction={'row'}
                      sx={{ marginBottom: 2 }}
                    >
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="number"
                        id={`products.${i}.productWidth`}
                        name={`products.${i}.productWidth`}
                        label="En"
                        error={Boolean(errors.products?.[i]?.productWidth)}
                        // helperText={errors.products?.[i]?.productWidth}
                        size="small"
                      />
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="number"
                        id={`products.${i}.productHeight`}
                        name={`products.${i}.productHeight`}
                        label="Boy"
                        error={Boolean(errors.products?.[i]?.productHeight)}
                        size="small"
                      />
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="number"
                        id={`products.${i}.productPiece`}
                        name={`products.${i}.productPiece`}
                        label="Adet"
                        error={Boolean(errors.products?.[i]?.productPiece)}
                        size="small"
                      />
                    </Stack>
                    <Stack
                      spacing={isDrawer && !isNonMobile ? 0 : 2}
                      direction={'row'}
                      sx={{ marginBottom: isNonMobile ? 4 : 1 }}
                    >
                      <Field
                        name={`products.${i}.productMainType`}
                        component={FormikAutocomplete}
                        options={MAINTYPE_OPTIONS}
                        onChange={(e, value) => {
                          setFieldValue(
                            `products.${i}.productMainType`,
                            value ? value : { value: '', title: '' },
                          );
                          setFieldValue(`products.${i}.productSubType`, { value: '', title: '' });
                          setFieldValue(`products.${i}.productCargoType`, { value: '', title: '' });
                        }}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`products.${i}.productMainType`}
                            error={Boolean(
                              values.products?.[i]?.productMainType?.value === undefined ||
                                values.products?.[i]?.productMainType?.value === '',
                            )}
                            label="Ürün Ana Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <Field
                        name={`products.${i}.productSubType`}
                        component={FormikAutocomplete}
                        options={selectSubOptions(product.productMainType?.title)}
                        // onChange={(e) => {
                        //   if (!product.productMainType?.title)
                        //     setFieldValue(`products.${i}.productSubType`, '');
                        // }}
                        disabled={
                          !product.productMainType ||
                          product.productMainType?.title === '' ||
                          product.productMainType?.title === 'Cam'
                        }
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`products.${i}.productSubType`}
                            label="Ürün Alt Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <Field
                        name={`products.${i}.productCargoType`}
                        component={FormikAutocomplete}
                        options={SHIPPING_OPTIONS}
                        // onChange={(e) => {
                        //   setFieldValue(`products.${i}.productCargoType`, e.target.value?.id);
                        // }}
                        disabled={
                          !product.productMainType ||
                          product.productMainType?.title === '' ||
                          product.productMainType?.title === 'Cam'
                        }
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`products.${i}.productCargoType`}
                            label="Ürün Kargo Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Stack>

                    {i === values.products.length - 1 && isNonMobile === false && (
                      <Box
                        sx={{
                          marginBottom: 0, // isNonMobile ? 48 : 12,
                          marginTop: 0, //32,
                          height: 1,
                          width: '100%',
                          backgroundColor: 'lightgray',
                        }}
                      />
                    )}

                    {i === values.products.length - 1 && i !== 0 && isDrawer && <Divider />}
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

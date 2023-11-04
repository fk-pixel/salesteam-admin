import React from 'react';
import Image from 'next/image';
import {
  Stack,
  TextField as MuiTextField,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ArrowBack, Delete } from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { FieldArray, Field } from 'formik';
import { TextField as FormikTextField, Autocomplete as FormikAutocomplete } from 'formik-mui';

import noImage from '../../assets/images/users/noimage.png';
import { MAINTYPE_OPTIONS, SHIPPING_OPTIONS, selectSubOptions } from '../../common/Utils/FormsUtil';
import { urlFor } from '../../../sanity/utils/client';
import { buildURL } from '../../../sanity/lib/image';

export function GiftComponent({
  values,
  errors,
  touched,
  isNonMobile,
  setFieldValue,
  isDrawer,
  // onChangeOpenDrawer,
}) {
  const [openGiftFile, setOpenGiftFile] = React.useState([]);

  React.useEffect(() => {
    if (values.gifts?.length > 0 && values.gifts !== undefined) {
      const openGiftFilesSituations = Array(values.gifts.length).fill(false);
      setOpenGiftFile(openGiftFilesSituations);
    }
  }, [values.gifts]);

  return (
    <>
      <Stack
        direction={'column'}
        sx={{
          marginTop: isDrawer ? (isNonMobile ? 1 : 0) : 3,
          marginLeft: isDrawer ? (isNonMobile ? 3 : 14) : 0,
          width: isDrawer ? (isNonMobile ? '85%' : '70%') : '100%',
        }}
      >
        <FieldArray key={'gifts'} name="gifts">
          {() =>
            values.gifts?.map((gift, i) => {
              const giftErrors = (errors.gifts?.length && errors.gifts[i]) || {};
              const giftTouched = (touched.gifts?.length && touched.gifts[i]) || {};
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
                      backgroundColor: '#fff',
                      marginBottom: 2,
                      marginTop: i === 0 ? 6 : isNonMobile ? 0 : 3,
                      border: '1.5px solid #1d1c1a',
                      color: '#1d1c1a',
                      // border: '1.5px solid #027148',
                      // color: '#027148',
                    }}
                  >
                    <h5
                      className="card-title"
                      style={{ marginLeft: 3, marginTop: 5, fontSize: isDrawer ? 'small' : '' }}
                    >
                      Hediye {i + 1}
                    </h5>
                  </Box>
                  <Box display={'block'}>
                    <Stack spacing={2} direction={'row'} sx={{ marginBottom: 2, marginTop: 2 }}>
                      <Field
                        fullWidth
                        component={FormikTextField}
                        id={`gifts.${i}.giftName`}
                        name={`gifts.${i}.giftName`}
                        label="Hediye adi"
                        type="text"
                        error={Boolean(errors.gifts?.[i]?.giftName)}
                        size="small"
                      />

                      {gift.giftFile === undefined && !isDrawer && (
                        <>
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
                              color={'error'}
                              component={'span'}
                              size="medium"
                              sx={{ height: 40 }}
                            >
                              <AddPhotoAlternateIcon />
                            </Button>
                          </label>
                        </>
                      )}
                      {gift?.giftFile !== undefined && !isDrawer && (
                        <>
                          <Button
                            variant="contained"
                            color={'primary'}
                            aria-label="expand row"
                            size="small"
                            sx={{ height: 40 }}
                            onClick={() =>
                              setOpenGiftFile(
                                openGiftFile.map((x, index) => (index === i ? !x : x)),
                              )
                            }
                          >
                            {openGiftFile[i] ? (
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
                      {gift.giftFile !== null && isDrawer && (
                        <div>
                          <Image
                            src={
                              gift.giftFile.asset._ref
                                ? urlFor(gift.giftFile)?.url()
                                : gift.giftFile !== null || gift.giftFile !== undefined
                                ? URL.createObjectURL(gift.giftFile)
                                : noImage.src
                            }
                            width={55}
                            height={50}
                            className={'w-100'}
                            onClick={() =>
                              setOpenGiftFile(
                                openGiftFile.map((x, index) => (index === i ? !x : x)),
                              )
                            }
                          />
                          {/* </label> */}
                          <Dialog
                            open={openGiftFile[i]}
                            onClose={() => {
                              setOpenGiftFile(
                                openGiftFile.map((x, index) => (index === i ? !x : x)),
                              );
                            }}
                            fullScreen={true}
                            key={i}
                          >
                            <DialogContent>
                              <Image
                                src={
                                  gift?.giftFile.asset
                                    ? urlFor(gift?.giftFile)?.url()
                                    : gift?.giftFile !== null || gift?.giftFile !== undefined
                                    ? URL.createObjectURL(gift?.giftFile)
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
                                }}
                                onClick={() =>
                                  setOpenGiftFile(
                                    openGiftFile.map((x, index) => (index === i ? !x : x)),
                                  )
                                }
                              >
                                Kapat
                              </Button>
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
                                <Button variant="contained" color="inherit" component={'span'}>
                                  Resmi Degistir
                                </Button>
                              </label>

                              <a href={`${buildURL(gift?.giftFile?.asset)}?dl=`} download>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  variant="contained"
                                  disabled={gift?.giftFile?.asset === undefined}
                                  color="primary"
                                >
                                  Resmi Indir
                                </Button>
                              </a>
                            </DialogActions>
                          </Dialog>
                        </div>
                      )}
                    </Stack>
                    {gift.giftFile !== undefined && openGiftFile[i] && !isDrawer && (
                      <Collapse in={openGiftFile[i]} timeout="auto" unmountOnExit>
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
                                  src={URL.createObjectURL(gift.giftFile)}
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
                                    {' '}
                                    {gift.giftFile?.name.length > 67
                                      ? gift.giftFile?.name.slice(0, 67) + '...'
                                      : gift.giftFile?.name}
                                  </p>
                                  <Tooltip title={'Resmi sil'}>
                                    <span>
                                      <Button variant="text" color="inherit">
                                        <Delete
                                          onClick={() =>
                                            setFieldValue(`gifts.${i}.giftFile`, undefined)
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
                        id={`gifts.${i}.giftWidth`}
                        name={`gifts.${i}.giftWidth`}
                        label="En"
                        error={Boolean(errors.gifts?.[i]?.giftWidth)}
                        size="small"
                      />
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="number"
                        id={`gifts.${i}.giftHeight`}
                        name={`gifts.${i}.giftHeight`}
                        label="Boy"
                        error={Boolean(errors.gifts?.[i]?.giftHeight)}
                        size="small"
                      />
                      <Field
                        fullWidth
                        component={FormikTextField}
                        type="number"
                        id={`gifts.${i}.giftPiece`}
                        name={`gifts.${i}.giftPiece`}
                        label="Adet"
                        error={Boolean(errors.gifts?.[i]?.giftPiece)}
                        size="small"
                      />
                    </Stack>

                    <Stack
                      spacing={isDrawer && !isNonMobile ? 0 : 2}
                      direction={'row'}
                      sx={{ marginBottom: isNonMobile ? 4 : 1 }}
                    >
                      <Field
                        name={`gifts.${i}.giftMainType`}
                        component={FormikAutocomplete}
                        options={MAINTYPE_OPTIONS}
                        onChange={(e, value) => {
                          setFieldValue(
                            `gifts.${i}.giftMainType`,
                            value ? value : { value: '', title: '' },
                          );
                          setFieldValue(`gifts.${i}.giftSubType`, { value: '', title: '' });
                          setFieldValue(`gifts.${i}.giftCargoType`, { value: '', title: '' });
                        }}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`gifts.${i}.giftMainType`}
                            error={Boolean(
                              values.gifts?.[i]?.giftMainType?.value === undefined ||
                                values.gifts?.[i]?.giftMainType?.value === '',
                            )}
                            label="Hediye Ana Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <Field
                        name={`gifts.${i}.giftSubType`}
                        component={FormikAutocomplete}
                        options={selectSubOptions(gift.giftMainType?.title)}
                        disabled={
                          gift.giftMainType?.title === '' || gift.giftMainType?.title === 'Cam'
                        }
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`gifts.${i}.giftSubType`}
                            label="Hediye Alt Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                      <Field
                        name={`gifts.${i}.giftCargoType`}
                        component={FormikAutocomplete}
                        options={SHIPPING_OPTIONS}
                        disabled={gift.giftMainType?.title === 'Cam'}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            name={`gifts.${i}.giftCargoType`}
                            label="Hediye Kargo Tipi"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Stack>

                    {i === values.giftNumber - 1 && isNonMobile === false && (
                      <Box
                        sx={{
                          marginBottom: 48,
                          marginTop: 32,
                          height: 1,
                          width: '100%',
                          backgroundColor: 'lightgray',
                        }}
                      />
                    )}

                    {i === values.gifts.length - 1 && isDrawer && (
                      <Box
                        sx={{
                          marginBottom: 12,
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

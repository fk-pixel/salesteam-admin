import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, useMediaQuery } from '@mui/material';

import Auth from '../../src/layouts/Auth';
import { getUsers } from '../../sanity/utils/user-utils';

const theme = createTheme();

export default function Register() {
  const router = useRouter();

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const registerState = {
    email: '',
    password: '',
    store: '',
    username: '',
    requestForAdmin: false,
    role: 'user',
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email('Gecersiz mail girdiniz').required('Mail adresinizi giriniz'),
    password: yup
      .string()
      .test('len', 'Parola karakter limitini astiniz', (val) => val.length <= 12)
      .test('len', 'Parola 8 karakterden az olamaz', (val) => val.length >= 8)
      .required('Gecerli parolanizi giriniz'),
    store: yup.string().required('Gecerli magazanizi giriniz'),
    username: yup.string().required('Gecerli kullanici adinizi giriniz'),
  });

  const onSubmit = async (values, resetForm) => {
    const users = await getUsers();

    const savedUser = users?.find((x) => x.email === values.email);

    if (!savedUser) {
      await fetch('/api/createUser', {
        method: 'POST',
        body: JSON.stringify(values),
      })
        .then(() => {
          toast('Basariyla kullanici kaydi yaptiniz. Giris sayfasina yönlendiriliyorsunuz', {
            type: 'success',
          });
          router.push('/auth/login');
        })
        .catch(() => {
          toast(`Kayit isleminiz eksik veya gecersizdir. Lütfen tekrar deneyin`, {
            type: 'error',
          });
        });
    } else {
      resetForm();
      toast(
        `'${values.email}' mail adresine ait yeni kayit girilemiyor. Lütfen baska bir mail adresiyle kayit deneyin`,
        {
          type: 'error',
        },
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        height={'100%'}
        style={{
          backgroundColor: '#fff',
          position: 'relative',
          padding: isNonMobile ? 32 : 12,
          marginTop: isNonMobile ? 132 : 0,
          borderRadius: isNonMobile ? 30 : 0,
          height: isNonMobile ? '' : '-webkit-fill-available',
          minHeight: isNonMobile ? '' : '100vh',
          alignItems: 'center',
        }}
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
            marginBottom: isNonMobile ? 6 : 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff',
            position: 'relative',
            borderRadius: 6,
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', marginTop: 6 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{ position: 'relative', marginBottom: 18 }}
          >
            Kayıt ol
          </Typography>
        </Box>
        <Formik
          onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
          initialValues={registerState}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                required
                fullwidth
                id="email"
                label="Email Adresi"
                name="email"
                value={values.email}
                style={{ marginBottom: 48 }}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                onChange={handleChange}
              />
              <TextField
                required
                fullwidth
                name="password"
                label="Parola"
                value={values.password}
                type="password"
                id="password"
                style={{ marginBottom: 24 }}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                onChange={handleChange}
              />
              <TextField
                required
                fullwidth
                name="store"
                label="Mağaza"
                value={values.store}
                id="store"
                style={{ marginBottom: 24 }}
                error={!!touched.store && !!errors.store}
                helperText={touched.store && errors.store}
                onChange={handleChange}
              />
              <TextField
                required
                fullwidth
                name="username"
                label="Kullanıcı adı"
                value={values.username}
                id="username"
                style={{ marginBottom: 24 }}
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                onChange={handleChange}
              />
              <Grid container spacing={4} style={{ alignItems: 'center', alignContent: 'center' }}>
                <Grid item>
                  <FormControlLabel
                    control={<Checkbox id={'requestForAdmin'} />}
                    label={`Admin istek gönder`}
                    name="requestForAdmin"
                    value={values.requestForAdmin}
                    style={{ marginTop: 12, marginLeft: 0 }}
                  />
                </Grid>
                <Grid item xs>
                  <Link
                    href="/auth/login"
                    variant="body2"
                    sx={{
                      color: 'black',
                    }}
                  >
                    Geri dön
                  </Link>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullwidth
                variant="contained"
                style={{ marginTop: 48, marginBottom: 24 }}
                sx={{ mt: 12, mb: 2 }}
              >
                Kaydet
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </ThemeProvider>
  );
}

Register.layout = Auth;

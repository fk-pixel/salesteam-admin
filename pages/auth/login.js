import * as React from 'react';
import { useRouter } from 'next/router';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Typography, Box, Button, Container, InputAdornment, useMediaQuery } from '@mui/material';

import Auth from '../../src/layouts/Auth';
import { client } from '../../sanity/utils/client';

export default function LogIn({ users }) {
  const router = useRouter();

  const isNonMobile = useMediaQuery('(min-width:600px)');

  const [showPassword, setShowPassword] = React.useState(false);

  const loginState = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email('Gecersiz mail girdiniz').required('Mail adresinizi giriniz'),
    password: yup
      .string()
      .test('len', 'Parola karakter limitini astiniz', (val) => val.length <= 12)
      .test('len', 'Parola 8 karakterden az olamaz', (val) => val.length >= 8)
      .required('Gecerli parolanizi giriniz'),
  });

  const onSubmit = async (values) => {
    const user = users !== null ? users.find((x) => x.email === values.email) : {};

    const matchedUser =
      user !== undefined && user.email === values.email && user.password === values.password;

    if (matchedUser) {
      toast('Basariyla giris yaptiniz. Ana sayfaya yönlendiriliyorsunuz', {
        type: 'success',
      });
      router.push('/dashboard');

      localStorage.setItem(
        'userData',
        JSON.stringify({
          id: user._id,
        }),
      );
    }

    if (!matchedUser) {
      if (!user) {
        toast(`'${values.email}' kullanici kayitli degil.`, {
          type: 'error',
        });
      } else {
        toast(`'${values.email}' kullaniciya ait bilgiler eksik veya gecersizdir.`, {
          type: 'error',
        });
      }
    }
  };

  const handleTogglePassword = () => setShowPassword((showPassword) => !showPassword);

  return (
    <>
      <Container
        sx={{
          backgroundColor: '#fff',
          position: isNonMobile ? 'relative' : 'fixed',
          padding: isNonMobile ? 3 : 6,
          marginTop: isNonMobile ? 5 : -20,
          marginBottom: isNonMobile ? undefined : 10,
          borderRadius: isNonMobile ? 3 : 0,
          height: isNonMobile ? '' : '-webkit-fill-available',
          minHeight: isNonMobile ? '' : '100vh',
          alignItems: 'center',
        }}
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
            marginBottom: isNonMobile ? 3 : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff', //'#3b609c',
            position: 'relative',
            borderRadius: 6,
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          <Avatar sx={{ m: 2, bgcolor: 'secondary.main', marginTop: 3 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ position: 'relative', marginBottom: 12 }}>
            Oturum aç
          </Typography>
        </Box>
        <Formik onSubmit={onSubmit} initialValues={loginState} validationSchema={validationSchema}>
          {({ errors, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Adresi"
                name="email"
                autoComplete="username"
                style={{ marginBottom: 48 }}
                error={!!errors.email}
                helperText={errors.email}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                id="password"
                label="Parola"
                name="password"
                autoComplete="new-password"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      style={{ cursor: 'pointer' }}
                      position="end"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                // onLoad={subit calisikrn isloading true ise burada dönen sprint icon göster}
                // disabled={errors.length > 0}
                variant="contained"
                color="primary"
                sx={{ marginTop: isNonMobile ? 12 : 18, marginBottom: isNonMobile ? 3 : 6 }}
              >
                Giriş Yap
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </>
  );
}

LogIn.layout = Auth;

export const getServerSideProps = async () => {
  const query = '*[ _type == "user"]';
  const users = await client.fetch(query);

  if (!users.length) {
    return {
      props: {
        users: [],
      },
    };
  } else {
    return {
      props: {
        users,
      },
    };
  }
};

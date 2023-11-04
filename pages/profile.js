import React from 'react';
import Image from 'next/image';

import user4 from '../src/assets/images/users/user4.jpg';

import FullLayout from '../src/layouts/FullLayout';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

export default function UserProfile() {
  return (
    <div>
      <Grid container>
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardContent color="warning">
              <Box
                sx={{
                  marginTop: '-15px',
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14)',
                  //background: linear-gradient(60deg, #ffa726, #fb8c00),
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
                  Profili Düzenle
                </Typography>
              </Box>

              <Grid container sx={{ marginTop: 6 }}>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    label="Mağaza"
                    id="store"
                    fullWidth
                    value={'userProfile.store'}
                    variant={'outlined'}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    label="Kullanıcı"
                    id="username"
                    value={'user.username'}
                    disabled
                    fullWidth
                    variant={'outlined'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    label="Email adresi"
                    id="email"
                    value={'user.email'}
                    size="small"
                    variant={'outlined'}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    label="Parola"
                    id="password"
                    value={'user.password'}
                    size="small"
                    variant={'outlined'}
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <TextInput
                    labelText="First Name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextInput
                    labelText="Last Name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <TextInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <TextInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <TextInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer> */}
              {/* <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>Hakkimda</InputLabel>
                  <TextInput
                    labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                    }}
                  />
                </GridItem>
              </GridContainer> */}
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary">
                Profili Güncelle
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card profile style={{ marginTop: 48 }}>
            <CardContent
            // style={{ marginTop: 2 }}
            // children={
            //   <>
            //     <BuildCircleRounded />
            //   </>
            // }
            >
              {/* <a href="#pablo" onClick={(e) => e.preventDefault()}> */}

              <Image src={user4.src} width={200} height={200} />
              {/* </a> */}
              {/* <Avatar sizes="25px" sx={{ bgcolor: 'warning.main' }} alt="user-profile">
                {userProfile.username}
              </Avatar> */}
            </CardContent>
            <CardContent profile>
              <h6 /* className={classes.cardCategory} */>Card / USER</h6>
              <h4 /* className={classes.cardTitle} */>Avatar</h4>
              <p /* className={classes.description} */>...</p>
              <Button variant="contained" color="warning" style={{ marginTop: 32 }}>
                Avatar olustur
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

UserProfile.layout = FullLayout;

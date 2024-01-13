import React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';

import { usePortalContext } from '../src/common/Portal/portal';
import FullLayout from '../src/layouts/FullLayout';
import DataTable from '../src/components/DataTable/DataTable';
import { client } from '../sanity/utils/client';
import { Update } from '@mui/icons-material';

export default function Dashboard() {
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const { User } = usePortalContext();

  const [orders, setOrders] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(false);

  const userQuery = `*[_type == "order" && createdBy._ref == '${User._id}'] | order(_createdAt desc){          
    _id,
    _createdAt,
    products[] {
      productFile,
      productName,
      productWidth,
      productHeight,
      productPiece,
      productMainType,
      productSubType,
      productCargoType,
    },
    gifts[] {
      giftFile,
      giftName,
      giftWidth,
      giftHeight,
      giftPiece,
      giftMainType,
      giftSubType,
      giftCargoType,
    },
    cost,
    packagingCost,
    shippingCost,
    description,
    cargoLabel,
    price,
    status,
    createdBy-> {_id, username, email, store},
    notifications[] {
      notificationId,
      createdAt,
      context,
      note,
      noteToAdmin[] -> {_id, username, email, store},
      flag,
      answers[] {
        answerId,
        createdAt,
        answer,
        answeredBy-> {_id, username, email, store}
        }
    }
  }`;

  const adminQuery = `*[_type == "order"] | order(_createdAt desc){          
    _id,
    _createdAt,
    products[] {
      productFile,
      productName,
      productWidth,
      productHeight,
      productPiece,
      productMainType,
      productSubType,
      productCargoType,
    },
    gifts[] {
      giftFile,
      giftName,
      giftWidth,
      giftHeight,
      giftPiece,
      giftMainType,
      giftSubType,
      giftCargoType,
    },
    cost,
    packagingCost,
    shippingCost,
    description,
    cargoLabel,
    price,
    status,
    createdBy-> {_id, username, email, store},
    notifications[] {
      notificationId,
      createdAt,
      context,
      note,
      noteToAdmin[] -> {_id, username, email, store},
      flag,
      answers[] {
        answerId,
        createdAt,
        answer,
        answeredBy-> {_id, username, email, store}
        }
    }
  }`;

  React.useEffect(() => {
    if (User.role === 'user') {
      try {
        setDataLoading(true);
        client.fetch(userQuery).then(setOrders);
        const subscription = client.listen(userQuery, {}, { visibility: 'query' }).subscribe(() => {
          client.fetch(userQuery).then(setOrders);
        });
        if (orders.length > 0) {
          setDataLoading(false);
        }
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        toast(`${error.message}`, {
          type: 'error',
        });
        setDataLoading(false);
      }
    }

    if (User.role === 'admin' || User.role === 'superAdmin') {
      try {
        setDataLoading(true);
        client.fetch(adminQuery).then(setOrders);
        const subscription = client
          .listen(adminQuery, {}, { visibility: 'query' })
          .subscribe(() => {
            client.fetch(adminQuery).then(setOrders);
          });
        if (orders.length > 0) {
          setDataLoading(false);
        }
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        toast(`${error.message}`, {
          type: 'error',
        });
        setDataLoading(false);
      }
    }
  }, [User.role, adminQuery, userQuery, orders.length]);

  const productSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) => (x.products?.length > 0 ? x.products.map((y) => y.productPiece) : 0))
          .reduce((acc, val) => acc + val, 0)
      : 0;

  const giftSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) => (x.gifts?.length > 0 ? x.gifts.map((y) => y.giftPiece) : 0))
          .reduce((acc, val) => acc + val, 0)
      : 0;

  const panelSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) =>
            x.products?.length > 0
              ? x.products.map((y) => (y.productMainType === 'panel' ? y.productPiece : 0))
              : 0,
          )
          .reduce((acc, val) => acc + val, 0)
      : 0;

  const ruloSalesInfo =
    orders?.length > 0
      ? orders
          .flatMap((x) =>
            x.products?.length > 0
              ? x.products.map((y) => (y.productMainType === 'roll' ? y.productPiece : 0))
              : 0,
          )
          .reduce((acc, val) => acc + val, 0)
      : 0;

  return (
    <>
      <Grid container direction="row" spacing={1} sx={{ marginBottom: 0 }}>
        <Grid item xs={12} sm={6} md={3} sx={{ marginBottom: 3 }}>
          <Card>
            <CardContent>
              <Box display={'flex'} height={'100%'} sx={{ justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    marginTop: '-37px',
                    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14)',
                    //background: linear-gradient(60deg, #ffa726, #fb8c00),
                    borderRadius: 1,
                    height: 60,
                    width: 60,
                    backgroundColor: 'orange',
                    alignSelf: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'white',
                    }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Ürün
                  </Typography>
                </Box>
                <Box display={'block'}>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    Toplam Satış Adedi
                  </Typography>
                  <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                    {productSalesInfo ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                <Update style={{ marginRight: 6, color: '#999' }} fontSize="small" />
                Son 1 ay
              </Typography>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ marginBottom: isNonMobile ? 0 : 3 }}>
          <Card>
            <CardContent>
              <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    marginTop: '-37px',
                    height: 60,
                    width: 60,
                    backgroundColor: '#43a047',
                    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14)',
                    borderRadius: 1,
                    alignSelf: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'white',
                    }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Hediye
                  </Typography>
                </Box>
                <Box display={'block'}>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    Toplam Satış Adedi
                  </Typography>
                  <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                    {giftSalesInfo ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                <Update style={{ marginRight: 6, color: '#999' }} fontSize="small" />
                Son 1 ay
              </Typography>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ marginBottom: isNonMobile ? 0 : 3 }}>
          <Card>
            <CardContent>
              <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    marginTop: '-37px',
                    height: 60,
                    width: 60,
                    backgroundColor: '#00acc1',
                    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14)',
                    borderRadius: 1,
                    alignSelf: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'white',
                    }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Rulo
                  </Typography>
                </Box>
                <Box display={'block'}>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    Toplam Satış Adedi
                  </Typography>
                  <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                    {ruloSalesInfo ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                <Update style={{ marginRight: 6, color: '#999' }} fontSize="small" />
                Son 1 ay
              </Typography>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ marginBottom: isNonMobile ? 0 : 3 }}>
          <Card>
            <CardContent>
              <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    marginTop: '-37px',
                    height: 60,
                    width: 60,
                    backgroundColor: '#ef5350',
                    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14)',
                    borderRadius: 1,
                    alignSelf: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'white',
                    }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Panel
                  </Typography>
                </Box>
                <Box display={'block'}>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    Toplam Satış Adedi
                  </Typography>
                  <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                    {panelSalesInfo ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                <Update style={{ marginRight: 6, color: '#999' }} fontSize="small" />
                Son 1 ay
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container direction={'column'} sx={{ marginTop: 1 }}>
        <Box width={'100%'}>
          <Card>
            <CardContent>
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
                    fontSize: 18,
                    fontWeight: 500,
                    color: 'white',
                    marginLeft: 1,
                  }}
                  color="text.secondary"
                  gutterBottom
                >
                  Genel Sipariş Tablosu
                </Typography>
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <DataTable data={orders} userData={User} dataLoading={dataLoading} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </>
  );
}

Dashboard.layout = FullLayout;

// export const getServerSideProps = async () => {
//   const query = `*[ _type == "order"] | order(_createdAt desc){
//           _id,
//           _createdAt,
//           products[] {
//             productFile,
//             productName,
//             productWidth,
//             productHeight,
//             productMainType,
//             productSubType,
//             productCargoType,
//           },
//           gifts[] {
//             giftFile,
//             giftName,
//             giftWidth,
//             giftHeight,
//             giftMainType,
//             giftSubType,
//             giftCargoType,
//           },
//           cost,
//           packagingCost,
//           shippingCost,
//           description,
//           cargoLabel,
//           price,
//           status,
//           createdBy-> {_id, username, email, store}
//   }`;

//   const orders = await client.fetch(query);

//   if (!orders.length) {
//     return {
//       props: {
//         orders: [],
//       },
//     };
//   } else {
//     return {
//       props: {
//         orders,
//       },
//     };
//   }
// };

//   const ruloSalesInfo =
// orders !== null && orders.length > 0
//   ? user !== null || user !== undefined
//     ? user.role !== 'user'
//       ? orders.filter((x) => x.productMainType === 'Rulo').length
//       : orders
//           .filter((x) => x.createdBy?.username === user.username)
//           .filter((x) => x.productMainType === 'Rulo').length
//     : 0
//   : 0;

// const panelSalesInfo =
//   orders !== null && orders.length > 0
//     ? user !== null || user !== undefined
//       ? user.role !== 'user'
//         ? orders.filter((x) => x.productMainType === 'Panel').length
//         : orders
//             .filter((x) => x.createdBy?.username === user.username)
//             .filter((x) => x.productMainType === 'Panel').length
//       : 0
//     : 0;

// return (
//   <div>
//     <Head>
//       <title>Sales Team Dashboard</title>
//       <meta name="description" content="Sales Team Dashboard Dashboard Template" />
//       <link rel="icon" href="/favicon.ico" />
//     </Head>
//     <div>
//       {/***Sales & Feed***/}
//       <Row>
//         <Col sm="12" lg="6" xl="7" xxl="8">
//           <SalesChart />
//         </Col>
//         <Col sm="12" lg="6" xl="5" xxl="4">
//           <Feeds />
//         </Col>
//       </Row>
//       {/***Table ***/}
//       <Row>
//         <Col lg="12" sm="12">
//           <ProjectTables />
//         </Col>
//       </Row>
//       {/***Blog Cards***/}
//       <Row>
//         {BlogData.map((blg) => (
//           <Col sm="6" lg="6" xl="3" key={blg.title}>
//             <Blog
//               image={blg.image}
//               title={blg.title}
//               subtitle={blg.subtitle}
//               text={blg.description}
//               color={blg.btnbg}
//             />
//           </Col>
//         ))}
//       </Row>
//     </div>
//   </div>
// );

// const quantityCardInfo =
//   orders !== null && orders.length > 0
//     ? user !== null || user !== undefined
//       ? user.role !== 'user'
//         ? orders.length
//         : orders.filter((x) => x.createdBy?.username === user.username).length
//       : 0
//     : 0;

// const salesCardInfo =
//   orders !== null && orders.length > 0
//     ? user !== null || user !== undefined
//       ? user.role !== 'user'
//         ? orders
//             .map((x) => (x.price !== undefined ? x.price : null))
//             .reduce((acc, val) => acc + Math.round(val), 0)
//         : orders
//             .filter((x) => x.createdBy?.username === user.username)
//             .map((x) => (x.price !== undefined ? x.price : null))
//             .reduce((acc, val) => acc + Math.round(val), 0)
//       : 0
//     : 0;

{
  /* <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Kazanc</p>
              <h3 className={classes.cardTitle}>${salesCardInfo ?? 0}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Son 1 ay
              </div>
            </CardFooter>
          </Card>
        </GridItem> */
}

{
  /* <GridItem xs={12} sm={6} md={3}>
<Card>
  <CardHeader color="success" stats icon />
    <CardIcon color="success" />{<Store />}Hediye</CardIcon>
    <p style={styles.cardCategory} />Toplam Satış Adedi</p>
    <h3 style={styles.cardTitle} />{giftSalesInfo ?? 0}</h3>
  </CardHeader>
  <CardFooter stats />
    <div style={styles.stats} />
      <Update />
      Son 1 ay
    </div>
  </CardFooter>
</Card>
</GridItem>

<GridItem xs={12} sm={6} md={3}>
<Card>
  <CardHeader  color="info" stats icon />
    <CardIcon  color="info" />{<PieChartOutlineIcon />}Rulo</CardIcon>
    <p style={styles.cardCategory} />Toplam Satış Adedi</p>
    <h3 style={styles.cardTitle} />{ruloSalesInfo ?? 0}</h3>
  </CardHeader>
  <CardFooter stats />
    <div style={styles.stats}/>
      {<LocalOffer />}
      <Update />
      Son 1 ay
    </div>
  </CardFooter>
</Card>
</GridItem>

<GridItem xs={12} sm={6} md={3}>
<Card>
  <CardHeader  color="danger" stats icon />
    <CardIcon  color="danger" />{ <PieChartOutlineIcon />}Panel</CardIcon>
    <p  style={styles.cardCategory} />Toplam Satış Adedi</p>
    <h3  style={styles.cardTitle} />{panelSalesInfo ?? 0}</h3>
  </CardHeader>
  <CardFooter stats />
    <div style={styles.stats} />
      <Update />
      Son 1 ay
    </div>
  </CardFooter>
</Card>
</GridItem> */
}

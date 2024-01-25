import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { client } from '../../../sanity/utils/client';
import { format } from 'date-fns';

import { Close, Search } from '@mui/icons-material';
import { getAdminNameWithAvatar } from '../../utils/DashboardUtil';
import OrderDetail from '../OrderDetail/OrderDetail';
import _ from 'lodash';

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

export default function Searchbar() {
  const [openSearchbar, setOpenSearch] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async (keyword) => {
      const data = await client
        .fetch(adminQuery)
        .then((res) => res.filter((order) => keyword && order._id.includes(keyword)));

      if (data !== undefined) {
        setOrders(data);
      }
    };
    fetchData(keyword);
  }, [keyword]);

  const handleChange = (value) => {
    setKeyword(value);
  };

  console.log('orders', orders);

  return (
    <>
      <Box sx={{ display: 'block' }}>
        <Box sx={{ display: 'flex' }}>
          {!openSearchbar && <Search onClick={() => setOpenSearch(!openSearchbar)} />}
          {openSearchbar && (
            <>
              <input
                className={':hover{text-decoration:none'}
                style={{
                  borderRadius: 6,
                  borderColor: 'cornflowerblue',
                  // 'input:focus': {
                  //   borderColor: '#f44336',
                  //   backgroundColor: 'lightblue',
                  //   color: '#f44336',
                  // },
                  boxShadow:
                    'inset 0 0 0 3px #fff, 0 0 0 4px #fff, 3px -3px 30px #rgb(255, 255, 255) 0px 0px 0px 3px inset, rgb(255, 255, 255) 0px 0px 0px 4px, #rgb(126 139 130) 3px -3px 30px, white -3px 3px 30px, -3px 3px 30px white',
                }}
                placeholder="Siparislerde arayin..."
                value={keyword}
                onChange={(e) => handleChange(e.target.value)}
              />

              <Close
                sx={{ alignSelf: 'center' }}
                onClick={() => {
                  setKeyword('');
                  setOpenSearch(!openSearchbar);
                }}
              />
            </>
          )}
        </Box>
        {openSearchbar && (
          <Box sx={{ padding: '10px 20px', position: 'absolute', zIndex: 1, marginLeft: -30 }}>
            <SearchItems orders={orders} />
          </Box>
        )}
      </Box>
    </>
  );
}

export function SearchItems({ orders }) {
  const [selectedOrder, setSelectedOrder] = React.useState({});

  const handleOrder = (order) => {
    setSelectedOrder(order);
  };

  if (!_.isEmpty(selectedOrder)) {
    return <OrderDetail data={selectedOrder} onChange={setSelectedOrder} />;
  }

  return (
    <>
      {orders.map((order, index) => (
        <Box
          sx={{
            padding: 2,
            marginRight: -12,
            marginBottom: 1,
            borderRadius: 4,
            boxShadow:
              'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
            maxWidth: '450px',
            minWidth: '450px',
            backgroundColor: 'white',
          }}
          key={index}
        >
          <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={() => handleOrder(order)}>
            <Avatar sx={{ bgcolor: 'warning.main', marginRight: 1, alignSelf: 'center' }}>
              {getAdminNameWithAvatar(order.createdBy?.username)}
            </Avatar>
            <Box sx={{ display: 'block' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    borderRadius: 4,
                    border: '1px solid lightgrey',
                    backgroundColor: 'white',
                    marginRight: 2,
                    padding: 1,
                  }}
                >
                  {' '}
                  <Typography fontSize={'small'} fontWeight={'bolder'}>
                    {order._id}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    borderRadius: 4,
                    border: '1px solid lightgrey',
                    backgroundColor: '#1d1c1a',
                    padding: 1,
                    color: 'white',
                  }}
                >
                  {' '}
                  <Typography fontSize={'medium'}>
                    {order.products?.length} ürün{' '}
                    {order.gifts === undefined || order.gifts === null ? 0 : order.gifts?.length}{' '}
                    hediye
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'block', justifyContent: 'space-between' }}>
                <Box>
                  <Typography fontSize={'medium'}>
                    {order.description?.length > 30
                      ? order.description.slice(0, 30) + '...'
                      : order.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography sx={{ marginRight: 1 }}>{makeStatusCircle(order?.status)}</Typography>
                  <Typography variant="caption" color={'grey'} alignSelf={'center'}>
                    {format(new Date(order?._createdAt), 'dd.MM.yyyy')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

const makeStatusCircle = (status) => {
  switch (status) {
    case 'canceledAfterProduction':
      return '🔴';
    case 'canceledBeforeProduction':
      return '🟠';

    case 'sentToProduction':
      return '🟡';
    case 'shipped':
      return '🟢';

    default:
      return '⚪';
  }
};

import React from 'react';
import Image from 'next/image';
import { Box, Button, Divider, Typography } from '@mui/material';
import { urlFor } from '../../../sanity/utils/client';

export default function OrderDetail({ data, onChange }) {
  return (
    <Box
      sx={{
        display: 'block',
        minWidth: 500,
        height: 750,
        backgroundColor: 'white',
        overflowY: 'scroll',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" color={'grey'} fontWeight={600}>
          Ürünler
        </Typography>
        <Button
          sx={{ fontSize: '18px', backgroundColor: 'gainsboro' }}
          onClick={() => onChange(undefined)}
        >
          ←
        </Button>
      </Box>
      {data.products?.map((product, index) => (
        <>
          <Box key={index} sx={{ display: 'flex' }}>
            <Box
              sx={{
                backgroundColor: '#f8f8f8',
                minWidth: '98px',
                height: '129px',
                paddingLeft: 2,
              }}
            >
              <Image
                src={urlFor(product.productFile)?.url()}
                width={'66px'}
                height={'99px'}
                objectFit="cover"
              />
            </Box>
            <Box sx={{ display: 'block', marginLeft: 2 }}>
              <Box sx={{ color: 'darkgrey', fontWeight: 600, fontSize: '18px' }}>
                {product.productName}
              </Box>
              <Box>
                <strong>Ölcü:</strong> {product.productWidth + 'x' + product.productHeight}
              </Box>
              <Box>
                <strong>Adet:</strong> {product.productPiece}
              </Box>
              <Box>
                (
                {getMainType(product.productMainType) +
                  '-' +
                  getSubType(product.productSubType) +
                  '-' +
                  getCargoType(product.productCargoType)}
                )
              </Box>
            </Box>
          </Box>
        </>
      ))}
      <Divider />
      <Box sx={{ marginTop: 2, marginBottom: 2 }}>
        <Typography variant="subtitle1" color={'grey'} fontWeight={600}>
          Hediyeler
        </Typography>
      </Box>

      {data.gifts?.map((gift, index) => (
        <>
          <Box key={index} sx={{ display: 'flex' }}>
            <Box
              sx={{
                backgroundColor: '#f8f8f8',
                minWidth: '98px',
                height: '129px',
                paddingLeft: 2,
              }}
            >
              <Image
                src={urlFor(gift.giftFile)?.url()}
                width={'66px'}
                height={'99px'}
                objectFit="cover"
              />
            </Box>
            <Box sx={{ display: 'block', marginLeft: 2 }}>
              <Box sx={{ color: 'darkgray', fontWeight: 600, fontSize: '18px' }}>
                {gift.giftName}
              </Box>
              <Box>
                <strong>Ölcü:</strong> {gift.giftWidth + 'x' + gift.giftHeight}
              </Box>
              <Box>
                <strong>Adet:</strong> {gift.giftPiece}
              </Box>
              <Box>
                (
                {getMainType(gift.giftMainType) +
                  '-' +
                  getSubType(gift.giftSubType) +
                  '-' +
                  getCargoType(gift.giftCargoType)}
                )
              </Box>
            </Box>
          </Box>
        </>
      ))}
      <Box
        sx={{
          padding: 2,
          marginTop: 2,
          justifyContent: 'flex-end',
          display: 'flex',
          backgroundColor: '#f7f7f7',
        }}
      >
        <Typography sx={{ marginRight: 2, fontWeight: 600, fontSize: '18px' }}>
          Siparis Tutari:{' '}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>{data.price ?? '-'}</Typography>
      </Box>
    </Box>
  );
}

function getMainType(type) {
  switch (type) {
    case 'panel':
      return 'Panel';
    case 'roll':
      return 'Rulo';
    case 'glas':
      return 'Cam';
    default:
      break;
  }
}

function getSubType(type) {
  switch (type) {
    case 'thinHoop':
      return 'Ince Kasnak';
    case 'normalHoop':
      return 'Normal Kasnak';
    case 'normalRoll':
      return 'Normal Rulo';
    case 'NonReflectiveRoll':
      return 'Yansimasiz Rulo';
    case 'coatedPaper':
      return 'Kuse Kagit';
    default:
      return 'yok';
  }
}

function getCargoType(type) {
  switch (type) {
    case 'singlePanel':
      return 'Tek Panel';
    case 'twoPanels':
      return 'İki Panel';
    case 'threePanels':
      return 'Üç Panel';
    case 'threeBalancedPanels':
      return 'Üç Dengeli Panel';
    case 'fourPanels':
      return 'Dört Panel';
    case 'fivePanels':
      return 'Beş Panel';
    case 'fiveBalancedPanels':
      return 'Beş Dengeli Panel';
    default:
      return 'yok';
  }
}

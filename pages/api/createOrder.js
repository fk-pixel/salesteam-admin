// Next.js API route support: https://nextjs.org/docs/api/routes/introduction

import { client } from '../../sanity/utils/client';

export default async function createOrder(req, res) {
  const {
    products,
    gifts,
    cost,
    packagingCost,
    shippingCost,
    price,
    description,
    cargoLabel,
    status,
    createdBy,
  } = JSON.parse(req.body);

  try {
    await client.create({
      _type: 'order',
      products: products.map((product, index) => {
        return {
          _key: `product-${index}`,
          productName: product.productName,
          productFile: product.productFile ?? undefined,
          productWidth: product.productWidth,
          productHeight: product.productHeight,
          productPiece: product.productPiece,
          productMainType: product.productMainType.value,
          productSubType: product.productSubType.value,
          productCargoType: product.productCargoType.value,
        };
      }),
      gifts: gifts.map((gift, index) => {
        return {
          _key: `gift-${index}`,
          giftName: gift.giftName,
          giftFile: gift.giftFile ?? undefined,
          giftWidth: gift.giftWidth,
          giftHeight: gift.giftHeight,
          giftPiece: gift.giftPiece,
          giftMainType: gift.giftMainType.value,
          giftSubType: gift.giftSubType.value,
          giftCargoType: gift.giftCargoType.value,
        };
      }),
      cost,
      packagingCost,
      shippingCost,
      price,
      description,
      cargoLabel,
      status,
      createdBy,
      notifications: [],
      // notifications.map((notification, index) => {
      //   return {
      //     _key: `notification-${index}`,
      //     _createdAt: notification._createdAt,
      //     flag: notification.flag,
      //     context: notification.context,
      //     note: notification.note,
      //     noteToAdmin: notification.noteToAdmin,
      //   };
      // }),
    });
  } catch (error) {
    return res.status(500).json({ message: `Siparis olusturulamadi`, error });
  }

  return res.status(200).json({ message: `Siparis basarili bir sekilde olusturuldu.` });
}

// Next.js API route support: https://nextjs.org/docs/api/routes/introduction

import { client } from '../../sanity/utils/client';
//import { toast } from 'react-toastify';

export default async function getOrders(req, res) {
  //   const {
  //     products,
  //     gifts,
  //     cost,
  //     packagingCost,
  //     shippingCost,
  //     price,
  //     description,
  //     cargoLabel,
  //     status,
  //     createdBy,
  //   } = JSON.parse(req.body);

  const ISSERVER = typeof window === 'undefined';

  //let loggedIn = false;

  const user = !ISSERVER ? JSON.parse(localStorage.getItem('userData')) : {};

  //loggedIn = user !== null || user !== undefined;

  const loggedUser = await client.fetch(`*[_type == "user" && _id == '${user?.id}']{
            _id,
            _createdAt,
            email,
            username,
            store,
            requestForAdmin,
            role,
            profileImage,
            url 
          }`);

  const userQuery = `*[_type == "order" && createdBy._ref == '${loggedUser[0]._id}'] | order(_createdAt desc){
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

  const orderByUserQuery = loggedUser[0].role === 'user' ? userQuery : adminQuery;

  const orders = await client.fetch(orderByUserQuery);

  return { orders, user: loggedUser[0] }; //.then(setOrders);

  //   const subscription = client
  //     .listen(orderByUserQuery, {}, { visibility: 'query' })
  //     .subscribe(() => {
  //       client.fetch(orderByUserQuery); //.then(setOrders);
  //     });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // } catch (error) {
  //   toast(`${error.message}`, {
  //     type: 'error',
  //   });
  // }

  //return res.status(200).json({ message: `Siparisler basarili bir sekilde alindi.` });
}

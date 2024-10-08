import { groq } from 'next-sanity';
import { client } from '../utils/client';
import { v4 as uuidv4 } from 'uuid';

export async function getOrders() {
  return client.fetch(
    groq`*[_type == "order"]{
          _id,
          _createdAt,
          product,
          productFile{
            asset->{
              url
            }
          },
          productSize,
          productMainType,
          productSubType,
          productCargoType,
          gift1,
          gift1File{
            asset->{
              url
            }
          },
          gift2,
          gift2File{
            asset->{
              url
            }
          },
          cost,
          packagingCost,
          shippingCost,
          description,
          cargoLabel,
          price,
          createdBy-> {_id, username, email, store}
      }`,
  );
  // .then((res) => {
  //   console.log('Hurray, all orders fetched!');
  //   console.log({
  //     product: res.product,
  //     productFile: res.productFile,
  //     productSize: res.productSize,
  //     productMainType: res.productMainType,
  //     productSubType: res.productSubType,
  //     productCargoType: res.productCargoType,
  //     gift1: res.gift1,
  //     gift1File: res.gift1File,
  //     gift2: res.gift2,
  //     gift2File: res.gift2File,
  //     cost: res.cost,
  //     packagingCost: res.packagingCost,
  //     shippingCost: res.shippingCost,
  //     description: res.description,
  //     cargoLabel: res.cargoLabel,
  //     price: res.price,
  //     createdBy: res.createdBy,
  //   });
  // })
  // .catch((err) => {
  //   console.error('Oh no, the fetched failed: ', err.message);
  // });
}

export async function deleteOrder(id) {
  return client
    .delete(id)
    .then((res) => {
      console.log('Hurray, the order is deleted!');
      console.log(res);
    })
    .catch((err) => {
      console.error('Oh no, the delete failed: ', err.message);
    });
}

export async function updateProductsAndGifts(id, data) {
  return client
    .patch(id)
    .set({
      ...data,
      products: data.products?.map((product, index) => ({
        _key: `product-${index}`,
        productName: product.productName,
        productFile: product.productFile,
        productWidth: product.productWidth,
        productHeight: product.productHeight,
        productPiece: product.productPiece,
        productMainType: product.productMainType?.value,
        productSubType: product.productSubType?.value,
        productCargoType: product.productCargoType?.value,
      })),
      gifts: data.gifts?.map((gift, index) => ({
        _key: `gift-${index}`,
        giftName: gift.giftName,
        giftFile: gift.giftFile,
        giftWidth: gift.giftWidth,
        giftPiece: gift.giftPiece,
        giftHeight: gift.giftHeight,
        giftMainType: gift.giftMainType?.value,
        giftSubType: gift.giftSubType?.value,
        giftCargoType: gift.giftCargoType?.value,
      })),
      //cargoLabel: data.cargoLabel,
    })
    .commit()
    .then((res) => {
      console.log('Hurray, the order is updated! New document:');
      console.log(res);
    })
    .catch((err) => {
      console.error('Oh no, the update failed: ', err.message);
    });
}

export async function updateOrder(id, data) {
  return client
    .patch(id)
    .set(data)
    .commit()
    .then((res) => {
      console.log('Hurray, the order is updated! New document:');
      console.log(res);
    })
    .catch((err) => {
      console.error('Oh no, the update failed: ', err.message);
    });
}

export async function createNotifications(id, data) {
  return client
    .patch(id)
    .set({
      notifications: data?.map((notification, index) => ({
        _key: `notification-${index}`,
        notificationId: uuidv4(),
        createdAt: notification.createdAt,
        flag: notification.flag,
        context: notification.context,
        note: notification.note,
        noteToAdmin: notification.noteToAdmin?.map((admin, index) => ({
          _key: `admin-${index}`,
          ...admin,
        })),
        answers: notification.answers?.map((answer, index) => ({
          _key: `answer-${index}`,
          ...answer,
        })),
      })),
    })
    .commit()
    .then((res) => {
      console.log('Hurray, the notification is created! New document:');
      console.log(res);
    })
    .catch((err) => {
      console.error('Oh no, the create failed: ', err.message);
    });
}

export async function updateNotifications(id, data) {
  return client
    .patch(id)
    .set({
      notifications: data?.map((notification, notificationIndex) => ({
        _key: `notification-${notificationIndex}`,
        notificationId: notification.notificationId,
        createdAt: notification.createdAt,
        flag: notification.flag,
        context: notification.context,
        note: notification.note,
        noteToAdmin: notification.noteToAdmin?.map((admin, adminIndex) => ({
          _key: `admin-${adminIndex}`,
          ...admin,
        })),
        answers: notification.answers?.map((answer, answerIndex) => ({
          _key: `answer-${answerIndex}`,
          ...answer,
        })),
      })),
    })
    .commit()
    .then((res) => {
      console.log('Hurray, the notification is updated! New document:');
      console.log(res);
    })
    .catch((err) => {
      console.error('Oh no, the update failed: ', err.message);
    });
}

// export async function uploadImage(id, imageData, imageField) {
//   return client.assets
//     .upload('image', createReadStream(imageData), { filename: basename(imageData) })
//     .then((res) => {
//       if (id !== undefined) {
//         return client
//           .patch(id)
//           .set({
//             imageField: {
//               _type: 'image',
//               asset: {
//                 _type: 'reference',
//                 _ref: res._id,
//               },
//             },
//           })
//           .commit();
//       } else {
//         return client.set({ imageField }).commit();
//       }
//     })
//     .then(() => {
//       console.log(`Uploaded '${imageField}'`);
//     })
//     .catch((err) => {
//       console.error('Oh no, the upload failed: ', err.message);
//     });
// }

export const getOrdersByUser = async (userr) => {
  const ordersByUser =
    userr?.role === 'user'
      ? await client.fetch(`*[_type == "order" && createdBy._ref == '${userr?._id}'] | order(_createdAt desc){          
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
        createdBy-> {_id, username, email, store}
      }`)
      : userr?.role === 'superAdmin' || userr?.role === 'admin'
      ? await client.fetch(`*[_type == "order"] | order(_createdAt desc){         
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
        createdBy-> {_id, username, email, store}
      }`)
      : [];

  return ordersByUser;
};

export const findOrder = async (orderId) => {
  const orderById =
    await client.fetch(`*[_type == "order" &amp;&amp; _id == '${orderId}'] | order(_createdAt desc){          
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
      }`);
  return orderById;
};

export async function RolesBasedArrayInput(props) {
  const { schemaType, renderDefault } = props;
  const includedUsers = await client.fetch(
    `*[_type == 'user' && (role == "admin" || role == "superAdmin")]`,
  );
  console.log('includedUsers', includedUsers);
  console.log('schemaType', schemaType);
  return renderDefault({ ...props, schemaType: { ...schemaType, of: includedUsers } });
}

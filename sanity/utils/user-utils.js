import { groq } from 'next-sanity';
import { client } from '../utils/client';

export async function getUsers() {
  return client.fetch(
    groq`*[_type == "user"]{
        _id,
        _createdAt,
        email,
        password,
        username,
        store,
        requestForAdmin,
        role,
        profileImage,
        url
    }`,
  );
}

export function findUser(id) {
  // const query = `*[_type == "user" && _id == ${id}]`;
  // return client.fetch(query);
  //&& _id == ${id}
  const result = client.fetch(
    groq`*[_type == "user" && _id == '${id}']{
        _id,
        _createdAt,
        email,
        password,
        username,
        store,
        requestForAdmin,
        role,
        profileImage,
        url
    }`,
  );
  return result;
  // .then((res) => console.log(res));
}

export async function getUser2(id) {
  return client.fetch(id);
}

export async function getOrdersByUser(user) {
  // if (!id) {
  //   console.log('Kullaniciya ait id bulunamadi');
  // }

  //const user = await getUser(id); //.then((res) => res);
  const allQuery = groq`*[ _type == "order"]{
    _id,
    _createdAt,
    products[] {
      productFile,
      productName,
      productWidth,
      productHeight,
      productMainType,
      productSubType,
      productCargoType,
    },
    gifts[] {
      giftFile,
      giftName,
      giftWidth,
      giftHeight,
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
}`;

  if (user.role === 'user') {
    // const ordersQueryByUser = `*[_type == "order"]{createdBy: {user._id: ${id}}}`;
    const ordersQueryByUser = `*[_type == "order" && createdBy._ref == '${user.id}']`;

    const t = await client.fetch(ordersQueryByUser);

    return t;
  }

  if (user.role === 'superadmin' || user.role === 'admin') {
    const ordersQueryByAdmin = `*[_type == "order"]`;

    const r = await client.fetch(allQuery);

    return r;
  }
}

export async function createUser(req, res) {
  const { email, password, username, store, requestForAdmin, role } = JSON.parse(req.body);

  try {
    await client.create({
      _type: 'user',
      email,
      password,
      username,
      store,
      requestForAdmin,
      role,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: `Kullanici olusturulamadi`, error });
  }

  return res.status(200).json({ message: `${username} basarili bir sekilde olusturuldu.` });
}

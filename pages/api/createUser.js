// Next.js API route support: https://nextjs.org/docs/api/routes/introduction
import { client } from '../../sanity/utils/client';

export default async function createUser(req, res) {
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
    return res.status(500).json({ message: `Kullanici olusturulamadi`, error });
  }

  return res.status(200).json({ message: `${username} basarili bir sekilde olusturuldu.` });
}

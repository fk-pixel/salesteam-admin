// Next.js API route support: https://nextjs.org/docs/api/routes/introduction
import { client } from '../../sanity/utils/client';

export default async function deleteOrder(req, res) {
  const { _id } = JSON.parse(req.body);

  try {
    await client.delete({
      _type: 'order',
      _id,
    });
  } catch (error) {
    return res.status(500).json({ message: `Siparis silinemedi`, error });
  }

  return res.status(200).json({ message: `${product} basarili bir sekilde silindi.` });
}

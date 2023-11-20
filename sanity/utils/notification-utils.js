import { client } from './client';

export const fetchAdmins = async () => {
  const admins = await client.fetch(`*[_type == "user" && role == 'admin' || role == 'superAdmin']{
    _id,
    email,
    username,
    store,
    }`);

  return admins;
};

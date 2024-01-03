const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'password', title: 'Password', type: 'string' },
    { name: 'username', title: 'User Name', type: 'string' },
    { name: 'store', title: 'Store', type: 'string' },
    { name: 'requestForAdmin', title: 'Request For Admin', type: 'boolean' },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { value: 'user', title: 'Kullanici' },
          { value: 'admin', title: 'Admin' },
          { value: 'superAdmin', title: 'Süper Admin' },
        ],
      },
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'url',
      title: 'Url',
      type: 'url',
    },
  ],
};

export default user;

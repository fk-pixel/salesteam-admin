const notification = {
  name: 'notification',
  title: 'Notification',
  type: 'object',
  fields: [
    { name: 'context', title: 'Context', type: 'string' },
    { name: 'note', title: 'Note', type: 'string' },
    {
      name: 'noteToAdmin',
      title: 'Note To Admin',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {
            type: 'user',
          },
          options: {
            filter: 'role == "admin" || role == "superAdmin"',
          },
        },
      ],
    },
    {
      name: 'flag',
      title: 'Flag',
      type: 'string',
      options: {
        list: [
          { value: 'red', title: 'Kritik' },
          { value: 'yellow', title: 'Uyari' },
          { value: 'blue', title: 'Bilgilendirme' },
          { value: 'green', title: 'Basarili' },
        ],
      },
    },
  ],
};

export default notification;

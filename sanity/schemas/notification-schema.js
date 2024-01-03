const notification = {
  name: 'notification',
  title: 'Notification',
  type: 'object',
  fields: [
    { name: 'notificationId', title: 'Notification-Id', type: 'string' },
    { name: 'createdAt', title: 'CreatedAt', type: 'string' },
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
          { value: 'danger', title: 'Kritik' },
          { value: 'warning', title: 'Uyari' },
          { value: 'info', title: 'Bilgilendirme' },
          { value: 'success', title: 'Basarili' },
        ],
      },
    },
    {
      name: 'answers',
      title: 'Answers',
      type: 'array',
      of: [
        {
          type: 'answer',
        },
      ],
    },
  ],
};

export default notification;

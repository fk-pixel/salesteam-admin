const answer = {
  name: 'answer',
  title: 'Answer',
  type: 'object',
  fields: [
    { name: 'answerId', title: 'Answer-Id', type: 'string' },
    { name: 'notificationId', title: 'Notification-Id', type: 'string' },
    { name: 'createdAt', title: 'CreatedAt', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'string' },
    {
      name: 'answeredBy',
      title: 'Answered By',
      type: 'reference',
      to: [
        {
          type: 'user',
        },
      ],
      options: {
        filter: 'role == "admin" || role == "superAdmin"',
      },
    },
  ],
};

export default answer;

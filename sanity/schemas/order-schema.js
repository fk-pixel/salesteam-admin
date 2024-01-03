const order = {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    { name: 'products', title: 'Products', type: 'array', of: [{ type: 'product' }] },
    { name: 'gifts', title: 'Gifts', type: 'array', of: [{ type: 'gift' }] },
    { name: 'cost', title: 'Cost', type: 'number' },
    { name: 'packagingCost', title: 'Packaging Cost', type: 'number' },
    { name: 'shippingCost', title: 'Shipping Cost', type: 'number' },
    { name: 'description', title: 'Description', type: 'string' },
    { name: 'cargoLabel', title: 'Cargo Label', type: 'image', options: { hotspot: true } },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'canceledAfterProduction', title: '🔴 Üretimden sonra iptal edildi' },
          { value: 'canceledBeforeProduction', title: '🟠 Üretimden önce iptal edildi' },
          { value: 'sentToProduction', title: '🟡 Üretime gönderildi' },
          { value: 'shipped', title: '🟢 Kargolandi' },
        ],
      },
    },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'createdBy', title: 'Created By', type: 'reference', to: [{ type: 'user' }] },
    {
      name: 'notifications',
      title: 'Notifications',
      type: 'array',
      of: [{ type: 'notification' }],
    },
  ],
};

export default order;

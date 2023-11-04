const order = {
  name: 'order',
  title: 'Orders',
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

  // { name: 'productNumber', title: 'Product Number', type: 'number' },
  // { name: 'giftNumber', title: 'Gift Number', type: 'number' },
  // fields: [
  //   { name: 'product', title: 'Product', type: 'string' },
  //   { name: 'productFile', title: 'Product File', type: 'image', options: { hotspot: true } },

  //   { name: 'productSize', title: 'Product Size', type: 'string' },
  //   { name: 'productMainType', title: 'Product Main Type', type: 'string' },
  //   { name: 'productSubType', title: 'Product Sub Type', type: 'string' },
  //   { name: 'productCargoType', title: 'Product Cargo Type', type: 'string' },

  //   { name: 'gift1', title: 'Gift1', type: 'string' },
  //   { name: 'gift1File', title: 'Gift1 File', type: 'image', options: { hotspot: true } },

  //   { name: 'gift2', title: 'Gift2', type: 'string' },
  //   { name: 'gift2File', title: 'Gift2 File', type: 'image', options: { hotspot: true } },

  //   { name: 'cost', title: 'Cost', type: 'number' },
  //   { name: 'packagingCost', title: 'Packaging Cost', type: 'number' },
  //   { name: 'shippingCost', title: 'Shipping Cost', type: 'number' },
  //   { name: 'description', title: 'Description', type: 'string' },
  //   { name: 'cargoLabel', title: 'Cargo Label', type: 'image', options: { hotspot: true } },
  //   { name: 'price', title: 'Price', type: 'number' },
  //   { name: 'createdBy', title: 'Created By', type: 'reference', to: { type: 'user' } },
  // ],
};

export default order;

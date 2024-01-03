const product = {
  name: 'product',
  title: 'Product',
  type: 'object',
  fields: [
    { name: 'productName', title: 'Product Name', type: 'string' },
    { name: 'productFile', title: 'Product File', type: 'image', options: { hotspot: true } },
    { name: 'productWidth', title: 'Product Width', type: 'number' },
    { name: 'productHeight', title: 'Product Height', type: 'number' },
    { name: 'productPiece', title: 'Product Piece', type: 'number' },
    {
      name: 'productMainType',
      title: 'Product Main Type',
      type: 'string',
      options: {
        list: [
          { value: 'panel', title: 'Panel' },
          { value: 'roll', title: 'Rulo' },
          { value: 'glas', title: 'Cam' },
        ],
      },
    },
    {
      name: 'productSubType',
      title: 'Product Sub Type',
      type: 'string',
      options: {
        list: [
          { value: 'thinHoop', title: 'Ince Kasnak' },
          { value: 'normalHoop', title: 'Normal Kasnak' },
          { value: 'normalRoll', title: 'Normal Rulo' },
          { value: 'NonReflectiveRoll', title: 'Yansimasiz Rulo' },
          { value: 'coatedPaper', title: 'Kuse Kagit' },
        ],
      },
    },
    {
      name: 'productCargoType',
      title: 'Product Cargo Type',
      type: 'string',
      options: {
        list: [
          { value: 'singlePanel', title: 'Tek Panel' },
          { value: 'twoPanels', title: 'İki Panel' },
          { value: 'threePanels', title: 'Üç Panel' },
          { value: 'threeBalancedPanels', title: 'Üç Dengeli Panel' },
          { value: 'fourPanels', title: 'Dört Panel' },
          { value: 'fivePanels', title: 'Beş Panel' },
          { value: 'fiveBalancedPanels', title: 'Beş Dengeli Panel' },
        ],
      },
    },
    { name: 'orderedBy', title: 'Ordered By', type: 'reference', to: { type: 'order' } },
  ],
};

export default product;

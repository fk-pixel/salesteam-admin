const gift = {
  name: 'gift',
  title: 'Gifts',
  type: 'object',
  fields: [
    { name: 'giftName', title: 'Gift Name', type: 'string' },
    { name: 'giftFile', title: 'Gift File', type: 'image', options: { hotspot: true } },
    { name: 'giftWidth', title: 'Gift Width', type: 'number' },
    { name: 'giftHeight', title: 'Gift Height', type: 'number' },
    { name: 'giftPiece', title: 'Gift Piece', type: 'number' },
    {
      name: 'giftMainType',
      title: 'Gift Main Type',
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
      name: 'giftSubType',
      title: 'Gift Sub Type',
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
      name: 'giftCargoType',
      title: 'Gift Cargo Type',
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

export default gift;

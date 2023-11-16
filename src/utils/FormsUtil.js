import { client } from '../../sanity/utils/client';

export const MAINTYPE_OPTIONS = [
  { value: 'panel', title: 'Panel' },
  { value: 'roll', title: 'Rulo' },
  { value: 'glas', title: 'Cam' },
];

export const PANELTYPE_OPTIONS = [
  { value: 'thinHoop', title: 'Ince Kasnak' },
  { value: 'normalHoop', title: 'Normal Kasnak' },
];

export const ROLLTYPE_OPTIONS = [
  { value: 'normalRoll', title: 'Normal Rulo' },
  { value: 'NonReflectiveRoll', title: 'Yansimasiz Rulo' },
  { value: 'coatedPaper', title: 'Kuse Kagit' },
];

export const SHIPPING_OPTIONS = [
  { value: 'singlePanel', title: 'Tek Panel' },
  { value: 'twoPanels', title: 'İki Panel' },
  { value: 'threePanels', title: 'Üç Panel' },
  { value: 'threeBalancedPanels', title: 'Üç Dengeli Panel' },
  { value: 'fourPanels', title: 'Dört Panel' },
  { value: 'fivePanels', title: 'Beş Panel' },
  { value: 'fiveBalancedPanels', title: 'Beş Dengeli Panel' },
];

export const STATUS_OPTIONS = [
  { value: 'canceledAfterProduction', title: '🔴 Üretimden sonra iptal edildi' },
  { value: 'canceledBeforeProduction', title: '🟠 Üretimden önce iptal edildi' },
  { value: 'sentToProduction', title: '🟡 Üretime gönderildi' },
  { value: 'shipped', title: '🟢 Kargolandi' },
];

export const AUTOCONTEXT_OPTIONS = [
  { value: 'ex1', title: 'Örnek 1' },
  { value: 'ex2', title: 'Örnek 2' },
  { value: 'ex3', title: 'Örnek 3' },
  { value: 'ex4', title: 'Örnek 4' },
];

export const registerToAssets = async (values) => {
  const imagesOfProducts = [];
  const imagesOfGifts = [];
  const imageOfCargoLabel = {};

  // if (values.products.length > 0) {
  values.products?.map(async (product) => {
    if (product.productFile.asset === undefined) {
      await client.assets
        .upload('image', product.productFile, {
          contentType: product.productFile?.type,
          fileName: product.productFile?.name,
          //   title: product._id, //hangi ürün ait oldugunun daha iyi anlayabimek gerekirse ne olur olmaz diye verildi
        })
        .then((res) => {
          imagesOfProducts.push(res);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    }
  });
  // }

  // if (values.gifts.length > 0) {
  values.gifts?.map(async (gift) => {
    // if (gift.giftFile?.asset === undefined) {
    await client.assets
      .upload('image', gift.giftFile, {
        contentType: gift.giftFile?.type,
        fileName: gift.giftFile?.name,
        //   title: gift._id, //hangi ürün ait oldugunun daha iyi anlayabimek gerekirse ne olur olmaz diye verildi
      })
      .then((res) => {
        imagesOfGifts.push(res);
      })
      .catch((error) => {
        console.log('Upload failed:', error.message);
      });
    // }
  });
  // }

  // if (values.cargoLabel !== null) {
  await client.assets
    .upload('image', values.cargoLabel, {
      contentType: values.cargoLabel?.type,
      fileName: values.cargoLabel?.name,
    })
    .then((res) => {
      // console.log('cargoLabel', document);
      imageOfCargoLabel = res;
      // console.log('imageOfCargoLabel', imageOfCargoLabel);
      // setFieldValue('values.cargoLabel', document);
    })
    .catch((error) => {
      console.log('Upload failed:', error.message);
    });
  // }

  return { imagesOfProducts, imageOfCargoLabel, imagesOfGifts };
};

export const imageRegisterToAssets = async (file) => {
  const imageFile = {};

  await client.assets
    .upload('image', file, {
      contentType: file?.type,
      fileName: file?.name,
    })
    .then((res) => {
      imageFile = res;
    })
    .catch((error) => {
      console.log('Upload failed:', error.message);
    });

  return imageFile;
};

export const productRegisterToAssets = async (product) => {
  const productAsset = {};

  // if (product.productFile?.asset === undefined) {
  await client.assets
    .upload('image', product.productFile, {
      contentType:
        product.productFile.serviceId === 'docs'
          ? product.productFile?.mimeType
          : product.productFile?.type,
      fileName: product.productFile?.name,
    })
    .then((res) => {
      productAsset = res;
    })
    .catch((error) => {
      console.log('Upload failed:', error.message);
    });
  // }
  return productAsset;
};

export const giftRegisterToAssets = async (gift) => {
  const giftAsset = {};

  await client.assets
    .upload('image', gift.giftFile, {
      contentType: gift.giftFile?.type,
      fileName: gift.giftFile?.name,
    })
    .then((res) => {
      giftAsset = res;
    })
    .catch((error) => {
      console.log('Upload failed:', error.message);
    });

  return giftAsset;
};

export const makeSizeFormat = (width, height) => {
  return `${width ?? ' '}*${height ?? ' '}`;
};

export function selectSubOptions(mainOption) {
  switch (mainOption) {
    case 'Panel':
      return PANELTYPE_OPTIONS;

    case 'Rulo':
      return ROLLTYPE_OPTIONS;

    default:
      return [{ value: '', title: '' }];
  }
}

export function selectShippingOptions(mainOption) {
  switch (mainOption) {
    case 'Panel':
      return SHIPPING_OPTIONS;

    default:
      return [{ value: '', title: '' }];
  }
}

export function getCostExample(size) {
  const splittedData = size.split('x') ?? '';

  const br = 1.87;

  const calculateCost = splittedData[0] * splittedData[1] * br;

  return calculateCost;
}

export function getShortcut() {
  const traderName = 'randomTraderName()';
  const firstLetter = traderName?.split(' ')[0][0];
  const secondLetter = traderName?.split(' ')[1][0];
  const shortcut = firstLetter + secondLetter;

  return { traderName, shortcut };
}

export function findStatusOption(value) {
  const selectedOption = STATUS_OPTIONS.find((x) => x.value === value);

  return selectedOption;
}

export const getDirtyValues = (values, initialObject) => {
  const data = { ...values };
  const keyValues = Object.keys(data);

  const dirtyValues = keyValues.filter((keyValue) => data[keyValue] !== initialObject[keyValue]);

  keyValues.forEach((key) => {
    if (!dirtyValues.includes(key)) delete data[key];
  });

  return data;
};

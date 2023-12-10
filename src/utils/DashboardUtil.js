import {
  MAINTYPE_OPTIONS,
  PANELTYPE_OPTIONS,
  ROLLTYPE_OPTIONS,
  SHIPPING_OPTIONS,
  STATUS_OPTIONS,
} from './FormsUtil';

export const getConvertedData = (data) => {
  const newData = data?.flatMap((x) => ({
    ...x,
    products: x.products?.map((y) => ({
      ...y,
      productSize: y.productWidth + '*' + y.productHeight,
      productMainType: MAINTYPE_OPTIONS.find((o) => o.value === y.productMainType),
      productSubType: PANELTYPE_OPTIONS.concat(ROLLTYPE_OPTIONS).find(
        (o) => o.value === y.productSubType,
      ),
      productCargoType: SHIPPING_OPTIONS.find((o) => o.value === y.productCargoType),
    })),
    gifts: x.gifts?.map((y) => ({
      ...y,
      giftSize: y.giftWidth + '*' + y.giftHeight,
      giftMainType: MAINTYPE_OPTIONS.find((o) => o.value === y.giftMainType),
      giftSubType: PANELTYPE_OPTIONS.concat(ROLLTYPE_OPTIONS).find(
        (o) => o.value === y.giftSubType,
      ),
      giftCargoType: SHIPPING_OPTIONS.find((o) => o.value === y.giftCargoType),
    })),
    status: STATUS_OPTIONS.find((o) => o.value === x.status)?.title,
  }));

  return newData;
};

export function getDataWithAvatar(data) {
  if (data !== undefined && data !== null) {
    const newData = [];

    for (const i of data) {
      const firstLetter = i.createdBy?.username?.split(' ')[0][0];

      const secondLetter =
        i.createdBy?.username?.split(' ')[1] !== undefined
          ? i.createdBy?.username?.split(' ')[1][0]
          : '';

      const shortcut = firstLetter + secondLetter;

      newData.push({ ...i, avatar: shortcut, store: i.createdBy?.store, isEditMode: false });
    }
    return newData;
  }

  return;
}

export function getAdminNameWithAvatar(data) {
  const firstLetter = data?.split(' ')[0][0];
  const secondLetter = data?.split(' ')[1] !== undefined ? data.split(' ')[1][0] : '';

  return firstLetter + secondLetter;
}

export function getSeperator(i, length) {
  const lastItem = length - 1;
  return i !== lastItem ? ' | ' : undefined;
}

export function makeOptionFromSanity(data) {
  const options = data?.map((x) => ({
    value: x._id,
    title: `${x.username}-${x.email} (${x.store})`,
  }));

  return options;
}

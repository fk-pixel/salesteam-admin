import _ from 'lodash';
import * as XLSX from 'xlsx-js-style';

import { format } from 'date-fns';

export function createDownloadExcel(data, keysColumnName, sheetName, fileName, interval) {
  if (!data) {
    throw new Error('No data to download');
  }

  const excelFileName = `${fileName}.xlsx`;

  const filteredDataByDate = data.filter(
    (x) => new Date(x._createdAt) >= interval[0] && new Date(x._createdAt) <= interval[1],
  );

  const fullfilledData = filteredDataByDate.flatMap((x) => {
    const a = [];
    if (x.products.length > 0) {
      x.products.map((p) => {
        a.push({
          ...x,
          order_id: x._id,
          name: p.productName,
          size: p.productSize,
          mainType: p.productMainType?.title,
          subType: p.productSubType?.title,
          cargoType: p.productCargoType?.title,
        });
      });
    }

    if (x.gifts?.length > 0) {
      x.gifts.map((g) => {
        a.push({
          ...x,
          order_id: x._id,
          name: '(H) ' + g.giftName,
          size: g.giftSize,
          mainType: g.giftMainType?.title,
          subType: g.giftSubType?.title,
          cargoType: g.giftCargoType?.title,
        });
      });
    }
    return a;
  });

  const sortedData = fullfilledData.sort((a, b) => a.order_id - b.order_id);

  const months = [
    'Ocak',
    'Subat',
    'Mart',
    'Nisan',
    'Mayis',
    'Haziran',
    'Temmuz',
    'Agustos',
    'Eylül',
    'Ekim',
    'Kasim',
    'Aralik',
  ];

  const rows = sortedData.map((x) => ({
    order_id: x.order_id,
    store: x.createdBy?.store,
    name: x.name,
    size: x.size,
    mainType: x.mainType,
    subType: x.subType,
    cargoType: x.cargoType,
    cost: x.cost,
    packagingCost: x.packagingCost,
    shippingCost: x.shippingCost,
    price: x.price,
    date: format(new Date(x._createdAt), 'dd-MM-yyyy'),
    month: months[new Date(x._createdAt).getMonth()],
  }));

  const wsheet = XLSX.utils.json_to_sheet(rows, { origin: { r: 2, c: 0 } });
  const wbook = XLSX.utils.book_new();

  XLSX.utils.sheet_add_aoa(
    wsheet,
    [['Olusturuldugu tarih: ' + format(new Date() /* .toISOString() */, 'dd-MM-yyyy HH:mm:ss')]],
    {
      origin: { r: 0, c: 0 },
    },
  );

  XLSX.utils.sheet_add_aoa(wsheet, [keysColumnName], { origin: { r: 2, c: 0 } });

  XLSX.utils.book_append_sheet(wbook, wsheet, sheetName);

  XLSX.writeFile(wbook, excelFileName);
}

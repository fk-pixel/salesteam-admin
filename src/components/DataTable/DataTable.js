import { faFileEdit, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Print } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Image from 'next/image';
import * as React from 'react';
import { useReactToPrint } from 'react-to-print';

import { urlFor } from '../../../sanity/utils/client';
import noImage from '../../assets/images/users/noimage.png';
import { getConvertedData, getDataWithAvatar } from '../../utils/DashboardUtil.js';
import { STATUS_OPTIONS } from '../../utils/FormsUtil.js';
import AutocompleteEditCell from '../Autocomplete/AutocompleteEditCell.js';
import XLSXDialog from '../Dialogs/XLSXDialog.js';
import { EditItemsDrawer } from '../Drawers/EditItemsDrawer.js';
import { DeleteAction, MailAction, SaveAction, SupportAction } from './DataTableActions.js';
import { Icon } from '../Icon/Icon.js';

const classes = {
  tableButton: {
    '&:hover': {
      color: '#1769aa',
    },
  },
  cellImage: {
    position: 'relative',
    width: '2.25rem',
    height: '2.25rem',
    minWidth: '2.255rem',
    borderRadius: '0.0625rem',
    display: '-webkit-box',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionButton: {
    maxHeight: 32,
    minHeight: 32,
    color: 'grey',
    backgroundColor: 'lightgrey', //'#383c44',
    '&:hover': {
      backgroundColor: 'lightgrey', //'#383c44',
      color: '#1976d2',
    },
  },
};

export default function DataTable(props) {
  const largeScreen = useMediaQuery('(min-width:1900px)');
  const xlargeScreen = useMediaQuery('(min-width:2100px)');

  const { data, userData, dataLoading } = props;

  const newData = getDataWithAvatar(data);

  const isAdmin = userData?.role === 'admin' || userData?.role === 'superAdmin';

  const convertedData = getConvertedData(newData);

  let componentRef = React.useRef();

  const [selectedRowID, setSelectedRowID] = React.useState();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openXLSX, setOpenXLSX] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  const handleOpenXLSXDialog = () => {
    setOpenXLSX(true);
  };

  const handleClose = () => {
    setOpenXLSX(false);
    setOpenDrawer(false);
  };

  const columns = React.useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Sira',
        width: 40,
        editable: false,
        renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row._id) + 1,
      },
      {
        field: 'avatar',
        headerName: 'Kullanici',
        width: 60,
        renderCell: (params) => {
          return (
            <Tooltip title={`Kaydi Olusturan: ${params.row.createdBy?.username}`}>
              <Avatar key={'avatar'} sx={{ bgcolor: 'warning.main' }} alt="">
                {params.value}
              </Avatar>
            </Tooltip>
          );
        },
      },
      {
        field: 'store',
        headerName: 'Magaza',
        width: largeScreen ? 90 : 70,
        editable: false,
      },
      {
        field: 'products',
        headerName: 'Ürünler',
        width: xlargeScreen ? 275 : largeScreen ? 250 : 200,
        editable: false,
        renderCell: (params) => (
          <Tooltip
            title={` Toplam(${params.row.products?.length}):  ${params.row.products?.map((x, i) => {
              return ` Ürün${i + 1}(${x.productName}-${x.productSize}(${
                x.productPiece ?? 0
              } adet)-${x.productMainType?.title}) ${
                i !== params.row.products.length - 1 ? '  ' : ''
              }`;
            })} `}
            componentsProps={{
              tooltip: {
                sx: {
                  color: 'Highlight',
                  backgroundColor: 'lightgoldenrodyellow',
                  fontSize: '1em',
                },
              },
            }}
          >
            <ul className="flex">
              {params.row.products?.map((x, index) => (
                <li key={index}>
                  Ü{index + 1}: {x.productName} / {x.productSize}({x.productPiece ?? 0} adet) /{' '}
                  {x.productMainType?.title}
                </li>
              ))}
            </ul>
          </Tooltip>
        ),
      },
      {
        field: 'gifts',
        headerName: 'Hediyeler',
        width: xlargeScreen ? 275 : largeScreen ? 250 : 200,
        editable: false,
        renderCell: (params) => (
          <Tooltip
            title={` Toplam(${params.row.gifts?.length}):  ${params.row.gifts?.map((x, i) => {
              return ` Hediye${i + 1}(${x.giftName}-${x.giftSize}(${x.giftPiece ?? 0} adet)-${
                x.giftMainType?.title
              }) ${i !== params.row.gifts.length - 1 ? '  ' : ''}`;
            })} `}
            componentsProps={{
              tooltip: {
                sx: {
                  color: 'Highlight',
                  backgroundColor: 'lightgoldenrodyellow',
                  fontSize: '1em',
                },
              },
            }}
          >
            <ul className="flex">
              {params.row.gifts?.map((x, index) => (
                <li key={index}>
                  H{index + 1}: {x.giftName} / {x.giftSize}({x.giftPiece ?? 0} adet) /{' '}
                  {x.giftMainType?.title}
                </li>
              ))}
            </ul>
          </Tooltip>
        ),
      },
      {
        field: 'cargoLabel',
        headerName: 'Kargo Etiketi',
        type: 'actions',
        width: 80,
        editable: false,
        align: 'center',
        renderCell: (params) => {
          return (
            <>
              {params.row.cargoLabel !== null || params.row.cargoLabel?.asset._ref !== undefined ? (
                <Box sx={classes.cellImage}>
                  <Image src={urlFor(params.row.cargoLabel)?.url()} layout="fill" />
                </Box>
              ) : (
                <span style={{ width: 36, color: 'grey' }}>
                  <Icon name={'noPhoto2'} />
                </span>
              )}
            </>
          );
        },
      },
      {
        field: 'cost',
        headerName: 'Maliyet',
        width: xlargeScreen ? 90 : 70,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'packagingCost',
        headerName: 'Paket Maliyeti',
        width: xlargeScreen ? 90 : 70,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'shippingCost',
        headerName: 'Kargo Maliyeti',
        width: xlargeScreen ? 90 : 70,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'price',
        headerName: 'Satis Tutari',
        type: 'number',
        width: xlargeScreen ? 90 : 70,
        editable: isAdmin,
      },
      {
        field: 'description',
        headerName: 'Aciklama',
        width: largeScreen ? 200 : 150,
        editable: isAdmin,
      },
      {
        field: 'status',
        headerName: 'Statü',
        width: xlargeScreen ? 220 : largeScreen ? 200 : 150,
        editable: isAdmin,
        renderEditCell: (params) => {
          return (
            <AutocompleteEditCell
              {...params}
              key={'status'}
              value={params.row.status}
              options={STATUS_OPTIONS}
              getOptionLabel={(o) => o.title || ''}
              freeSolo={true}
              autoHighlight={false}
              multiple={false}
              disableClearable={true}
            />
          );
        },
      },
      {
        field: '_createdAt',
        headerName: 'Kayit Tarihi',
        type: 'dateTime',
        valueGetter: ({ value }) => new Date(value),
        editable: false,
      },
      {
        field: 'actions',
        type: 'actions',
        width: 130,
        getActions: (params) => [
          <>{isAdmin && <MailAction {...{ params, convertedData }} />}</>,
          <>{!isAdmin && <SupportAction {...{ params, convertedData, isAdmin }} />}</>,
          <>{isAdmin && <SaveAction {...{ params, selectedRowID, convertedData }} />}</>,
          <>{isAdmin && <DeleteAction {...{ params }} />}</>,
        ],
      },
    ],
    [largeScreen, isAdmin, xlargeScreen, convertedData, selectedRowID],
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, //.current,
    documentTitle: 'new document',
    // pageStyle: 'print',
  });

  const printableOrder = convertedData?.filter((x) => rowSelectionModel?.includes(x._id));

  return (
    <div style={{ height: 850, width: '100%' }}>
      <Box height={820}>
        {isAdmin ? (
          <Stack sx={{ marginTop: -1, marginBottom: 1 }} direction={'row'} spacing={0}>
            <Tooltip title={'Tablodan Excel olustur'}>
              <span>
                <Button
                  key={'mainActions[0]'}
                  size="large"
                  sx={{
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    ...classes.mainActionButton,
                  }}
                  onClick={() => handleOpenXLSXDialog()}
                >
                  <FontAwesomeIcon icon={faFileExcel} size="lg" style={{ maxWidth: 15 }} />
                </Button>
              </span>
            </Tooltip>
            <XLSXDialog data={convertedData} openXLSX={openXLSX} handleClose={handleClose} />

            <Box>
              <Box
                display={'flex'}
                sx={{
                  display: 'none',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  '@media print': {
                    display: 'flex',
                  },
                }}
                ref={componentRef}
              >
                {printableOrder.map((x) => (
                  <div key={'print-section'} style={{ margin: '12px 60px 12px 60px' }}>
                    <Box display={'block'}>
                      <Image
                        src={x.cargoLabel?.asset?._ref ? urlFor(x.cargoLabel)?.url() : noImage}
                        width="225"
                        height="250"
                      />
                      <div style={{ width: 225, backgroundColor: 'InactiveCaption' }}>
                        <Divider sx={{ marginBottom: 1, maxHeight: 6 }} />
                        <Typography sx={{ fontSize: 6 }}>
                          <strong>Siparis İçeriği: </strong>
                          {x.products.map(
                            (y, i) => {
                              if (i < 3) {
                                return (
                                  y.productName +
                                  ' ' +
                                  y.productSize +
                                  ' ' +
                                  y.productMainType?.title +
                                  ' | '
                                );
                              }
                            },
                            //   ||
                            // ((i !== x.products.length - 1) !== 1 ? ' & ' : ''),
                          )}
                        </Typography>
                        <Divider style={{ marginBottom: 6 }} />
                      </div>
                    </Box>
                  </div>
                ))}
              </Box>
              <Tooltip title={'Kargo etiketlerini yazdir'}>
                <span>
                  <Button
                    key={'mainActions[1]'}
                    disabled={rowSelectionModel.length < 1}
                    sx={{
                      borderRadius: 0,
                      borderRight: '0.5px solid white',
                      borderLeft: '0.5px solid white',
                      ...classes.mainActionButton,
                    }}
                  >
                    <Print onClick={handlePrint} fontSize="small" />
                  </Button>
                </span>
              </Tooltip>
            </Box>

            <Tooltip title={'Satilan ürünleri düzenle'}>
              <span>
                <Button
                  key={'mainActions[2]'}
                  size="large"
                  disabled={rowSelectionModel.length !== 1}
                  onClick={() => setOpenDrawer(true)}
                  sx={{
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    ...classes.mainActionButton,
                  }}
                >
                  <FontAwesomeIcon icon={faFileEdit} style={{ maxWidth: 18 }} />
                </Button>
              </span>
            </Tooltip>
            <EditItemsDrawer {...{ convertedData, rowSelectionModel, openDrawer, handleClose }} />
          </Stack>
        ) : (
          <></>
        )}
        <div style={{ width: '100%' }}>
          <DataGrid
            key={'dataGrid'}
            showCellVerticalBorder
            getRowId={(row) => row._id}
            rows={convertedData ?? []}
            columns={columns}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            loading={dataLoading}
            slots={{
              loadingOverlay: LinearProgress,
            }}
            disableRowSelectionOnClick
            rowSelectionModel={rowSelectionModel}
            rowsPerPageOptions={[25]}
            checkboxSelection={isAdmin}
            rowHeight={75}
            onRowClick={(params) => setSelectedRowID(params.id)}
          />
        </div>
      </Box>
    </div>
  );
}

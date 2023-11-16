import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Avatar, Divider, Stack, Box, Button, Tooltip, Typography } from '@mui/material';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Delete from '@mui/icons-material/Delete';
import Image from 'next/image';
import { Print, Info } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { faFileEdit, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

import AutocompleteEditCell from '../Autocomplete/AutocompleteEditCell.js';
import { STATUS_OPTIONS } from '../../utils/FormsUtil.js';
import XLSXDialog from '../Dialogs/XLSXDialog.js';
import { urlFor } from '../../../sanity/utils/client';
import noImage from '../../assets/images/users/noimage.png';
import SupportDrawer from '../Drawers/SupportDrawer.js';
import { MailAction, SaveAction, DeleteAction } from './DataTableActions.js';
import { getConvertedData, getDataWithAvatar } from '../../utils/DashboardUtil.js';
import { EditItemsDrawer } from '../Drawers/EditItemsDrawer.js';

const classes = {
  tableButtonSX: {
    '&:hover': {
      color: '#1769aa',
    },
  },
  updateButtonSX: {
    width: 222,
    backgroundColor: '#1d1c1a',
    '&:hover': {
      backgroundColor: '#1d1c1a',
    },
  },
  cellImageSX: {
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
};

export default function DataTable(props) {
  const { data, userData } = props;

  const newData = getDataWithAvatar(data);

  const isAdmin = userData?.role === 'admin' || userData?.role === 'superAdmin';

  const convertedData = getConvertedData(newData);

  let componentRef = React.useRef();

  const [selectedRowID, setSelectedRowID] = React.useState();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openSupportDrawer, setOpenSupportDrawer] = React.useState(false);
  const [openMail, setOpenMail] = React.useState(false);
  const [openXLSX, setOpenXLSX] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  const handleOpenMailDialog = () => {
    setOpenMail(true);
  };

  const handleOpenXLSXDialog = () => {
    setOpenXLSX(true);
  };

  const handleClose = () => {
    setOpenMail(false);
    setOpenXLSX(false);
    setOpenDelete(false);
    setOpenDrawer(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDelete(true);
  };

  const onChangeSupport = () => {
    setOpenSupportDrawer(!openSupportDrawer);
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
        width: 70,
        editable: false,
      },
      {
        field: 'products',
        headerName: 'Ürünler',
        width: 330,
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
        width: 330,
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
        width: 90,
        editable: false,
        align: 'center',
        renderCell: (params) => {
          return (
            <>
              {params.row.cargoLabel !== null || params.row.cargoLabel?.asset._ref !== undefined ? (
                <Box sx={classes.cellImageSX}>
                  <Image src={urlFor(params.row.cargoLabel)?.url()} layout="fill" />
                </Box>
              ) : (
                <Box sx={classes.cellImageSX}>
                  <Image src={noImage} layout="fill" />
                </Box>
              )}
            </>
          );
        },
      },
      {
        field: 'cost',
        headerName: 'Maliyet',
        width: 100,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'packagingCost',
        headerName: 'Paket Maliyeti',
        width: 100,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'shippingCost',
        headerName: 'Kargo Maliyeti',
        width: 100,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'price',
        headerName: 'Satis Tutari',
        type: 'number',
        width: 100,
        editable: isAdmin,
      },
      {
        field: 'description',
        headerName: 'Aciklama',
        width: 200,
        editable: isAdmin,
      },
      {
        field: 'status',
        headerName: 'Statü',
        width: 150,
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
          <>
            {isAdmin && (
              <>
                <Tooltip title={'Mail gönder'}>
                  <span>
                    <GridActionsCellItem
                      key={'mail'}
                      icon={
                        <ForwardToInboxIcon
                          sx={classes.tableButtonSX}
                          onClick={() => {
                            handleOpenMailDialog(params.row._id);
                          }}
                        />
                      }
                      label="Send"
                    />
                  </span>
                </Tooltip>
                <MailAction
                  key={params.row._id}
                  convertedData={convertedData}
                  selectedRowID={selectedRowID}
                  openMail={openMail}
                  handleClose={handleClose}
                />
              </>
            )}
          </>,
          <>
            {!isAdmin && (
              <>
                <Tooltip title={'Admin destek hatti'}>
                  <span>
                    <GridActionsCellItem
                      key={'support'}
                      icon={
                        <Info
                          sx={classes.tableButtonSX}
                          onClick={() => setOpenSupportDrawer(true)}
                        />
                      }
                      label="Support"
                    />
                  </span>
                </Tooltip>
                <SupportDrawer
                  key={params.row._id}
                  rowID={params.row._id}
                  data={convertedData}
                  openSupportDrawer={openSupportDrawer}
                  onChangeSupport={onChangeSupport}
                />
              </>
            )}
          </>,
          <>
            <SaveAction {...{ params, selectedRowID, convertedData }} />
          </>,
          <>
            <Tooltip title={'Siparisi sil'}>
              <span>
                <GridActionsCellItem
                  key={'delete'}
                  icon={
                    <Delete
                      sx={classes.tableButtonSX}
                      onClick={() => {
                        handleOpenDeleteDialog(params.row._id);
                      }}
                    />
                  }
                  label="Delete"
                />
              </span>
            </Tooltip>
            <DeleteAction
              selectedRowID={selectedRowID}
              openDelete={openDelete}
              handleClose={handleClose}
            />
          </>,
        ],
      },
    ],
    [
      isAdmin,
      convertedData,
      selectedRowID,
      openMail,
      openSupportDrawer,
      onChangeSupport,
      openDelete,
    ],
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
          <Stack sx={{ marginBottom: 1 }} direction={'row'} spacing={1}>
            <Tooltip title={'Tablodan Excel olustur'}>
              <span>
                <Button
                  key={'mainActions[0]'}
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => handleOpenXLSXDialog()}
                >
                  <FontAwesomeIcon icon={faFileExcel} />
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
                    <Box display={'block'} /* style={{ margin: 'auto' }} */>
                      <Image
                        src={x.cargoLabel?.asset._ref ? urlFor(x.cargoLabel)?.url() : noImage}
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
                                //getSeperator(i, x.products.length)
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
                    variant="outlined"
                    color="primary"
                    disabled={rowSelectionModel.length < 1}
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
                  variant="outlined"
                  color="primary"
                  size="large"
                  disabled={rowSelectionModel.length !== 1}
                  onClick={() => setOpenDrawer(true)}
                >
                  <FontAwesomeIcon icon={faFileEdit} />
                </Button>
              </span>
            </Tooltip>
            <EditItemsDrawer {...{ convertedData, rowSelectionModel, openDrawer, handleClose }} />
          </Stack>
        ) : (
          <></>
        )}
        <DataGrid
          key={'dataGrid'}
          showCellVerticalBorder
          getRowId={(row) => row._id}
          rows={convertedData ?? []}
          columns={columns}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          rowsPerPageOptions={[25]}
          checkboxSelection={isAdmin}
          rowHeight={75}
          onRowClick={(params) => setSelectedRowID(params.id)}
        />
      </Box>
    </div>
  );
}

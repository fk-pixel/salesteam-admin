import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Tooltip,
  Avatar,
  Drawer,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  CssBaseline,
  Paper,
  Divider,
} from '@mui/material';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Save from '@mui/icons-material/Save';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';

import AutocompleteEditCell from '../../Autocomplete/AutocompleteEditCell.js';
import { makeStyles } from '@material-ui/core/styles';
import {
  PANELTYPE_OPTIONS,
  PRODUCTMAINTYPE_OPTIONS,
  ROLLTYPE_OPTIONS,
  SHIPPING_OPTIONS,
} from '../../../../pages/order.js';
import { Print, UploadFile } from '@mui/icons-material';
import { initialOrderState } from '../../../data/OrderData.js';
import Image from 'next/image';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import { sendContactForm } from '../../../../controller/api.js';
import { deleteOrder, getOrders, updateOrder } from '../../../../sanity/utils/order-utils.js';
import { toast } from 'react-toastify';
import { urlFor } from '../../../../sanity/utils/client.js';
import user4 from '../../assets/images/users/user4.jpg';
import Globe from '../../../assets/icons/xlsx.js';
import { faCoffee, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AutocompleteEditInputCell from '../../Autocomplete/AutocompleteEditCell.js';
// import { DatePicker } from '@mui/x-date-pickers';
import { DatePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// let idCounter = 1;
// const createRandomRow = () => {
//   idCounter += 1;
//   return { id: idCounter };
// };

const useStyles = makeStyles(() => {
  return {
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    paper: { '& .MuiDrawer-paper': { width: '475px' } },
    printItems: {
      display: 'none',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      '@media print': {
        display: 'flex',
      },
    },
  };
});

export default function DataTable(props) {
  const { data, userData, onChangeDataTable } = props;

  const classes = useStyles();

  let componentRef = React.useRef();

  const [selectedRowID, setSelectedRowID] = React.useState();
  const [openImgDrawer, setOpenImgDrawer] = React.useState(false);
  const [openMail, setOpenMail] = React.useState(false);
  const [openXLSX, setOpenXLSX] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  // const [isReadyToPrint, setIsReadyToPrint] = React.useState('none');

  var newData = getDataWithAvatar(data);

  const handleOpenMailDialog = (rowID) => {
    setOpenMail(true);
    setSelectedRowID(rowID);
  };

  const handleOpenXLSXDialog = () => {
    setOpenXLSX(true);
    // setSelectedRowID(rowID);
  };

  const handleClose = () => {
    setOpenMail(false);
    setOpenXLSX(false);
    setOpenDelete(false);
    setSelectedRowID();
  };

  // const handleSubmitMailDialog = () => {
  //   setOpenMail(false);
  // };

  const handleOpenDeleteDialog = (rowID) => {
    setOpenDelete(true);
    setSelectedRowID(rowID);
    // const isExist = newData.find((x) => x.id === rowID);
    // if (isExist) {
    // }
  };

  // const handleDrawer = (params) => {
  //   const isExist = newData.find((x) => x.id === params.row.id);
  //   if (isExist) {
  //     return (
  //       <>
  //         <Drawer
  //           key={params.row.id}
  //           className={classes.paper}
  //           anchor={'right'}
  //           open={openImgDrawer}
  //           onClose={() => setOpenImgDrawer(false)}
  //         >
  //           <Box>
  //             <Image
  //               src={`${params.row.productFile}.src`}
  //               style={{ width: '100%', maxWidth: '475px' }}
  //             />
  //           </Box>
  //           <Typography>{params.row.product}</Typography>
  //         </Drawer>
  //       </>
  //     );
  //   }
  // };

  const onSave = async (row) => {
    const editedData = {
      number: row.number,
      store: row.store,
      username: row.username,
      product: row.product,
      productFile: row.productFile,
      productSize: row.size,
      productMainType: row.productMainType,
      productSubType: row.productSubType,
      productCargoType: row.productCargoType,
      gift1: row.gift1,
      gift1File: row.gift1File,
      gift2: row.gift2,
      gift2File: row.gift2File,
      cost: row.cost,
      packagingCost: row.packagingCost,
      shippingCost: row.shippingCost,
      cargoLabel: row.cargoLabel,
      description: row.description,
      status: row.status,
      price: row.price,
      createdDate: row._createdDate,
      createdBy: row.createdBy,
    };

    await updateOrder(row._id, editedData)
      .then(() => {
        toast(
          <div>
            `Siparis{' '}
            <strong>
              {editedData.product} | {editedData.price}€
            </strong>{' '}
            basariyla güncellendi`
          </div>,
          {
            type: 'success',
          },
        );
      })
      .catch((error) => {
        toast(`Güncelleme isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
          type: 'error',
        });
      });
  };

  const onRemove = async (orderID) => {
    await deleteOrder(orderID)
      .then(async () => {
        toast(`Siparis ${orderID} basariyla silindi`, {
          type: 'success',
        });
        handleClose(orderID);
        // onChangeDataTable();
      })
      .catch((error) => {
        toast(`Kayit isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
          type: 'error',
        });
      });
  };

  // React.useEffect(() => {
  //   onChangeDataTable();
  // }, [onChangeDataTable]);

  function MailDialog() {
    const fileInputMail = React.useRef(null);

    const [mailState, setMailState] = React.useState({
      id: uuidv4(),
      sender: '',
      recipient: '',
      context: '',
      showAutoContext: false,
      autoContext: '',
      message: '',
      mailFile: null,
    });

    const handleChangeMailFile = (event) => {
      setMailState({
        ...mailState,
        mailFile: URL.createObjectURL(event.target.files[0]),
      });
    };

    const handleChange = ({ target }) => {
      setMailState((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    };

    function onUploadMail(e) {
      e.preventDefault();
      fileInputMail.current.click();
    }

    const sendEmail = async () => {
      await sendContactForm(mailState);
      handleClose();
    };

    const rowData = dataByRole.find((x) => x._id === selectedRowID);

    return (
      <Dialog
        open={openMail}
        onClose={handleClose}
        //BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        hideBackdrop
        id={selectedRowID}
      >
        <DialogTitle>Mail Gönder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>
              '{rowData?.product} | {rowData?.price}€'
            </strong>{' '}
            siparisi icin üreticiyle temasa gecin.
          </DialogContentText>
          <form>
            <TextField
              autoFocus
              margin="dense"
              id="sender"
              name="sender"
              label="Email Gönderen"
              type="email"
              value={userData.email !== undefined ? userData.email : 'salesteam.ilk@gmail.com'}
              fullwidth
              variant="standard"
              style={{ marginTop: 24 }}
              disabled
              // onChange={handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="recipient"
              name="recipient"
              label="Alici"
              type="email"
              fullwidth
              variant="standard"
              onChange={handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="context"
              name="context"
              label="Konu"
              type="text"
              fullwidth
              variant="standard"
              onChange={handleChange}
            />
            <Box style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Checkbox id={'showAutoContext'} />}
                label={`Otomoatik icerik iste`}
                onChange={(e) =>
                  setMailState({
                    ...mailState,
                    showAutoContext: e.target.checked,
                  })
                }
              />
              <Autocomplete
                id="autoContext"
                name="autoContext"
                options={AUTOCONTEXT_OPTIONS}
                disabled={mailState.showAutoContext === false}
                getOptionLabel={(o) => o.title || ''}
                freeSolo={false}
                disableClearable={true}
                onChange={handleChange}
                // onChange={(e) =>
                //   setMailState({
                //     ...mailState,
                //     autoContext: e.target.value.label,
                //   })
                // }
                renderInput={(params) => (
                  <TextField
                    style={{ width: 300 }}
                    {...params}
                    // onChange={handleChange}
                    label="Otomatik Icerik"
                    placeholder=""
                  />
                )}
              />
            </Box>
            <TextField
              autoFocus
              margin="dense"
              id="message"
              name="message"
              label="Mesaj"
              type="text"
              fullwidth
              variant="outlined"
              multiline
              rows={12}
              onChange={handleChange}
            />
          </form>
          {mailState.mailFile !== null && <pre>{mailState.mailFile}</pre>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Kapat</Button>
          <>
            <input
              id={`mailFile`}
              ref={fileInputMail}
              type="file"
              accept="image/*"
              onChange={(e) => handleChangeMailFile(e)}
              style={{ display: 'none' }}
            />
            <Button startIcon={<UploadFile />} onClick={(e) => onUploadMail(e)} type="file">
              Ekle
            </Button>
          </>
          <Button onClick={sendEmail} variant="contained">
            Gönder
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function XLSXDialog() {
    const [XLSXState, setXLSXState] = React.useState({
      id: uuidv4(),
      startDate: new Date(),
      endDate: new Date(),
      hideColumn: {
        product: false,
        productSize: false,
        productMainType: false,
        productSubType: false,
        productCargoType: false,
        description: false,
      },
    });

    const handleChange = (target) => {
      setXLSXState((prev) => ({
        ...prev,
        [target.id]: target.value,
      }));

      // setXLSXState({ ...XLSXState, startDate: target });
    };

    const createXLSX = async () => {
      // await sendContactForm(XLSXState);
      handleClose();
    };

    return (
      <Dialog
        open={openXLSX}
        onClose={handleClose}
        //BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        hideBackdrop
        id={'createExcel'}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DialogTitle>Excel Olustur</DialogTitle>
          <DialogContent>
            <DialogContentText>
              xlsx dosyasini olusturmak icin bir tarih araligi secin
            </DialogContentText>
            <form>
              <KeyboardDatePicker
                id={'startDate'}
                name="startDate"
                format="MM/dd/yyyy"
                value={XLSXState.startDate}
                label="Baslangic tarihi"
                onChange={(val) =>
                  setXLSXState({
                    ...XLSXState,
                    startDate: val,
                  })
                }
                style={{ marginTop: 36 }}
                // onChange={handleChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
                id={'endDate'}
                name="endDate"
                format="MM/dd/yyyy"
                value={XLSXState.endDate}
                label="Bitis tarihi"
                // onChange={handleChange}
                onChange={(val) =>
                  setXLSXState({
                    ...XLSXState,
                    endDate: val,
                  })
                }
                style={{ marginTop: 36 }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />

              <Box style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={<Checkbox id={'showColumns'} />}
                  label={`Sütunlari gizle:`}
                  options={[
                    { id: 'product', label: 'Product' },
                    { id: 'productSize', label: 'Product Size' },
                    { id: 'productMainType', label: 'Product Main Type' },
                    { id: 'productSubType', label: 'Product Sub Type' },
                    { id: 'productCargoType', label: 'Product Cargo Type' },
                    { id: 'description', label: 'Description' },
                  ]}
                  onChange={(e) =>
                    setXLSXState({
                      ...XLSXState,
                      hideColumn: {
                        product: e.target.checked,
                        productSize: e.target.checked,
                        productMainType: e.target.checked,
                        productSubType: e.target.checked,
                        productCargoType: e.target.checked,
                        description: e.target.checked,
                      },
                    })
                  }
                />
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Kapat</Button>
            <Button onClick={createXLSX} variant="contained" color="primary">
              Olustur
            </Button>
          </DialogActions>
        </MuiPickersUtilsProvider>
      </Dialog>
    );
  }

  function DeleteDialog() {
    const rowData = dataByRole.find((x) => x._id === selectedRowID);

    return (
      <>
        <CssBaseline />
        <Dialog
          id={selectedRowID}
          open={openDelete}
          onClose={handleClose}
          hideBackdrop
          // PaperProps={{
          //   style: {
          //     // backgroundColor: 'transparent',
          //     boxShadow: 'none',
          //   },
          // }}
        >
          <DialogTitle>Siparisi Sil</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {/* id numarasi<strong style={{ color: 'red' }}> '{selectedRowID}'</strong> olan siparisi
              silmek istediginizden emin misiniz? */}
              <strong style={{ color: 'red' }}>
                `{rowData?.product} | {rowData?.price}€`
              </strong>{' '}
              siparisi silmek istediginizden emin misiniz?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Kapat</Button>
            <Button onClick={() => onRemove(rowData._id)} variant="contained">
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function getNewDataByUser() {
    return newData !== undefined ? newData.filter((x) => x.createdBy === userData.username) : [];
  }

  const newDataByUser = getNewDataByUser();

  const isAdmin = userData?.role === 'admin' || userData?.role === 'superAdmin';

  const dataByRole =
    userData !== null || userData !== undefined ? (isAdmin ? newData : newDataByUser) : [];

  React.useEffect(() => {
    dataByRole;
  }, [dataByRole]);

  const columns = React.useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Sira',
        width: 50,
        editable: false,
        renderCell: (index) => index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1,
      },
      {
        field: 'avatar',
        headerName: '',
        width: 60,
        renderCell: (params) => {
          return (
            <Tooltip title={`Kaydi Olusturan: ${params.row.createdBy?.username}`}>
              <Avatar sx={{ bgcolor: 'warning.main' }} alt="">
                {params.value}
              </Avatar>
            </Tooltip>
          );
        },
      },
      {
        field: 'product',
        headerName: 'Ürün',
        width: 200,
        editable: isAdmin,
        renderEditCell: (params) => {
          return (
            <>
              <TextField
                {...params}
                // key={'product'}
                value={params.row.product}
                //variant="filled"
                fullwidth
                onChange={(event) => {
                  params.row.product = event.target.value;
                  // params.value = event.target.value;
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" onClick={() => setOpenImgDrawer(true)}>
                      {params.row.productFile ? <LinkedCameraIcon /> : <></>}
                    </InputAdornment>
                  ),
                }}
              />
              <Drawer
                key={params.row._id}
                className={classes.paper}
                style={{ width: '100px' }}
                anchor={'right'}
                open={openImgDrawer}
                onClose={() => setOpenImgDrawer(false)}
              >
                <Box>
                  <Image
                    width={350}
                    height={350}
                    src={`${params.row.productFile}`} // next config test edilecek
                    style={{ width: '100%', maxWidth: '475px' }}
                  />
                </Box>
                <Typography>{params.row.product}</Typography>
              </Drawer>
            </>
          );
        },
      },
      {
        field: 'productSize',
        headerName: 'Ürün Ölcüsü',
        width: 120,
        editable: isAdmin,
      },
      {
        field: 'productMainType',
        headerName: 'Ürün Ana Tipi',
        editable: isAdmin,
        renderEditCell: (params) => {
          return (
            <AutocompleteEditCell
              {...params}
              value={params.row.productMainType}
              name={'productMainType'}
              options={PRODUCTMAINTYPE_OPTIONS}
              getOptionLabel={(o) => o.label || ''}
              freeSolo={true}
              autoHighlight={false}
              multiple={false}
              disableClearable={true}
            />
          );
        },
      },
      {
        field: 'productSubType',
        headerName: 'Ürün Alt Tipi',
        // width: 100,
        editable: isAdmin,
        renderEditCell: (params, onChange) => {
          return (
            <AutocompleteEditCell
              {...params}
              key={'productSubType'}
              value={params.row.productSubType}
              options={[...PANELTYPE_OPTIONS, ...ROLLTYPE_OPTIONS]}
              getOptionLabel={(o) => o.label || ''}
              freeSolo={true}
              autoHighlight={false}
              multiple={false}
              disableClearable={true}
            />
          );
        },
        // renderCell: (params) => {
        //   return (
        //     <Chip
        //       variant="outlined"
        //       color="primary" /* {...getChipProps(params)} */
        //     />
        //   );
        // },
      },
      {
        field: 'productCargoType',
        headerName: 'Ürün Kargo Tipi',
        width: 120,
        editable: isAdmin,
        renderEditCell: (params) => {
          return (
            <AutocompleteEditCell
              {...params}
              key={'productCargoType'}
              value={params.row.productCargoType}
              options={SHIPPING_OPTIONS}
              getOptionLabel={(o) => o.label || ''}
              freeSolo={true}
              autoHighlight={false}
              multiple={false}
              disableClearable={true}
            />
          );
        },
      },
      {
        field: 'gift1',
        headerName: 'Hediye 1',
        width: 200,
        editable: isAdmin,
        renderCell: (params) => {
          return (
            <>
              <Box width={200} style={{ justifyContent: 'space-around' }}>
                <span>{params.row.gift1}</span>
                {params.row.gift1File && (
                  <>
                    <Button onClick={() => setOpenImgDrawer(true)} color={'inherit'}>
                      <LinkedCameraIcon />
                    </Button>
                    <Drawer
                      // key={params.row.id}
                      className={classes.paper}
                      style={{ width: '100px' }}
                      anchor={'right'}
                      open={openImgDrawer}
                      onClose={() => setOpenImgDrawer(false)}
                    >
                      <Box>
                        <Image
                          width={200}
                          src={params.row.gift1File}
                          style={{ width: '100%', maxWidth: '475px' }}
                        />
                      </Box>
                      <Typography>{params.row.gift1}</Typography>
                    </Drawer>
                  </>
                )}
              </Box>
            </>
          );
        },
      },
      {
        field: 'gift1Size',
        headerName: 'Hediye 1 Ölcü',
        width: 140,
        // type: "number",
        editable: isAdmin,
      },
      {
        field: 'gift2',
        headerName: 'Hediye 2',
        width: 200,
        editable: isAdmin,
        renderCell: (params) => {
          return (
            <>
              <Box width={200} style={{ justifyContent: 'space-around' }}>
                <span>{params.row.gift2}</span>
                {params.row.gift2File && (
                  <>
                    <Button onClick={() => setOpenImgDrawer(true)} color={'inherit'}>
                      <LinkedCameraIcon />
                    </Button>
                    <Drawer
                      // key={params.row.id}
                      className={classes.paper}
                      style={{ width: '100px' }}
                      anchor={'right'}
                      open={openImgDrawer}
                      onClose={() => setOpenImgDrawer(false)}
                    >
                      <Box>
                        <Image
                          width={200}
                          src={params.row.gift2File}
                          style={{ width: '100%', maxWidth: '475px' }}
                        />
                      </Box>
                      <Typography>{params.row.gift2}</Typography>
                    </Drawer>
                  </>
                )}
              </Box>
            </>
          );
        },
      },
      {
        field: 'gift2Size',
        headerName: 'Hediye 2 Ölcü',
        width: 140,
        editable: isAdmin,
      },
      { field: 'cost', headerName: 'Maliyet', type: 'number', editable: isAdmin },
      {
        field: 'packagingCost',
        headerName: 'Paket Maliyeti',
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'shippingCost',
        headerName: 'Kargo Maliyeti',
        width: 120,
        type: 'number',
        editable: isAdmin,
      },
      {
        field: 'cargoLabel',
        headerName: 'Kargo Etiketi',
        width: 100,
        type: 'link',
        editable: false,
      },
      {
        field: 'price',
        headerName: 'Satis Tutari',
        type: 'number',
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
        // cellEditorParams: {
        //   do: "fthbtl",
        // },
        renderEditCell: (params) => {
          return (
            <AutocompleteEditCell
              {...params}
              key={'status'}
              value={findStatusOption(params.row.status).title}
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
        width: 100,
        getActions: (params) => [
          <>
            <Tooltip title={'Mail gönder'}>
              <GridActionsCellItem
                icon={
                  <ForwardToInboxIcon
                    onClick={() => {
                      handleOpenMailDialog(params.row._id);
                    }}
                  />
                }
                label="Send"
              />
            </Tooltip>
            <MailDialog key={params.row._id} />
          </>,
          <>
            <Tooltip title={'Siparisi kaydet'}>
              <GridActionsCellItem
                icon={<Save onClick={() => onSave(params.row)} />}
                label="Save"
              />
            </Tooltip>
          </>,
          <>
            <Tooltip title={'Siparisi sil'}>
              <GridActionsCellItem
                icon={
                  <Delete
                    onClick={() => {
                      handleOpenDeleteDialog(params.row._id);
                    }}
                  />
                }
                label="Delete"
              />
            </Tooltip>
            <DeleteDialog />
          </>,
        ],
      },
    ],
    [handleOpenMailDialog, handleOpenDeleteDialog, handleClose],
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, //.current,
    documentTitle: 'new document',
    // pageStyle: 'print',
  });

  const printableOrder = dataByRole.filter((x) => rowSelectionModel?.includes(x._id));

  const printableCargoLabel = printableOrder.map((x) => x.cargoLabel);

  return (
    <div style={{ height: 850, width: '100%' }}>
      <Box height={820}>
        {isAdmin ? (
          <Box display={'flex'}>
            {/* ADD A XLSX */}
            <Tooltip title={'Excel tabela olustur'}>
              <Button
                onClick={() => handleOpenXLSXDialog()}
                variant="contained"
                color="inherit"
                style={{
                  marginBottom: 12,
                  alignSelf: 'start',
                  // color: isHoverProduct ? 'red' : 'black',
                }}
                size="small"
              >
                <FontAwesomeIcon icon={faFileExcel} size="xl" />
              </Button>
            </Tooltip>
            <XLSXDialog />

            {/* PRINT DOCUMENT - 1 */}
            <Box>
              {/* <Paper ref={componentRef} style={{ display: 'none' }}>
              </Paper> */}
              {/* <ComponentToPrint ref={componentRef} /> */}
              <Box
                display={'flex'}
                className={classes.printItems}
                // style={{
                //   flexWrap: 'wrap',
                //   justifyContent: 'space-between',
                //   // display: isReadyToPrint,
                // }}
                ref={componentRef}
              >
                {printableOrder.map((x) => (
                  <div style={{ margin: '12px 60px 12px 60px' }}>
                    <Box display={'block'} /* style={{ margin: 'auto' }} */>
                      <Image
                        // src={printableCargoLabel.map((x) => urlFor(x).url())}
                        // src={user4}
                        src={urlFor(x.cargoLabel)?.url()}
                        width="275"
                        height="250"
                        // alt="A clock"
                      />
                      <div style={{ width: 275, backgroundColor: 'InactiveCaption' }}>
                        <Divider style={{ marginBottom: 6 }} />
                        <p style={{ marginTop: 12 }}>
                          <strong>Ürün: </strong>
                          {x.product} ({x.productMainType} | {x.productSize})
                        </p>
                        <Divider style={{ marginBottom: 6 }} />
                      </div>
                    </Box>
                  </div>
                ))}
              </Box>
              <Tooltip title={'Kargo etiketlerini yazdir'}>
                <Button
                  onClick={handlePrint}
                  variant="contained"
                  color="inherit"
                  style={{
                    marginBottom: 12,
                    alignSelf: 'start',
                    marginLeft: 6,
                  }}
                  size="small"
                >
                  <Print fontSize="small" />
                </Button>
              </Tooltip>
            </Box>

            {/* PRINT DOCUMENT - 2 */}
            {/* <div>
              <ReactToPrint
                trigger={() => (
                  <Button
                    // onClick={handlePrint}
                    variant="contained"
                    color="inherit"
                    style={{
                      marginBottom: 12,
                      alignSelf: 'start',
                      marginLeft: 6,
                    }}
                    size="small"
                  >
                    <Print fontSize="small" />
                  </Button>
                )}
                content={() => componentRef}
              />
              <div style={{ display: 'none' }}>
                <ComponentToPrint ref={componentRef} />
              </div>
            </div> */}
          </Box>
        ) : (
          <></>
        )}

        <DataGrid
          showCellVerticalBorder
          getRowId={(row) => row._id}
          rows={dataByRole ?? []}
          columns={columns}
          // editMode="row"
          // pageSize={25}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          //initialState={{ pinnedColumns: { right: ['actions'] } }}
          rowsPerPageOptions={[25]}
          checkboxSelection={isAdmin}
          isRowSelectable={(params) => params.row.cargoLabel !== null}
        />
      </Box>
    </div>
  );
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

      newData.push({ ...i, avatar: shortcut });
    }
    return newData;
  }

  return;
}

export function ImgDrawer(openImgDrawer) {
  return <>{openImgDrawer && <Drawer key={'ImgDrawer'}></Drawer>}</>;
}

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

// export function ComponentToPrint({ ref }) {
//   return (
//     <Paper>
//       <p>asdasd</p>
//       <Image
//         //src={'https://www.w3schools.com/images/img_girl.jpg'}
//         // src={printableCargoLabel.map((x) => urlFor(x).url())}
//         src={user4}
//         // src={printableCargoLabel.map((x) => urlFor(x)?.url())}
//         fill={true}
//         width="30"
//         height="30"
//         // alt="A clock"
//       />
//     </Paper>
//   );
// }

// <div>
//   <div style={{ display: 'none' }}>
//     <ComponentToPrint ref={(el) => (componentRef = el)} />
//   </div>
//   <Button
//     onClick={handlePrint}
//     variant="contained"
//     color="inherit"
//     style={{
//       marginBottom: 12,
//       alignSelf: 'start',
//       marginLeft: 6,
//     }}
//     size="small"
//   >
//     <Print fontSize="small" />
//   </Button>
// </div>

// function getChipProps(params) {
//   if (params.value === "RED") {
//     return {
//       icon: <WarningIcon style={{ fill: red[500] }} />,
//       label: params.value,
//       style: {
//         borderColor: red[500],
//       },
//     };
//   } else {
//     return {
//       icon: <CheckCircleIcon style={{ fill: blue[500] }} />,
//       label: params.value,
//       style: {
//         borderColor: blue[500],
//       },
//     };
//   }
// }

// function getOptionProps(params) {
//   if (params.value === "RED") {
//     return {
//       icon: <WarningIcon style={{ fill: red[500] }} />,
//       label: params.value,
//       style: {
//         borderColor: red[500],
//       },
//     };
//   } else {
//     return {
//       icon: <CheckCircleIcon style={{ fill: blue[500] }} />,
//       label: params.value,
//       style: {
//         borderColor: blue[500],
//       },
//     };
//   }
// }

// function PrintComponent(cargoLabels) {
//   return (
//     <>
//       {cargoLabels.length > 0 && (
//         <div style={{ display: 'flex', maxHeight: 150, maxWidth: 150, width: '%100' }}>
//           {/* <canvas id="clock" width="150" height="150"> */}
//           <img
//             src={'https://www.w3schools.com/images/img_girl.jpg'}
//             // src={urlFor(x).url()}
//             width="150"
//             height="150"
//             alt="A clock"
//           />
//           <p>
//             {x} | {index}
//           </p>
//           {/* </canvas> */}
//         </div>
//       )}
//     </>
//   );
// }

// const handleAddRow = () => {
//   // setRowHandle(true);
//   const { id, createdBy, createdDate, ...rest } = initialOrderState;

//   const NEW = { id: uuidv4(), createdBy: userData.username, createdDate: new Date(), ...rest };
// };

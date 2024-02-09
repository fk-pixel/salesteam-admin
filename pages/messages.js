import React from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { TextField as MTextField } from 'formik-mui';
import { format } from 'date-fns';
import tr from 'date-fns/locale/tr';
import {
  Box,
  Autocomplete,
  Tooltip,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import {
  AnnouncementRounded,
  Close,
  EmojiEmotions,
  Send,
  SupervisedUserCircle,
  Tune,
  TurnedIn,
} from '@mui/icons-material';
import { client } from '../sanity/utils/client';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Field, Form, Formik } from 'formik';
import Picker from '@emoji-mart/react';

import { usePortalContext } from '../src/common/Portal/portal';
import { updateNotifications } from '../sanity/utils/order-utils';
import FullLayout from '../src/layouts/FullLayout';
import { getAdminNameWithAvatar } from '../src/utils/DashboardUtil';
import Searchbar from '../src/components/Searchbar/Searchbar';
import { usePreviousPersistent } from '../src/utils/AppUtil';

//import { useStore } from '../src/store';

export default function Messages() {
  const { User } = usePortalContext();

  //const { user } = useStore();

  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [orders, setOrders] = React.useState([]);
  const [order, setOrder] = React.useState();
  const [selectedMessage, setSelectedMessage] = React.useState();
  const [notifications, setNotifications] = React.useState();
  const [answer] = React.useState({
    answerId: uuidv4(),
    answeredBy: {
      _type: 'reference',
      _ref: User?._id,
    },
    answer: '',
    createdAt: new Date(),
  });
  const [openEmojiToolbar, setOpenEmojiToolbar] = React.useState();
  const [orderId, setOrderId] = React.useState('');
  const [openMessageSetting, setOpenMessageSetting] = React.useState(false);
  const [messageSetting, setMessageSetting] = React.useState({
    sortBy: { label: 'Oluşturulduğu Tarih (daha sonra)', value: 'createdDate' },
    checkedFlags: [],
    checkedCreators: [],
  });

  const prevSelectedMessage = usePreviousPersistent(selectedMessage);

  const userQuery = `*[_type == "order" && createdBy._ref == '${User._id}'] | order(_createdAt desc){          
    _id,
    _createdAt,
    products[] {
      productFile,
      productName,
      productWidth,
      productHeight,
      productPiece,
      productMainType,
      productSubType,
      productCargoType,
    },
    gifts[] {
      giftFile,
      giftName,
      giftWidth,
      giftHeight,
      giftPiece,
      giftMainType,
      giftSubType,
      giftCargoType,
    },
    cost,
    packagingCost,
    shippingCost,
    description,
    cargoLabel,
    price,
    status,
    createdBy-> {_id, username, email, store},
    notifications[] {
      notificationId,
      createdAt,
      context,
      note,
      noteToAdmin[] -> {_id, username, email, store},
      flag,
      answers[] {
      answerId,
      createdAt,
      answer,
      answeredBy-> {_id, username, email, store}
      }
    }
  }`;

  const adminQuery = `*[_type == "order"] | order(_createdAt desc){          
    _id,
    _createdAt,
    products[] {
      productFile,
      productName,
      productWidth,
      productHeight,
      productPiece,
      productMainType,
      productSubType,
      productCargoType,
    },
    gifts[] {
      giftFile,
      giftName,
      giftWidth,
      giftHeight,
      giftPiece,
      giftMainType,
      giftSubType,
      giftCargoType,
    },
    cost,
    packagingCost,
    shippingCost,
    description,
    cargoLabel,
    price,
    status,
    createdBy-> {_id, username, email, store},
    notifications[] {
      notificationId,
      createdAt,
      context,
      note,
      noteToAdmin[] -> {_id, username, email, store},
      flag,
      answers[] {
      answerId,
      createdAt,
      answer,
      answeredBy-> {_id, username, email, store}
      }
    }
  }`;

  React.useEffect(() => {
    if (User.role === 'user') {
      client.fetch(userQuery).then(setOrders);
      const subscription = client.listen(userQuery, {}, { visibility: 'query' }).subscribe(() => {
        client.fetch(userQuery).then(setOrders);
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    if (User.role === 'admin' || User.role === 'superAdmin') {
      client.fetch(adminQuery).then(setOrders);
      const subscription = client.listen(adminQuery, {}, { visibility: 'query' }).subscribe(() => {
        client.fetch(adminQuery).then(setOrders);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [User.role, adminQuery, userQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let initialNotes = [];

  const messages = orders
    ?.flatMap((x) => {
      if (x.notifications !== null) {
        return x.notifications.map((y) => ({
          ...y,
          orderId: x._id,
          createdBy: x.createdBy,
          answers: y.answers === null ? [] : y.answers,
        }));
      }
    })
    .filter((m) => m !== undefined)
    .filter((f) =>
      f.noteToAdmin.map((n, i) => (n?._id === User._id ? initialNotes.push(f[i]) : undefined)),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  messages?.map((x) =>
    x?.noteToAdmin?.map((y) => (y?._id === User._id ? initialNotes.push(x) : undefined)),
  );

  initialNotes = initialNotes.filter((x) => x !== undefined);

  const initialNotesRef = React.useRef(initialNotes.filter((x) => x !== undefined));

  function handleSelect(note) {
    const findSelectedNote = notifications?.find((x) => x.notificationId === note.notificationId);
    setSelectedMessage(findSelectedNote);
  }

  React.useEffect(() => {
    const { checkedFlags, checkedCreators } = getCheckedFlags(initialNotes);

    if (checkedFlags && checkedCreators) {
      setMessageSetting((prev) => ({ ...prev, checkedCreators, checkedFlags }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const makeFilter = () => {
      return initialNotes
        .filter((o) => {
          return messageSetting.checkedFlags
            .map((x) => {
              if (x.checked) {
                return x.value;
              }
            })
            .includes(o.flag);
        })
        .filter((o) => {
          return messageSetting.checkedCreators
            .map((x) => {
              if (x.checked) {
                return x.label;
              }
            })
            .includes(o.createdBy.username);
        });
    };
    if (messageSetting.checkedCreators && messageSetting.checkedFlags) {
      initialNotesRef.current = makeFilter();
      setNotifications(initialNotesRef.current);
    }
  }, [initialNotes, messageSetting.checkedCreators, messageSetting.checkedFlags]);

  const orderBySelectedIdQuery = `*[_type == "order" && _id == '${selectedMessage?.orderId}'] | order(_createdAt desc){          
    _id,
    _createdAt,
    products[] {
      productFile,
      productName,
      productWidth,
      productHeight,
      productPiece,
      productMainType,
      productSubType,
      productCargoType,
    },
    gifts[] {
      giftFile,
      giftName,
      giftWidth,
      giftHeight,
      giftPiece,
      giftMainType,
      giftSubType,
      giftCargoType,
    },
    cost,
    packagingCost,
    shippingCost,
    description,
    cargoLabel,
    price,
    status,
    createdBy-> {_id, username, email, store},
    notifications[] {
      notificationId,
      createdAt,
      context,
      note,
      noteToAdmin[] -> {_id, username, email, store},
      flag,
      answers[] {
      answerId,
      createdAt,
      answer,
      answeredBy-> {_id, username, email, store}
      }
    }
  }`;

  React.useEffect(() => {
    if (selectedMessage?.orderId) {
      client.fetch(orderBySelectedIdQuery).then((res) => setOrder(res[0]));
      const subscription = client
        .listen(orderBySelectedIdQuery, {}, { visibility: 'query' })
        .subscribe(() => {
          client.fetch(orderBySelectedIdQuery).then((res) => setOrder(res[0]));
        });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [orderBySelectedIdQuery, selectedMessage]);

  React.useEffect(() => {
    if (_.isEqual(selectedMessage, prevSelectedMessage) === false) {
      setOrderId();
    }
  }, [selectedMessage, prevSelectedMessage]);

  function getNoteByLimit(note) {
    const limitByScreen = tablet ? 40 : 90;

    const limitedNote = note.length > limitByScreen ? note.slice(0, limitByScreen) + '...' : note;

    return limitedNote;
  }

  const onSave = async (values, resetForm) => {
    const editedNotification = order.notifications.find(
      (notification) => notification.notificationId === selectedMessage.notificationId,
    );

    const { notifications } = order;

    const editedData = notifications.map((x) =>
      _.isEqual(x, editedNotification)
        ? {
            ...x,
            noteToAdmin: x?.noteToAdmin?.map((admin) => ({
              _type: 'reference',
              _ref: admin._id,
            })),
            answers:
              x.answers === null
                ? []
                : [
                    ...x.answers.map((answer) => ({
                      ...answer,
                      answeredBy: { _type: 'reference', _ref: answer?.answeredBy?._id },
                      notificationId: x.notificationId,
                    })),
                    {
                      ...values,
                      createdAt: new Date(),
                      answeredBy: {
                        _type: 'reference',
                        _ref: User._id,
                      },
                      notificationId: x.notificationId,
                    },
                  ],
          }
        : {
            ...x,
            noteToAdmin: x?.noteToAdmin?.map((admin) => ({
              _type: 'reference',
              _ref: admin._id,
            })),
            answers: [
              ...x.answers.map((answer) => ({
                ...answer,
                answeredBy: { _type: 'reference', _ref: answer?.answeredBy?._id },
              })),
            ],
          },
    );

    await updateNotifications(order._id, editedData)
      .then(() => {
        toast(<div>Mesajiniz iletildi</div>, {
          type: 'success',
        });
      })
      .catch((error) => {
        toast(`Güncelleme isleminiz eksik veya gecersizdir. Sorun: ${error.message}`, {
          type: 'error',
        });
      });

    resetForm();
  };

  const filteredMessage = order?.notifications.filter(
    (n) => n.notificationId === selectedMessage?.notificationId,
  )[0];

  function copyOrderId() {
    setOrderId(selectedMessage.orderId);
  }

  if (initialNotes === undefined || initialNotes.length < 1) {
    return <> 📢 Mesaj kutunuz bos</>;
  }

  return (
    <Box sx={{ width: '100%', height: '90dvh', display: 'flex' }}>
      {/* messages */}
      <Box sx={{ width: '35dvw', borderRight: '1px solid lightgrey', overflowY: 'scroll' }}>
        {/* messages header */}
        <Box
          sx={{
            paddingBottom: '4px',
            borderBottom: '1px solid lightgrey',
            position: 'fixed',
            minWidth: '30.9%',
            display: 'flex',
            zIndex: 1,
            justifyContent: 'space-between',
            backgroundColor: '#fff', //'#f8f8f8', //'#F2F8F8', //'#f2f7f8', //kirli beyaz
          }}
        >
          <Typography variant="h6" sx={{ lineHeight: 1.5 }}>
            Mesajlarim ({initialNotes?.length ?? notifications?.length})
          </Typography>
          <Button>
            <Tune color="action" onClick={() => setOpenMessageSetting(!openMessageSetting)} />
          </Button>
        </Box>
        {openMessageSetting && (
          <Box
            sx={{
              zIndex: 1,
              backgroundColor: '#f8f8f8',
              position: 'fixed',
              height: '27dvh',
              width: '30.75dvw',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: 5,
              }}
            >
              <Autocomplete
                sx={{ width: 380, paddingTop: 3 }}
                getOptionLabel={(o) => o.label}
                value={messageSetting.sortBy}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                options={[
                  { value: 'criter', label: 'Kriter (a-z)' },
                  { value: 'context', label: 'Icerik (a-z)' },
                  { value: 'sender', label: 'Gönderen (a-z)' },
                  { value: 'createdDate', label: 'Oluşturulduğu Tarih (daha sonra)' },
                  //{ id: 'updatedDate', value: 'Güncellendigi Tarih (a-z)' },
                ]}
                onChange={(e, val) => setMessageSetting((prev) => ({ ...prev, sortBy: val }))}
                renderInput={(params) => (
                  <TextField {...params} label="Sirala" variant="standard" />
                )}
              />
              <Close
                sx={{
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'CaptionText',
                  marginRight: 2,
                  marginTop: 1,
                }}
                onClick={() => setOpenMessageSetting(false)}
              />
            </Box>
            <Box sx={{ display: 'flex', paddingTop: 3, paddingLeft: 5, paddingRight: 5 }}>
              <Box sx={{ width: '50%' }}>
                <Typography>Kriterler:</Typography>
                <CheckboxGroup
                  messageSetting={messageSetting}
                  setMessageSetting={setMessageSetting}
                  groupName={'flags'}
                />
              </Box>
              <Box sx={{ width: '50%' }}>
                <Typography>Olusturanlar:</Typography>
                <CheckboxGroup
                  messageSetting={messageSetting}
                  setMessageSetting={setMessageSetting}
                  groupName={'creators'}
                />
              </Box>
            </Box>
          </Box>
        )}
        {/* messages card */}
        {notifications === undefined
          ? initialNotes.map((initialNote, i) => (
              <>
                <Box
                  key={i}
                  sx={{
                    height: '10dvh',
                    width: '100%',
                    padding: 1,
                    backgroundColor: initialNote.selectedMessage ? '#D5E4F9' : 'initial', //'#82bc0040',
                    borderLeft: initialNote.selectedMessage ? '6px solid #91BAD6' : 'initial',
                    display: 'flex',
                    borderBottom: '1px solid lightgrey',
                    marginTop: i === 0 ? 5 : undefined,
                  }}
                  onClick={() => {
                    handleSelect(initialNote);
                  }}
                >
                  {/* flag block */}
                  <Box sx={{ marginRight: 2 }}>
                    <TurnedIn
                      sx={{
                        color:
                          initialNote.flag === 'warning'
                            ? 'orange'
                            : initialNote.flag === 'danger'
                            ? 'red'
                            : initialNote.flag === 'success'
                            ? 'green'
                            : 'indigo',
                      }}
                    ></TurnedIn>
                  </Box>
                  {/* context block */}
                  <Box sx={{ display: 'block', width: '100%' }}>
                    {/* context header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'block', color: 'GrayText' }}>
                        <Typography sx={{ fontWeight: 600 }} variant="body1">
                          {initialNote?.context}
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                          <SupervisedUserCircle sx={{ fontSize: 18 }} />
                          <Typography variant="caption" sx={{ marginLeft: 1 }}>
                            {initialNote?.createdBy.store}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color={'grey'} fontWeight={600}>
                          {format(new Date(initialNote.createdAt), 'dd.LLLL yyyy, HH:mm', {
                            locale: tr,
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    {/* context */}
                    <Box sx={{ color: 'grey' }}>{getNoteByLimit(initialNote?.note)}</Box>
                  </Box>
                </Box>
              </>
            ))
          : notifications?.map((notification, i) => (
              <>
                <Box
                  key={i}
                  sx={{
                    height: '10dvh',
                    width: '100%',
                    padding: 1,
                    backgroundColor: _.isEqual(notification, selectedMessage) ? '#D5E4F9' : '', //'#82bc0040',
                    borderLeft: _.isEqual(notification, selectedMessage)
                      ? '6px solid #91BAD6'
                      : 'initial',
                    display: 'flex',
                    borderBottom: '1px solid lightgrey',
                    marginTop: i === 0 ? 5 : undefined,
                  }}
                  onClick={() => handleSelect(notification)}
                >
                  {/* flag block */}
                  <Box sx={{ marginRight: 2 }}>
                    <TurnedIn
                      sx={{
                        color:
                          notification.flag === 'warning'
                            ? 'orange'
                            : notification.flag === 'danger'
                            ? 'red'
                            : notification.flag === 'success'
                            ? 'green'
                            : 'indigo',
                      }}
                    ></TurnedIn>
                  </Box>
                  {/* context block */}
                  <Box sx={{ display: 'block', width: '100%' }}>
                    {/* context header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'block', color: 'GrayText' }}>
                        <Typography sx={{ fontWeight: 600 }} variant="body1">
                          {notification?.context}
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                          <SupervisedUserCircle sx={{ fontSize: 18 }} />
                          <Typography variant="caption" sx={{ marginLeft: 1 }}>
                            {notification?.createdBy.store}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color={'grey'} fontWeight={600}>
                          {format(new Date(notification?.createdAt), 'dd.LLLL yyyy, HH:mm', {
                            locale: tr,
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    {/* context */}
                    <Box sx={{ color: 'grey' }}>{getNoteByLimit(notification?.note)}</Box>
                  </Box>
                </Box>
              </>
            ))}
      </Box>
      {/* messageDetail */}
      <Box sx={{ width: '65vw', height: '93vh' }}>
        {/* message header */}
        <Box
          sx={{
            paddingBottom: 1,
            paddingLeft: 2,
            borderBottom: '1px solid lightgrey',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {selectedMessage?.flag ? (
              <Box sx={{}}>
                <TurnedIn
                  sx={{
                    color:
                      selectedMessage?.flag === 'warning'
                        ? 'orange'
                        : selectedMessage?.flag === 'danger'
                        ? 'red'
                        : selectedMessage?.flag === 'success'
                        ? 'green'
                        : 'indigo',
                  }}
                ></TurnedIn>
              </Box>
            ) : (
              <Box sx={{ paddingBottom: 1 }}>📑 Secili mesaj yok</Box>
            )}
            <Typography variant="h6" paddingLeft={2}>
              {selectedMessage?.context}
            </Typography>
          </Box>
          <Box>
            <Searchbar orderId={orderId} setOrderId={setOrderId} />
          </Box>
        </Box>
        {/* message by admin*/}
        <Box
          sx={{
            height: '55%',
            overflowY: filteredMessage?.answers?.length > 0 ? 'scroll' : 'initial',
            padding: 2,
            marginBottom: 1,
          }}
        >
          {filteredMessage?.answers?.length > 0 ? (
            filteredMessage.answers?.map((x) => (
              <>
                <Box sx={{ display: 'flex', paddingBottom: 3 }}>
                  <Box>
                    <Avatar>{getAdminNameWithAvatar(x.answeredBy?.username)}</Avatar>
                  </Box>
                  <Box sx={{ display: 'block', marginLeft: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ fontWeight: 600, marginRight: 2 }}>
                        {x.answeredBy?.username}
                      </Typography>
                      <Typography color={'gray'}>
                        {format(new Date(x.createdAt), 'dd/MM/yyy, HH:mm')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>{x.answer}</Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            ))
          ) : filteredMessage?.answers?.length === 0 ? (
            <>📢 Bu bildirime ait bir cevap bulunamadi</>
          ) : filteredMessage === undefined ? (
            <></>
          ) : (
            <CircularProgress />
          )}
        </Box>

        {/* message by user */}
        {selectedMessage && (
          <Box
            sx={{
              height: '35%',
              backgroundColor: 'ButtonHighlight',
              borderRadius: 4,
              padding: 4,
              margin: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex' }}>
                <AnnouncementRounded></AnnouncementRounded>
                <Typography marginLeft={1} fontSize={18} fontWeight={600}>
                  {selectedMessage?.createdBy.username}
                </Typography>
              </Box>
              <Tooltip
                title={
                  _.isEmpty(orderId)
                    ? 'Siparis numarasini kopyala'
                    : 'Siparis numarasi kopyalandi ✔'
                }
              >
                <Box
                  sx={{ ':hover': { cursor: _.isEmpty(orderId) ? 'pointer' : 'default' } }}
                  onClick={() => copyOrderId()}
                >
                  <Typography color={'grey'}>
                    <strong>Siparis No:</strong> {selectedMessage?.orderId}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
            <Box sx={{ overflow: 'auto', height: '10dvh', marginTop: 1, marginBottom: 3 }}>
              {`“${selectedMessage?.note}„`}
            </Box>
            {/* <Answwer {...{ order, selectedMessage, User, answer }} /> */}
            {/* </Box> */}
            <Formik
              onSubmit={(values, { resetForm }) => onSave(values, resetForm)}
              initialValues={answer}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form>
                  <Box sx={{ display: 'flex' }}>
                    <Field
                      fullWidth
                      component={MTextField}
                      type="text"
                      id={`answer`}
                      name={`answer`}
                      multiline
                      rows={4}
                      variant="filled"
                      sx={{ overflow: 'auto' }}
                      placeholder={'Bir cevap girin...'}
                      onChange={(e) => {
                        setFieldValue('answer', e.target.value);
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box
                      onClick={() => {
                        setOpenEmojiToolbar(!openEmojiToolbar);
                      }}
                      sx={{ alignSelf: 'center', cursor: 'pointer', color: 'grey' }}
                    >
                      <EmojiEmotions color="action" />
                    </Box>
                    <Button disabled={isSubmitting} type={'submit'}>
                      <Send color="action" />
                    </Button>
                  </Box>
                  {openEmojiToolbar && (
                    <Box sx={{ position: 'absolute', marginTop: '-371px', zIndex: 1, right: 0 }}>
                      <Picker
                        onEmojiSelect={(data) => {
                          const message = document.getElementById('answer').value;
                          const selectionStart = document.getElementById('answer').selectionStart;
                          const modifiedAnswer =
                            message?.slice(0, selectionStart) +
                            data.native +
                            message?.slice(selectionStart);
                          setFieldValue('answer', modifiedAnswer);
                          setOpenEmojiToolbar(false);
                        }}
                      />
                    </Box>
                  )}
                </Form>
              )}
            </Formik>{' '}
          </Box>
        )}
      </Box>
    </Box>
  );
}

Messages.layout = FullLayout;

function CheckboxGroup({ messageSetting, setMessageSetting, groupName }) {
  const handleSelect = (e, x, i) => {
    if (groupName === 'flags') {
      messageSetting.checkedFlags[i].checked = e.target.checked;
      setMessageSetting((prev) => {
        return { ...prev, messageSetting };
      });
    }

    if (groupName === 'creators') {
      messageSetting.checkedCreators[i].checked = e.target.checked;
      setMessageSetting((prev) => {
        return { ...prev, messageSetting };
      });
    }
  };

  return (
    <>
      {groupName === 'flags'
        ? messageSetting?.checkedFlags?.map((x, i) => (
            <>
              <Box sx={{ display: 'block' }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        key={i}
                        checked={x.checked}
                        onChange={(e) => handleSelect(e, x, i)}
                      />
                    }
                    label={x.label + ` (${x.ids})`}
                  />
                </FormGroup>
              </Box>
            </>
          ))
        : messageSetting?.checkedCreators?.map((x, i) => (
            <>
              <Box sx={{ display: 'block' }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        key={i}
                        checked={x.checked}
                        onChange={(e) => handleSelect(e, x, i)}
                      />
                    }
                    label={x.label}
                  />
                </FormGroup>
              </Box>
            </>
          ))}
    </>
  );
}

const getCheckedFlags = (notifications) => {
  const dangers = [];
  const warnings = [];
  const infos = [];
  const successes = [];
  const users = [];

  notifications?.map((x) => {
    if (x.flag === 'danger') {
      dangers.push(x);
    }
    if (x.flag === 'warning') {
      warnings.push(x);
    }
    if (x.flag === 'info') {
      infos.push(x);
    }
    if (x.flag === 'success') {
      successes.push(x);
    }
    if (users?.find((a) => a.username === x.createdBy.username) === undefined) {
      users.push({ username: x.createdBy.username, id: x.createdBy._id });
    }
  });

  const checkedFlags = [
    { value: 'danger', label: 'kritik', ids: dangers.length, checked: true },
    { value: 'success', label: 'basarili', ids: successes.length, checked: true },
    { value: 'info', label: 'bilgilendirme', ids: infos.length, checked: true },
    { value: 'warning', label: 'uyari', ids: warnings.length, checked: true },
  ];

  // second way to merge by unique array
  // const userSet = new Set(users);
  // const uniqueUsers = [...userSet];

  const checkedCreators = users.map((user) => ({
    label: user.username,
    id: user.id,
    checked: true,
  }));

  return { checkedFlags, checkedCreators };
};

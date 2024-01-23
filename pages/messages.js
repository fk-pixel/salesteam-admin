import React from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { TextField as MTextField } from 'formik-mui';
import { format } from 'date-fns';
import tr from 'date-fns/locale/index.js';
import { Box, Avatar, Typography, Button } from '@mui/material';
import { AnnouncementRounded, Send, SupervisedUserCircle, TurnedIn } from '@mui/icons-material';
import { client } from '../sanity/utils/client';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Field, Form, Formik } from 'formik';

import { usePortalContext } from '../src/common/Portal/portal';
import { updateNotifications } from '../sanity/utils/order-utils';
import FullLayout from '../src/layouts/FullLayout';
import { getAdminNameWithAvatar } from '../src/utils/DashboardUtil';
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

  function handleSelect(note) {
    const matchedNote = initialNotes.map((x) =>
      _.isEqual(x, note) ? { ...x, viewedNotification: true, selectedMessage: true } : x,
    );
    setNotifications(matchedNote);
    const findSelectedNote = notifications?.find((x) => x.notificationId === note.notificationId);
    setSelectedMessage(findSelectedNote);
  }

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
                answeredBy: { _type: 'reference', _ref: answer.id },
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
    (n) => n.notificationId === selectedMessage.notificationId,
  )[0];

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
            paddingBottom: 1,
            borderBottom: '1px solid lightgrey',
            position: 'fixed',
            minWidth: '31%',
            backgroundColor: '#f2f7f8', //kirli beyaz
          }}
        >
          <Typography variant="h6" sx={{ lineHeight: 1.5 }}>
            Mesajlarim
          </Typography>
        </Box>
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
                  onClick={() => handleSelect(initialNote)}
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
                    backgroundColor: notification.selectedMessage ? '#D5E4F9' : '', //'#82bc0040',
                    borderLeft: notification.selectedMessage ? '6px solid #91BAD6' : 'initial',
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
      <Box sx={{ width: '65dvw', height: '93dvh' }}>
        {/* message header */}
        <Box
          sx={{
            paddingBottom: 1,
            paddingLeft: 2,
            borderBottom: '1px solid lightgrey',
            display: 'flex',
          }}
        >
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
        {/* message by admin*/}
        <Box sx={{ height: '62%', padding: 2, marginBottom: 1 }}>
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
          ) : (
            <>📢 Bu bildirime ait bir cevap bulunamadi</>
          )}
        </Box>

        {/* message by user */}
        {selectedMessage && (
          <Box
            sx={{
              height: '30%',
              backgroundColor: 'ButtonHighlight',
              borderRadius: 4,
              padding: 4,
              margin: 2,
            }}
          >
            <Box
              sx={
                {
                  /* maxHeight: '5dvh' */
                }
              }
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <AnnouncementRounded></AnnouncementRounded>
                  <Typography marginLeft={1} fontSize={18} fontWeight={600}>
                    {selectedMessage?.createdBy.username}
                  </Typography>
                </Box>
                <Box>
                  <Typography color={'grey'}>
                    <strong>Siparis No:</strong> {selectedMessage?.orderId}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ overflow: 'auto', height: '8dvh', marginTop: 1 }}
              >{`“${selectedMessage?.note}„`}</Box>
            </Box>
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
                      maxRows={4}
                      placeholder={'Bir cevap girin...'}
                      onChange={(e) => {
                        setFieldValue('answer', e.target.value);
                      }}
                    />
                    <Box sx={{ alignSelf: 'center', paddingLeft: 1 }}>
                      <Button disabled={isSubmitting} type={'submit'}>
                        <Send />
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        )}
      </Box>
    </Box>
  );
}

Messages.layout = FullLayout;

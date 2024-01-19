import { produce } from 'immer';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import getOrders from '../pages/api/getOrder';
import { getSalesInfos } from './utils/DataUtil';
// import { usePortalContext } from './common/Portal/portal';

//const { User } = usePortalContext();

// const userQuery = `*[_type == "order" && createdBy._ref == '${User._id}'] | order(_createdAt desc){
//     _id,
//     _createdAt,
//     products[] {
//       productFile,
//       productName,
//       productWidth,
//       productHeight,
//       productPiece,
//       productMainType,
//       productSubType,
//       productCargoType,
//     },
//     gifts[] {
//       giftFile,
//       giftName,
//       giftWidth,
//       giftHeight,
//       giftPiece,
//       giftMainType,
//       giftSubType,
//       giftCargoType,
//     },
//     cost,
//     packagingCost,
//     shippingCost,
//     description,
//     cargoLabel,
//     price,
//     status,
//     createdBy-> {_id, username, email, store},
//     notifications[] {
//       notificationId,
//       createdAt,
//       context,
//       note,
//       noteToAdmin[] -> {_id, username, email, store},
//       flag,
//       answers[] {
//         answerId,
//         createdAt,
//         answer,
//         answeredBy-> {_id, username, email, store}
//         }
//     }
//   }`;

// const adminQuery = `*[_type == "order"] | order(_createdAt desc){
//     _id,
//     _createdAt,
//     products[] {
//       productFile,
//       productName,
//       productWidth,
//       productHeight,
//       productPiece,
//       productMainType,
//       productSubType,
//       productCargoType,
//     },
//     gifts[] {
//       giftFile,
//       giftName,
//       giftWidth,
//       giftHeight,
//       giftPiece,
//       giftMainType,
//       giftSubType,
//       giftCargoType,
//     },
//     cost,
//     packagingCost,
//     shippingCost,
//     description,
//     cargoLabel,
//     price,
//     status,
//     createdBy-> {_id, username, email, store},
//     notifications[] {
//       notificationId,
//       createdAt,
//       context,
//       note,
//       noteToAdmin[] -> {_id, username, email, store},
//       flag,
//       answers[] {
//         answerId,
//         createdAt,
//         answer,
//         answeredBy-> {_id, username, email, store}
//         }
//     }
//   }`;

const store = (set, get) => ({
  loading: false,
  user: null,
  orders: [],
  salesInfos: null,
  dateRange: null, //
  setDateRange: (newState) => {
    set({ dateRange: newState });
  },
  showDateSelector: true,
  getOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getOrders();
      set({
        orders: data.orders,
        loading: false,
        user: data.user,
        salesInfos: getSalesInfos(get().orders, get().dateRange),
      });
    } catch (error) {
      set({ loading: false, error });
    }
  },
  //   deleteTask: (title) =>
  //     set((store) => ({
  //       tasks: store.tasks.filter((task) => task.title !== title),
  //     })),
  //   setDraggedTask: (title) => set({ draggedTask: title }),
  //   moveTask: (title, state) =>
  //     set((store) => ({
  //       tasks: store.tasks.map((task) => (task.title === title ? { title, state } : task)),
  //     })),
});

// const log = (config) => (set, get, api) =>
//   config(
//     (...args) => {
//       console.log(args);
//       set(...args);
//     },
//     get,
//     api,
//   );

// export const useStore = create(
//   subscribeWithSelector(log(persist(devtools(store), { name: 'store' }))),
// );

// useStore.subscribe(
//   (store) => store.tasks,
//   (newTasks, prevTasks) => {
//     useStore.setState({
//       tasksInOngoing: newTasks.filter((task) => task.state === 'ONGOING').length,
//     });
//   },
// );

import React from 'react';
// import { useRouter } from 'next/router';
import { client } from '../../../sanity/utils/client';

const PortalContext = React.createContext({
  User: {},
  // Orders: [],
});

export function usePortalContext() {
  return React.useContext(PortalContext);
}

export default function Portal({ content }) {
  // const router = useRouter();

  const [userData, setUserData] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState({});
  // const [ordersByUser, setOrdersByUser] = React.useState([]);

  React.useEffect(() => {
    const ISSERVER = typeof window === 'undefined';

    if (!ISSERVER) {
      setUserData(JSON.parse(localStorage.getItem('userData')));
      if (userData !== null || userData !== undefined) {
        setLoggedIn(true);
      }
    }

    if (loggedIn) {
      const fetchUserData = async () => {
        const data1 = await fetchUser();
        if (data1 !== undefined) {
          setUser(data1[0]);
          // const data2 = await getOrdersByUser(data1[0]);
          // setOrdersByUser(data2);
        }
      };

      fetchUserData();
      //fetchOrdersData();
    }

    if (!loggedIn) {
      setUser({});
      // setOrdersByUser([]);
    }
  }, [userData?.id]);

  const userID = userData?.id;
  // const loggedIn = userID !== undefined ? true : false;

  // React.useEffect(() => {
  //   if (userID) {
  //     setLoggedIn(true);
  //   }

  //   if (loggedIn) {
  //     Promise.resolve(fetchUser()).then((res) => setUser(res[0]));
  //   }

  //   if (user) {
  //     Promise.resolve(getOrdersByUser()).then((res) => setOrdersByUser(res));
  //   }

  //   if (!loggedIn) {
  //     setUser({});
  //     setOrdersByUser([]);
  //   }
  // }, []);

  const fetchUser = async () => {
    const loggedUser = await client.fetch(`*[_type == "user" && _id == '${userID}']{
      _id,
      _createdAt,
      email,
      username,
      store,
      requestForAdmin,
      role,
      profileImage,
      url 
    }`);

    return loggedUser;
  };

  // if (loggedIn) {
  //   const t = fetchUser;
  //   const z = getOrdersByUser;

  //   console.log('t', t, 'z', z);
  // }

  // React.useEffect(() => {
  //   // const ISSERVER = typeof window === 'undefined';

  //   // if (!ISSERVER) {
  //   //   const userData = JSON.parse(localStorage.getItem('userData'));

  //   //   if (userData) {
  //   //     setLoggedData(userData);
  //   //   }
  //   // }

  //   if (loggedIn === false) {
  //     router.push('/auth/login');
  //     content = <h1>Redirecting to Login ...</h1>;
  //   }
  //   if (loggedIn === true) {
  //     // if (router.asPath === '/studio') {
  //     //   router.push('/studio');
  //     //   content = <h1>Redirecting to API Studio ...</h1>;
  //     // } else {
  //     //   router.push('/dashboard');
  //     //   content = <h1>Redirecting to Dashboard ...</h1>;
  //     //}
  //     router.push('/dashboard');
  //     content = <h1>Redirecting to Dashboard ...</h1>;
  //   }
  // }, [loggedIn]);

  // React.useCallback(() => {
  //   if (userID && userID !== user._id) {
  //     Promise.resolve(fetchUser()).then((res) => setUser(res[0]));
  //   }
  //   if (userData !== undefined) {
  //     Promise.resolve(getOrdersByUser()).then((res) => setOrdersByUser(res));
  //   }
  // }, [userData]);

  // React.useMemo(() => {
  //   if (userID) {
  //     Promise.resolve(fetchUser()).then((res) => setUser(res[0]));
  //   }
  // }, []);

  // React.useMemo(() => {
  //   if (user) {
  //     Promise.resolve(getOrdersByUser()).then((res) => setOrdersByUser(res));
  //   }
  // }, []);

  return (
    <>
      <PortalContext.Provider
        value={{
          User: user,
          // Orders: ordersByUser,
        }}
      >
        {content}
      </PortalContext.Provider>
    </>
  );
}

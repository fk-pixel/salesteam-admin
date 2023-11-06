export const getRefreshToken = async (accessToken) => {
  const now = new Date();

  const expiration = 1000 * 60 * 60;

  const expirationDate = now.setTime(now.getTime() + expiration);

  console.log('middleware is running!', expirationDate);

  const credentials = {
    https: 'https://accounts.google.com/o/oauth2/auth',
    clientId: process.env.NEXT_PUBLIC_DRIVE_CLIENT_ID,
    redirectUri: 'http://localhost:3000',
    //responseType: 'code',
    scope: 'https://www.googleapis.com/auth/drive',
    //accessType: 'offline',
  };

  const newUri = `${credentials.https}?-client_id=${credentials.clientId}&redirect_uri=${credentials.redirectUri}&response_type=code&scope=${credentials.scope}&access_type=offline`;
  //https://accounts.google.com/o/oauth2/auth?-client_id=719178891505-pkrfmdbdmlcgsptrpn757uf3ci3po7gd.apps.googleusercontent.com&redirect_uri=http://localhost&response_type=code&scope=https://www.googleapis.com/auth/drive&access_type=offline

  // const authRequest = await fetch(newUri, {
  //   method: 'POST',
  //   mode: 'cors',
  //   body: JSON.stringify(data),
  // });

  const json = await authRequest.json();

  console.log('json', json);

  if (now.getMinutes() - expirationDate > 58) {
    console.log('asd');
  }
};

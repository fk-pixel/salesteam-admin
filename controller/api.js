import { toast } from 'react-toastify';

export const sendContactForm = async (data) =>
  fetch('/api/contactWithSeller', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    // if (res.status === 200) {
    //   toast('Mail basariyla gönderildi', {
    //     type: 'success',
    //   }).catch((err) => {
    //     console.error(err);
    //   });
    // }
    if (!res.ok) throw new Error('Failed to send message');

    return res.json();
  });

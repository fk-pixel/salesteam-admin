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
    if (res.ok === true) {
      toast('Mail basariyla gönderildi', {
        type: 'success',
      });
    }
    if (!res.ok) {
      toast(res.error, {
        type: 'error',
      });
    }

    return res.json();
  });

import { render } from '@react-email/render';
import Layout from '../../src/templates/email/Layout';
import nodemailer from 'nodemailer';
import { urlFor } from '../../sanity/utils/client';

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

// const mailOptions = {
//   from: data.sender,
//   to: data.recipient,
//   html: render(Layout(data)),
//   subject: data.context,
// };

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: pass,
  },
});

export default async function handler(req, res) {
  // const data = await req.body;

  if (req.method === 'POST') {
    const data = req.body;
    if (!data) {
      return res.status(400).send({ message: 'Bad request' });
    }

    const template = `<div>
    <h2><strong>Siparis Özeti</strong></h2><br/> 
      <p>Kargo: ${data.createdBy.username} - ${data.createdBy.email} </p><br/>
      <img src={urlFor(data.cargoLabel).url()} /><br/>
      <p>Aciklama: ${data.message}</p>
    </div>`;

    try {
      await transporter.sendMail({
        from: data.sender,
        to: data.recipient,
        // html: render(Layout(data)),
        html: template,
        subject: data.context,
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
  }
  return res.status(400).json({ message: 'Bad request' });
}

// export const mailOptions = {
//   from: email,
//   //to: email,
// };

// const CONTACT_MESSAGE_FIELDS = {
//   name: 'Name',
//   email: 'Email',
//   subject: 'Subject',
//   message: 'Message',
// };

//const generateEmailContent = (data) => {};

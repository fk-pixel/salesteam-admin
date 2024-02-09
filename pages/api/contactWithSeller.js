import nodemailer from 'nodemailer';
import { Mailer } from 'nodemailer-react';

// import { render } from '@react-email/render';

//import Layout from '../../src/templates/email/Layout';
import { Layout2 } from '../../src/templates/email/Layout2';
// import ReactEmail from '../../src/templates/email/ReactEmail';

const email = process.env.NEXT_PUBLIC_EMAIL;
const pass = process.env.NEXT_PUBLIC_EMAIL_PASS;

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

    // const template = `
    // <div>
    // <h2><strong>Siparis Özeti</strong></h2><br/>
    //   <p>Kargo: ${data.createdBy.username} - ${data.createdBy.email} </p><br/>
    //   <img src={urlFor(data.cargoLabel).url()} /><br/>
    //   <p>Aciklama: ${data.message}</p>
    // </div>
    // `;
    //const template = render(<ReactEmail />);

    const template = {
      Layout2,
    };
    const mailer = Mailer(
      {
        transport: transporter,
        defaults: {
          from: { name: 'Shoes E-Commerce', address: '<noreply@ecommerce.com>' },
        },
      },
      template,
    );

    await mailer.send(
      'Layout2',
      { data },
      {
        from: data.sender,
        to: data.recipient,
        subject: data.context,
      },
    );

    // try {
    //   await transporter.sendMail({
    //     from: data.sender,
    //     to: data.recipient,
    //     html: Layout(data),
    //     //html: template,
    //     subject: data.context,
    //   });

    //   return res.status(200).json({ success: true });
    // } catch (err) {
    //   return res.status(400).json({ message: err.message });
    // }
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

// import React from 'react';
// import { Email, Section, Column, Typography, Image, Divider } from '@leopardslab/react-email';
// import { urlFor } from '../../../sanity/utils/client';
// import noImage from '../../assets/images/users/noimage.png';

// export default function Layout(props) {
//   const { products, gifts, message, createdBy, cargoLabel } = props;

//   const logo = {
//     margin: '0 auto',
//   };

//   return (
//     <Email>
//       <Section>
//         <Column>
//           <Typography variant="body1">
//             <strong>Siparis Özeti</strong>{' '}
//           </Typography>
//           <Divider />
//           {products?.length > 0 &&
//             products?.map((x, i) => (
//               <>
//                 <Typography variant="body2">
//                   <strong>Parca({i + 1}): </strong> {x.productName} - {x.productMainType.title}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Ölcü: </strong> {x.productSize} cm
//                 </Typography>
//                 {/* <Typography variant="body2">
//                   <strong>Adet: </strong> {x.productPiece}
//                 </Typography> */}
//                 {/* <Image
//                   src={
//                     x?.productFile.asset
//                       ? urlFor(x?.productFile)?.url()
//                       : x?.productFile !== null || x?.productFile !== undefined
//                       ? URL.createObjectURL(x?.productFile)
//                       : noImage.src
//                   }
//                   layout="fill"
//                   //objectFit="none"
//                   //className={logo}
//                 /> */}
//               </>
//             ))}

//           {gifts?.length > 0 &&
//             gifts?.map((x, i) => (
//               <>
//                 <Typography variant="body2">
//                   <strong>(H) Parca({i + 1}): </strong> {x.giftName} - {x.giftMainType.title}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Ölcü: </strong> {x.giftSize} cm
//                 </Typography>
//                 {/* <Typography variant="body2">
//                   <strong>Adet: </strong> {x.giftPiece}
//                 </Typography> */}
//                 {/* <Image
//                   src={urlFor(x.giftFile).url()}
//                   layout="fill"
//                   //objectFit="none"
//                   //className={logo}
//                 /> */}
//               </>
//             ))}

//           <Typography variant="body2">
//             <strong>Kargo: </strong> {createdBy.username}
//           </Typography>
//           {/* <Image
//             src={urlFor(cargoLabel).url()}
//             layout="fill"
//             //objectFit="none"
//             //className={logo}
//             /> */}

//           {message !== undefined && (
//             <Section>
//               <Divider />
//               <Typography variant="body1">
//                 <strong>Aciklama: </strong>
//               </Typography>
//               <Typography variant="body2">{message}</Typography>
//             </Section>
//           )}
//         </Column>
//       </Section>
//     </Email>
//   );
// }

import React from 'react';
import { Email, Section, Column, Typography, Image, Divider } from '@leopardslab/react-email';
import { urlFor } from '../../../sanity/utils/client';

export default function Layout(props) {
  const { products, message, gifts, createdBy } = props;
  const logo = {
    margin: '0 auto',
  };

  return (
    <Email>
      <Section>
        <Column>
          <Typography variant="body1">
            <strong>Siparis Özeti</strong>{' '}
          </Typography>
          {/* <Divider />
          <Typography variant="body2" style={{ marginTop: 12, marginBottom: 12 }}>
            <strong>Kargo: </strong> {createdBy.username}{' '}
          </Typography>
          {products.length > 0 &&
            products.map((x, i) => (
              <>
                <Typography variant="body2">
                  <strong>Parca({i + 1}): </strong> {x.productName} - {x.productMainType.title}
                </Typography>
                <Typography variant="body2">
                  <strong>Ölcü: </strong> {x.productSize}
                </Typography>
                <Image src={urlFor(x.productFile).url()} width="212" height="312" style={logo} />
              </>
            ))}

          {gifts.length > 0 &&
            gifts.map((x, i) => (
              <>
                <Typography variant="body2">
                  <strong>(H) Parca({i + 1}): </strong> {x.giftName} - {x.giftMainType.title}
                </Typography>
                <Typography variant="body2">
                  <strong>Ölcü: </strong> {x.giftSize}
                </Typography>
                <Image src={urlFor(x.giftFile).url()} width="212" height="312" style={logo} />
              </>
            ))}

          {message !== undefined && (
            <Section style={{ marginTop: 12 }}>
              <Divider />
              <Typography variant="body1">
                <strong>Aciklama: </strong>
              </Typography>
              <Typography variant="body2">{message}</Typography>
            </Section>
          )} */}
        </Column>
      </Section>
    </Email>
  );
}

import React from 'react';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useDrivePicker from 'react-google-drive-picker';

import Icon from '../Icon/Icon';

const useStyles = makeStyles({
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    marginRight: 1,
  },
});

export function getFile(resonseData) {
  gapi.client.drive.files
    .get({
      fileId: resonseData.docs[0].id,
      alt: 'media',
    })
    .then((response) => {
      console.log('fetch response', response.status);

      let binary = response.body;

      let l = binary.length;

      let array = new Uint8Array(l);

      for (var i = 0; i < l; i++) {
        (array[i] = binary), charCodeAt(i);
      }

      let blob = new Blob([array], { type: 'application/octet-stream' });

      return blob;
    });
}

export default function DrivePicker({ productFile, setFieldValue }) {
  const [openPicker, data, authResponse] = useDrivePicker();

  const classes = useStyles();

  const refreshToken =
    '1//04YQiPZPeXlk3CgYIARAAGAQSNgF-L9IrGC9NBX2Of8vWAEJlpunm7br1xuITdPoHHKw4apQ56IIVJyU_qwHEk7cmfDtEzYJ_zg';
  const accessToken =
    'ya29.a0AfB_byAsLTaos7D7hA4wnLlfwqjw8uTnI3ym1VpoADchGiR0bgFETlak82Pewm0d0CrKzvxZq4W1sIRof2m6AkDtxJD0HfhntI0dD7s2MPmS_tlOanJ9LRdb8R9nlXqAuufo5BLcN_l8QPHlTFeHXjdOe3j1wQw_Nu7laCgYKAaESARMSFQGOcNnCiDurlNOK03StnhesUJOIjw0171';

  const convertDriveImageObjectToFile = (driveObject) => {
    const file = new File([driveObject], driveObject.name, {
      type: driveObject.mimeType,
      size: driveObject.sizeBytes,
    });

    return file;
  };

  const handleOpenPicker = () => {
    openPicker({
      clientId: '719178891505-pkrfmdbdmlcgsptrpn757uf3ci3po7gd.apps.googleusercontent.com', //process.env.CLIENT_ID,
      developerKey: 'AIzaSyBZMlr8fDgR77bMA7OlLqqNKyUY48YoUZ8',
      token:
        'ya29.a0AfB_byAsLTaos7D7hA4wnLlfwqjw8uTnI3ym1VpoADchGiR0bgFETlak82Pewm0d0CrKzvxZq4W1sIRof2m6AkDtxJD0HfhntI0dD7s2MPmS_tlOanJ9LRdb8R9nlXqAuufo5BLcN_l8QPHlTFeHXjdOe3j1wQw_Nu7laCgYKAaESARMSFQGOcNnCiDurlNOK03StnhesUJOIjw0171', //process.env.ACCESS_TOKEN,
      viewId: 'DOCS',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        }
        if (data.docs?.length > 0) {
          const file = convertDriveImageObjectToFile(data.docs[0]);
          setFieldValue(productFile, file);
        }
        console.log('data');
      },
    });
  };

  const a = {
    description: '',
    embedUrl:
      'https://drive.google.com/file/d/1v6feuTlRUJ319oiQ27G2pmmJq-SsJUTo/preview?usp=drive_web',
    iconUrl: 'https://drive-thirdparty.googleusercontent.com/16/type/image/png',
    id: '1v6feuTlRUJ319oiQ27G2pmmJq-SsJUTo',
    isShared: true,
    lastEditedUtc: 1698961799621, //
    mimeType: 'image/png', //
    name: 'sat.png', //
    parentId: '0AOlfiPw-oBrxUk9PVA',
    rotation: 0,
    rotationDegree: 0,
    serviceId: 'docs',
    sizeBytes: 10602, //
    type: 'photo',
    url: 'https://drive.google.com/file/d/1v6feuTlRUJ319oiQ27G2pmmJq-SsJUTo/view?usp=drive_web',
  };

  const fs = new FileReader();
  //console.log('fs', fs.readAsArrayBuffer(a));

  const file = {
    lastModified: 1694256691150,
    lastModifiedDate: 'Sat Sep 09 2023 12:51:31 GMT+0200 (Mitteleuropäische Sommerzeit)',
    name: 'sat.png',
    size: 10602,
    type: 'image/png',
    webkitRelativePath: '',
  };

  const newA = new File([a], a.name, { type: a.mimeType, size: a.sizeBytes });
  console.log('file', getFile(file));
  console.log('A', getFile(a));

  return (
    <Button
      sx={{
        height: 40,
        border: '1px solid #d32f2f',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
      size="medium"
      onClick={() => handleOpenPicker()}
    >
      <span className={classes.icon}>
        <Icon name={'googleDrive'} />
      </span>
    </Button>
  );
}

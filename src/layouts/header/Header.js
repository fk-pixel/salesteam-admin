import React from 'react';
import Image from 'next/image';
import {
  Navbar,
  Collapse,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from 'reactstrap';
//import { Stack, Dialog, DialogContent } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import user4 from '../../assets/images/users/user4.jpg';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
//import { useStore } from '../../store';
// import { makeDateRange } from '../../utils/DataUtil';

const Header = ({ open, showSidebar, setShowSidebar }) => {
  const router = useRouter();

  //const { showDateSelector, user, salesInfos, setDateRange } = useStore();

  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  // const [start, setStart] = React.useState();
  // const [end, setEnd] = React.useState();
  // const [openDate, setOpenDate] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handletoggle = () => {
    setIsOpen(!isOpen);
  };

  // const username = JSON.parse(localStorage.getItem('username'));

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('store');
    router.push('/auth/login').then((res) => {
      if (res) {
        toast(<div>Oturum basariyla sonlandirildi</div>, {
          type: 'success',
        });
      }
    });
  };

  // const handleClose = () => {
  //   setOpenDate(false);
  // };

  // if (openDate) {
  //   return (
  //     <>
  //       <LocalizationProvider dateAdapter={AdapterDateFns}>
  //         <Dialog open={openDate} onClose={handleClose} id={'openDateRanger'}>
  //           <DialogContent>
  //             <Stack direction={'row'} spacing={3} sx={{ marginBottom: 6 }}>
  //               <DatePicker
  //                 id={'start'}
  //                 name="start"
  //                 format="dd/MM/yyyy"
  //                 value={start}
  //                 label="Başlangıç tarihi"
  //                 onChange={(val) => setStart(val)}
  //                 KeyboardButtonProps={{
  //                   'aria-label': 'change date',
  //                 }}
  //               />
  //               <DatePicker
  //                 id={'end'}
  //                 name="end"
  //                 format="dd/MM/yyyy"
  //                 value={end}
  //                 label="Bitiş tarihi"
  //                 onChange={(val) => setEnd(val)}
  //                 KeyboardButtonProps={{
  //                   'aria-label': 'change date',
  //                 }}
  //               />
  //             </Stack>
  //           </DialogContent>
  //         </Dialog>
  //       </LocalizationProvider>
  //     </>
  //   );
  // }

  return (
    <Navbar color="dark" dark expand="md">
      {!showSidebar && (
        <div className="d-flex align-items-center">
          <Button
            color="primary"
            onClick={() => setShowSidebar(true)}
            style={{ visibility: showSidebar === false }}
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>
      )}

      <div className="hstack gap-2">
        <Button color="primary" size="sm" className="d-sm-block d-md-none" onClick={handletoggle}>
          {open ? <></> : <i className="bi bi-three-dots-vertical"></i>}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          {/* <NavItem>
            <Link href="/">
              <a className="nav-link">
                Kullanici: {user?.username} | {user?.role}
              </a>
            </Link>
          </NavItem> */}
          {/* <NavItem>
            <Link href="/about">
              <a className="nav-link">About</a>
            </Link>
          </NavItem> */}
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              Tarih Araligi secin
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Son 1 yil</DropdownItem>
              <DropdownItem>Son 1 ay</DropdownItem>
              <DropdownItem>Son 1 hafta</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Yeni aralik sec</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="dark">
            <div style={{ lineHeight: '0px' }}>
              {/* {user.profileImage !== null && (
                <Box sx={{ borderRadius: 6 }}>
                  <Image
                    //alt="profile"
                    src={urlFor(user.profileImage)?.url()}
                    //className="rounded-circle"
                    //layout="fill"
                    // width="30"
                    // height="30"
                  />
                </Box>
              )} */}
              <Image
                src={user4}
                //src={urlFor(user.image)?.url()}
                alt="profile"
                fill={true}
                style={{ position: 'relative' }}
                //src={urlFor(user.image)?.url()} // CALISAN FORMAT
                className="rounded-circle"
                width="30"
                height="30"
              />
              {/* <img key={'profile'} src={urlFor(user?.image)} /> */}
              {/* <Image imageSrc={user.image} /> */}
            </div>
          </DropdownToggle>
          <DropdownMenu>
            {/* <DropdownItem header>Bilgilendirme</DropdownItem> */}
            <DropdownItem>Profilim</DropdownItem>
            <DropdownItem>Profili Düzenle</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => router.push('/messages')}>Mesajlarim</DropdownItem>
            <DropdownItem>Yüklemelerim</DropdownItem>
            <DropdownItem onClick={() => handleLogout()}>Oturumu kapat</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
    </Navbar>
  );
};

export default Header;

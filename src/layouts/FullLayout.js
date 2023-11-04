import React from 'react';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';
// import { useMediaQuery } from '@mui/material';

const FullLayout = ({ children }) => {
  // const isNonLarge = useMediaQuery('(max-width:1200px)');

  const [open, setOpen] = React.useState(false);
  // const [nonLarge, setNonLarge] = React.useState(false);

  // React.useEffect(() => {
  //   if (isNonLarge) {
  //     setNonLarge(isNonLarge);
  //   }
  // }, [isNonLarge]);

  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <main>
      <div className="pageWrapper d-md-block d-lg-flex">
        {/******** Sidebar **********/}
        <aside
          // hidden={isNonLarge}
          className={`sidebarArea shadow bg-white ${!open ? '' : 'showSidebar'}`}
          style={{ zIndex: 10 }}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header
            //user={user}
            // orders={orders}
            showMobmenu={() => showMobilemenu()}
            // nonLarge={nonLarge}
          />

          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;

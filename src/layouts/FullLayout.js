import React from 'react';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';
import { useTheme, useMediaQuery } from '@mui/material';

const FullLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = React.useState(false);

  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  const pc = !tablet && !mobile ? true : false;

  React.useEffect(() => {
    if (pc) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [pc]);

  return (
    <main>
      <div className="pageWrapper d-md-block d-lg-flex">
        {/******** Sidebar **********/}
        {showSidebar && (
          <aside
            className={`sidebarArea shadow bg-white showSidebar`}
            style={{ zIndex: 2, position: 'absolute', height: '-webkit-fill-available' }}
          >
            <Sidebar setShowSidebar={setShowSidebar} />
          </aside>
        )}
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

          {/********Middle Content**********/}
          <Container fluid className="p-4 wrapper">
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;

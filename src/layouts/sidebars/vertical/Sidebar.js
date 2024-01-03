import { Button, Nav, NavItem } from 'reactstrap';
import Logo from '../../logo/Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const navigation = [
  {
    title: 'Ana Sayfa',
    href: '/dashboard',
    icon: 'bi bi-speedometer2',
  },
  {
    title: 'Form',
    href: '/order',
    icon: 'bi bi-textarea-resize',
  },
  {
    title: 'Profil',
    href: '/profile',
    icon: 'bi bi-people',
  },
];

const Sidebar = ({ showMobilemenu }) => {
  let router = useRouter();

  const location = router.pathname;

  return (
    // <div className="p-3" style={isNonLarge ? mediumStyle : isMobile ? mobileStyle : undefined}>
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <Button
          size="sm"
          className="ms-auto d-lg-none"
          style={{ marginTop: -124, marginRight: -10 }}
          onClick={showMobilemenu}
        >
          <ArrowBack />
        </Button>
      </div>
      <div className="pt-4 mt-2">
        <Divider />
        <Nav vertical className="sidebarNav" style={{ overflowY: 'auto' }}>
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link href={navi.href}>
                <a
                  className={
                    location === navi.href
                      ? 'text-primary nav-link py-3'
                      : 'nav-link text-secondary py-3'
                  }
                >
                  <i className={navi.icon}></i>
                  <span className="ms-3 d-inline-block">{navi.title}</span>
                </a>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;

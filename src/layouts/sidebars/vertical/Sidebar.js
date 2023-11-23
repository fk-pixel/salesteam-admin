import { Button, Nav, NavItem } from 'reactstrap';
import Logo from '../../logo/Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Divider } from '@mui/material';

const navigation = [
  {
    title: 'Ana Sayfa',
    href: '/dashboard',
    icon: 'bi bi-speedometer2',
  },
  // {
  //   title: "Alert",
  //   href: "/ui/alerts",
  //   icon: "bi bi-bell",
  // },
  // {
  //   title: "Badges",
  //   href: "/ui/badges",
  //   icon: "bi bi-patch-check",
  // },
  // {
  //   title: "Buttons",
  //   href: "/ui/buttons",
  //   icon: "bi bi-hdd-stack",
  // },
  // {
  //   title: "Cards",
  //   href: "/ui/cards",
  //   icon: "bi bi-card-text",
  // },
  // {
  //   title: "Grid",
  //   href: "/ui/grid",
  //   icon: "bi bi-columns",
  // },
  // {
  //   title: "Table",
  //   href: "/ui/tables",
  //   icon: "bi bi-layout-split",
  // },
  {
    title: 'Form',
    href: '/order',
    icon: 'bi bi-textarea-resize',
  },
  // {
  //   title: 'Breadcrumbs',
  //   href: '/ui/breadcrumbs',
  //   icon: 'bi bi-link',
  // },
  {
    title: 'Profil',
    href: '/profile',
    icon: 'bi bi-people',
  },
];

const Sidebar = ({ showMobilemenu }) => {
  // const isNonLarge = useMediaQuery('(max-width:1200px)');

  let router = useRouter();
  const location = router.pathname;

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <Button close size="sm" className="ms-auto d-lg-none" onClick={showMobilemenu}></Button>
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
          {/* <Button
            color="secondary"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/monster-next-js-free-admin-template/"
          >
            Download Free
          </Button>
          <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://wrappixel.com/templates/monster-react-admin/?ref=33"
          >
            Upgrade To Pro
          </Button> */}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;

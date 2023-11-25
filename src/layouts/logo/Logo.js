// import LogoDark from '../../assets/images/logos/sales_team.png';
import LogoDark from '../../assets/images/logos/sat.png';
import Image from 'next/image';

const Logo = () => {
  return <Image src={LogoDark} priority={true} alt="logo" className={'w-25'} />;
};

export default Logo;

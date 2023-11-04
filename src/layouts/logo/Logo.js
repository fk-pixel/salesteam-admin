// import LogoDark from '../../assets/images/logos/sales_team.png';
import LogoDark from '../../assets/images/logos/sat.png';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <a>
        <Image src={LogoDark} priority={true} alt="logo" className={'w-25'} />
      </a>
    </Link>
  );
};

export default Logo;

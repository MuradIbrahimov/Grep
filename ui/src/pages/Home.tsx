import type { FC } from 'react';
import { Navbar, Footer,Main } from '../components';

const Home: FC = () => {
  return (
    <>
      <Navbar />
      <Main/>
      <Footer/>
    </>
  )
}

export default Home;
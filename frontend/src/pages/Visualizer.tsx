import type { FC } from 'react';
import { Navbar, Footer } from '../components';
import RegexASTVisualizer from '../components/Visualizer/RegexASTVisualizer';

const Home: FC = () => {
  return (
    <>
      <Navbar />
      <RegexASTVisualizer/>
      <Footer/>
    </>
  )
}

export default Home;
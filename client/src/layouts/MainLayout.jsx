import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <br></br>
      <Outlet />
      <ToastContainer />
      <Footer/>
      
    </>
  );
};
export default MainLayout;
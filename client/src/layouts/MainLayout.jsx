import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header onSearch={handleSearch}/>
      <br></br>
      <Outlet context={{ searchQuery }}/>
      <ToastContainer />
      <Footer/>
      
    </>
  );
};
export default MainLayout;
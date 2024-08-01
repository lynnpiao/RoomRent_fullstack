import { React, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import Login from './Login';
import ApartmentSection from '../components/ApartmentSection';
import RoomSection from '../components/RoomSection';


const HomePage = () => {
  const { authState } = useContext(AuthContext);


  const navigate = useNavigate();

  const navigateToLikedRooms = () => {
    navigate('/mylikes');
  }

  const navigateToManageApartments = () => {
    navigate('/myapartments');
  }


  return (
    <>

      <ApartmentSection isHome={true} />
      <RoomSection isHome={true} />

      <div className="bg-white p-4 font-[sans-serif]">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">
          More
        </h4>

        {authState.status ? (
          <>
            {authState.role === 'tenant' ?
              (<div
                className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Liked Rooms</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">Let us explore the rooms you like</p>
                  <button type="button" onClick={navigateToLikedRooms}
                    className="mt-4 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700">View</button>
                </div>
              </div>) : (
                <div
                  className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">Manage Apartments</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">Let us modify the apartments you manage</p>
                    <button type="button" onClick={navigateToManageApartments}
                      className="mt-4 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700">View</button>
                  </div>
                </div>

              )}
          </>
        ) : (
          <Login />
        )}
      </div>
    </>
  )
}

export default HomePage
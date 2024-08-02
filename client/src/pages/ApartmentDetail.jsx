import {React, useContext} from 'react'
import { AuthContext } from '../utils/AuthContext';
import ApartmentContentSection from '../components/ApartmentContentSection';
import AmenitySection from '../components/AmenitySection';
import ApartmentRoomList from '../components/ApartmentRoomList';
import { useLoaderData } from 'react-router-dom';

import axios from 'axios';

const ApartmentDetail = () => {
  const apartmentInfo = useLoaderData();
  const { authState } = useContext(AuthContext);
  let isManageable = apartmentInfo.apartment.managerEmails.includes(authState.email);


//   console.log(apartmentInfo.apartment);
  console.log(apartmentInfo.rooms);
    
  return (
    <>
    <ApartmentContentSection apartment={apartmentInfo.apartment} isManageable={isManageable}/>
    <ApartmentRoomList rooms={apartmentInfo.rooms} isManageable={isManageable}/>
    <AmenitySection amenities={apartmentInfo.amenities} type={'community'} isManageable={isManageable}/></>
  )
}

const apartmentLoader = async ({ params }) => {

    // console.log(params.id);
    const base_url = import.meta.env.VITE_API_URL;
  
    try {
        const [apartmentResponse, amenitiesResponse, roomsResponse] = await Promise.all([
            axios.get(`${base_url}/apartments/${params.id}`),
            axios.get(`${base_url}/amenities/apartment/${params.id}`),
            axios.get(`${base_url}/rooms/apartment/${params.id}`)
          ]);
          
          return {
            apartment: apartmentResponse.data,
            amenities: amenitiesResponse.data,
            rooms: roomsResponse.data,
          };

    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // or return an appropriate error message or status
      }
      throw error; // rethrow other errors to be handled globally or by the component
    }
  };


export {ApartmentDetail as default, apartmentLoader}
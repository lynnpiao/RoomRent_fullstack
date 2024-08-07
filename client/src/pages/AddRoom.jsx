import React from 'react'
import { AuthContext } from '../utils/AuthContext'
import { useContext } from 'react'
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useCookies } from "react-cookie";
import axios from "axios";
import RoomForm from '../components/RoomForm';


const AddRoom = () => {
  const base_url = import.meta.env.VITE_API_URL;
  const { authState } = useContext(AuthContext);
//   const [cookies,] = useCookies(['accessToken']);
//  const accessToken = cookies.accessToken;

  const navigate = useNavigate();

  let {id} = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isManageable = queryParams.get('isManageable') === 'true';

  // Create New Room
  const createRoom = ({ newRoom, selectedAmenities }) => {
    const roomAmenities = selectedAmenities.map(amenity => amenity.id);

    console.log(selectedAmenities);
    console.log(roomAmenities);

    axios.post(`${base_url}/rooms`, newRoom, {
        withCredentials: true, 
      })
    .then(roomResponse => {
        
        const createdRoom = roomResponse.data.createdRoom; // Ensure you access the correct property
        const roomId = createdRoom.id;
        console.log('Room created:', createdRoom);

        // Create Amenities
        console.log(selectedAmenities);
        if (selectedAmenities.length > 0) {
            axios.post(`${base_url}/amenities/room/${roomId}`, roomAmenities, {
                withCredentials: true, // Make sure cookies are sent with the request
              }
                )
            .then(amenitiesResponse => {
                const createdAmenities = amenitiesResponse.data;
                console.log('Amenities created:', createdAmenities);
            })
            .catch(error => {
                console.error(`Error creating amenities for the room of ${roomId}`, error);
                toast.error(`Failed to create amenities for the room of ${roomId}. Please try again.`);
            });
        } else {
            console.log('No amenities added in room');
        }
        
        toast.success('Successfully created room');
        navigate(`/apartmentdetails/${id}`);

    })
    .catch(error => {
        console.error('Error creating main part of the room:', error);
        toast.error('Failed to create main part of the room. Please try again.');
    });
};



  return (
    <>
    <RoomForm RoomSubmit={createRoom} category='apartment' isManageable={isManageable} />
    </>
  )
}

export default AddRoom
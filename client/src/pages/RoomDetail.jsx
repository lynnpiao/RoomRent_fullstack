import { React, useContext } from 'react'
import { AuthContext } from '../utils/AuthContext';
import { useLoaderData, useNavigate} from 'react-router-dom';
import RoomContentSection from '../components/RoomContentSection';
import AmenitySection from '../components/AmenitySection';
import { useCookies } from "react-cookie";
import axios from 'axios';
import { toast } from 'react-toastify';

const RoomDetail = () => {
    
    const base_url = import.meta.env.VITE_API_URL;

    const roomInfo = useLoaderData();
    // console.log(roomInfo);
    const { authState } = useContext(AuthContext);
    let isManageable = roomInfo.room.managerEmails.includes(authState.email);
    const [cookies,] = useCookies(['accessToken']);
    const accessToken = cookies.accessToken;
    const navigate = useNavigate();

    const deleteRoom = async (roomId) => {

        if (!isManageable) {
            console.log("User is not authenticated. Delete Room blocked.");
            return;
        }
        // Display confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this room?');
        if (!confirmDelete) {
            return; // If user cancels, exit the function
          }
        // delete
        try {
            const response = await axios.delete(`${base_url}/rooms/${roomId}`, 
              {
                withCredentials: true, // Make sure cookies are sent with the request
              });
            
            toast.success('Deleted amenity successfully');
            navigate('/');

        } catch (error) {
            console.error('Error deleting amenity:', error);
            // toast.error('Failed to delete amenity');
        }
    
    };

    return (
        <>
            <RoomContentSection room={roomInfo.room} isManageable={isManageable} />
            <br></br>
            {roomInfo.amenities ? (<AmenitySection amenities={roomInfo.amenities} type={'apartment'} isManageable={isManageable} />)
                : (
                    <></>
                )}

            {isManageable && (
               <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded"
                        onClick={() => deleteRoom(roomInfo.room.id)}
                    >
                        Delete the Room
                    </button>
            </div>
            )}
            <br></br>
        </>
    )
}


const roomLoader = async ({ params }) => {

    // console.log(params.id);
    const base_url = import.meta.env.VITE_API_URL;

    try {
        const [roomResponse, amenitiesResponse] = await Promise.all([
            axios.get(`${base_url}/rooms/${params.id}`),
            axios.get(`${base_url}/amenities/room/${params.id}`).catch(error => {
                if (error.response && error.response.status === 404) {
                    return { status: 404, data: null }; // Return a 404 status with null data
                }
                throw error; // Rethrow other errors
            }),
        ]);
        // console.log(roomResponse);
        // console.log(amenitiesResponse);

        return {
            room: roomResponse.data,
            amenities: amenitiesResponse.status === 404 ? null : amenitiesResponse.data,
        };

    } catch (error) {

        if (error.response && error.response.status === 404) {
            return null; // or return an appropriate error message or status
        }
        throw error; // rethrow other errors to be handled globally or by the component
    }
};

export { RoomDetail as default, roomLoader }
import { React, useState, useEffect, useContext } from 'react';
import RoomCard from '../components/RoomCard';
import { toast } from 'react-toastify';
import { AuthContext } from "../utils/AuthContext";
import axios from 'axios';


const LikedRoom = () => {
    const isHome = false;
    const base_url = import.meta.env.VITE_API_URL;
    const [rooms, setRooms] = useState([]);
    const { authState } = useContext(AuthContext);
    const [user, setUser] = useState({});
    

    useEffect(() => {
        if (authState && authState.id) {
            setUser({ id: authState.id });
        }
    }, [authState]);

    const fetchRoomList = async () => {

        const userId = user.id || localStorage.getItem('id');
        console.log(userId);

        const url =  `${base_url}/rooms/user/${userId }` ;

        try {
            // console.log(url);
            const response = await axios.get(url);
            const data = await response.data;

            setRooms(data);// Ensure this matches the shape of your data
        } catch (error) {

            if (error.response && error.response.status === 404) {
                console.log('No rooms found.');
                setRooms([]);
                return null; // or return an appropriate error message or status
            }

            console.error('Error loading rooms:', error);
            toast.error('Failed to fetch rooms');
        }
    };

    
    useEffect(() => {
        fetchRoomList();   
    }, []);

    const handleRoomUpdate = () => {
        fetchRoomList(); // Refresh room list when a room’s like status changes
    };

    return (
        <>
            <div className="bg-white font-sans p-4">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                        My Liked Room
                    </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {rooms.map((room, index) => (
                        <RoomCard
                            key={index}
                            room={room}
                            onLikeChange={handleRoomUpdate} // Pass the callback to RoomCard
                            isHome={isHome}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default LikedRoom
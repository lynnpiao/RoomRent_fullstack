import { React, useState, useEffect, useContext } from 'react';
import { useCookies } from "react-cookie";
import { useParams } from 'react-router-dom';
import RoomCard from './RoomCard';
import { toast } from 'react-toastify';
import { AuthContext } from "../utils/AuthContext";
import PropTypes from "prop-types";
import axios from 'axios';

const RoomSection = ({ isHome = false}) => {

    const base_url = import.meta.env.VITE_API_URL;
    const [rooms, setRooms] = useState([]);
    const { authState } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [viewAll, setViewAll] = useState(false);
    let { roomId } = useParams();

    useEffect(() => {
        if (authState && authState.id) {
            setUser({ id: authState.id });
        }
    }, [authState]);

    const fetchRoomList = async () => {

        const url = isHome ? `${base_url}/rooms` : `${base_url}/rooms/room/${roomId}`;

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

    const fetchAllRoomList = async () => {

        const url = `${base_url}/rooms/all`;

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

            console.error('Error loading all rooms:', error);
            toast.error('Failed to fetch all rooms');
        }
    };

    useEffect(() => {
        if (viewAll) {
            fetchAllRoomList();
        } else {
            fetchRoomList();
        }
    }, [viewAll]);

    const handleToggleView = () => {
        setViewAll(!viewAll);
    };

    const [cookies, setCookies] = useCookies(['accessToken']);
    const accessToken = cookies.accessToken;

    const deleteRoom = async (id) => {
        // Display confirmation dialog

        if (!authState) {
            console.log("User is not authenticated. Delete Room blocked.");
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this room?');

        if (!confirmDelete) {
            return; // If user cancels, exit the function
        }

        try {
            const response = await axios.delete(`${base_url}/rooms/${id}`, {
                withCredentials: true, // Make sure cookies are sent with the request
            });

            // After deletion, refetch Room List
            await fetchRoomList();// Assuming fetchRoomList updates state
            toast.success('Deleted room successfully');

        } catch (error) {
            console.error('Error deleting room:', error);
            // toast.error('Failed to delete room');
        }
    };

    // console.log(rooms);

    return (
        <>
            <div className="bg-white font-sans p-4">
                {isHome && (
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                        Latest Room
                    </h4>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {rooms.map((room, index) => (
                        <RoomCard
                            key={index}
                            room={room}
                            onDelete={deleteRoom}
                            isHome={isHome}
                        />
                    ))}
                </div>
                
                <button
                    type="button"
                    className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded mt-4"
                    onClick={handleToggleView}
                >
                    {viewAll ? 'View Less' : 'View All'}
                </button>
            </div>
        </>
    )
}


RoomSection.propTypes = {
    isHome: PropTypes.bool.isRequired
};

export default RoomSection
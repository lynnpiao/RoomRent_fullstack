import { React, useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../utils/AuthContext';
import { FaRegEdit, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";
import axios from 'axios';

const RoomCard = ({ room, onDelete, isHome, onLikeChange }) => {

    const base_url = import.meta.env.VITE_API_URL;

    const { authState } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeDetails, setLikeDetails] = useState([]);

    let isManageable = room.managerEmails.includes(authState.email);

    // like function 
    const fetchLikes = async () => {
        try {
            const response = await axios.get(`${base_url}/likes/${room.id}`);
            const { likeCount, likeDetails } = response.data;

            setLikeCount(likeCount);
            setLikeDetails(likeDetails);

            // Determine if the current user has liked this room
            const userLiked = likeDetails.some(like => like.userId === authState.id);
            setLiked(userLiked);

        } catch (error) {
            console.error('Failed to fetch like count:', error);
        }
    };

    useEffect(() => {
        fetchLikes();
    }, [room.id, authState.id]);

    const handleLikeClick = async () => {
        if (authState.role !== 'tenant') {
            window.alert('Only tenants can like rooms.');
            return;
        }

        try {
            const response = await axios.post(`${base_url}/likes`, {
                roomId: room.id,
                userId: authState.id,
            }, {
                withCredentials: true, // Make sure cookies are sent with the request
            });

            const { liked } = response.data;
            setLiked(liked);
            setLikeCount(prevLikeCount => liked ? prevLikeCount + 1 : prevLikeCount - 1);

            if (onLikeChange) {
                onLikeChange(); // Notify parent component about the like change
            }

        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const navigate = useNavigate();

    const handleDeleteClick = () => {
        onDelete(room.id);
    };

    const room_urls = {
        'Studio/1 Bath': "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576/s3/2/20597/theexchange_floorplans_studio_aberdeen_515sqft.jpg",
        '1 Bed/1 Bath': "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576/s3/2/143212/the%20exchange_s1.jpg",
        '2 Bed/2 Bath': "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576/s3/2/143212/the%20exchange_b3.jpg"
    };

    const roomImageUrl = room_urls[room.type];

    return (
        <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full py-6 max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
            <div className="flex items-center gap-2 px-6">
                <h3
                    onClick={() => navigate(`/roomdetails/${room.id}`)}
                    className="text-xl text-gray-800 font-bold flex-1"
                >
                    {room.apartmentName}:{room.aptNumber}
                </h3>

                <div className="flex items-center gap-1">
                    <FaHeart
                        className={liked ? 'text-red-500' : 'text-gray-500'}
                        onClick={handleLikeClick}
                    />
                    <span>{likeCount}</span>
                </div>
            </div>

            <div className="relative w-full h-[200px]">
                <img src={roomImageUrl} className="absolute inset-0 w-full h-full object-contain" alt='room type image' />
            </div>

            <div className="px-6">
                <p className="text-sm text-gray-600 leading-relaxed">Type: {room.type}</p>
                <p className="text-sm text-gray-600 leading-relaxed">Contact: {room.contact_email}</p>

                <div className="mt-8 flex items-center flex-wrap gap-4">
                    <h3 className="text-xl text-gray-800 font-bold flex-1">${room.rentPerMonth} / mo.</h3>
                    {isManageable && !isHome && (
                        <div className="flex space-x-4">
                            <Link to={`/editroom/${room.id}`}>
                                <button
                                    type="button"
                                    className='text-indigo-500 mb-5 hover:text-indigo-600 text-md font-bold'
                                >
                                    <FaRegEdit />
                                </button>
                            </Link>
                            <button
                                onClick={handleDeleteClick}
                                className='text-indigo-500 mb-5 hover:text-indigo-600 text-md font-bold'
                            >
                                <MdDelete />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

RoomCard.propTypes = {
    room: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    isHome: PropTypes.bool.isRequired,
    onLikeChange: PropTypes.func // Add the new prop type
};

export default RoomCard;
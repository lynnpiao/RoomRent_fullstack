import { React, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../utils/AuthContext';
import { FaRegEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";

const RoomCard = ({room, onDelete, isHome}) => {
    const { authState } = useContext(AuthContext);

   
    let isManageable = room.managerEmails.includes(authState.email);

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
        <>
            <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full py-6 max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
                <div className="flex items-center gap-2 px-6">
                    <h3 onClick={() => {
                        navigate(`/roomdetails/${room.id}`);
                    }} className="text-xl text-gray-800 font-bold flex-1">{room.apartmentName}:{room.aptNumber}</h3>

                    <FaHeart />
                </div>

                <div className="relative w-full h-[200px]">
                    {/* static picture for 2b2b, 1b1b,  */}
                    <img src={roomImageUrl} className="absolute inset-0 w-full h-full object-contain" alt='room type image'/>
                </div>

                <div className="px-6">
                    <p className="text-sm text-gray-600 leading-relaxed">Type: {room.type}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Contact: {room.contact_email}</p>

                    <div className="mt-8 flex items-center flex-wrap gap-4">
                        <h3 className="text-xl text-gray-800 font-bold flex-1">${room.rentPerMonth} / mo.</h3>
                        {isManageable && !isHome &&
                            <div className="flex space-x-4">
                                <Link to={`/editroom/${room.id}`}>
                                    <button
                                        type="button"
                                        className='text-indigo-500 mb-5 hover:text-indigo-600 text-md font-bold'>
                                        <FaRegEdit />
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDeleteClick}
                                    className='text-indigo-500 mb-5 hover:text-indigo-600 text-md font-bold'
                                >  <MdDelete />
                                </button>

                            </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

RoomCard.propTypes = {
    room: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    isHome: PropTypes.bool.isRequired
};


export default RoomCard
import { useState } from "react";
import React from 'react'
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ApartmentRoomList = ({ rooms, isManageable }) => {

    const [selectedType, setSelectedType] = useState('All');
    const navigate = useNavigate();


    const hasStudio = rooms.some(room => room.type.toLowerCase().includes('studio'));
    const hasOneBed = rooms.some(room => room.type.toLowerCase().includes('1 bed'));
    const hasTwoBed = rooms.some(room => room.type.toLowerCase().includes('2 bed'));

    const filteredRooms = selectedType === 'All'
        ? rooms
        : rooms.filter(room => room.type.toLowerCase().includes(selectedType.toLowerCase()));


    return (
        <><div className="font-[sans-serif] py-4 mx-auto lg:max-w-7xl sm:max-w-full">
            <h2 className="text-4xl font-extrabold text-gray-800  text-center mb-12">What's Available</h2>

            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${selectedType === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setSelectedType('All')}
                >
                    All
                </button>
                {hasStudio && (
                    <button
                        className={`px-4 py-2 rounded ${selectedType === 'Studio' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setSelectedType('Studio')}
                    > Studio
                    </button>
                )}
                {hasOneBed && (
                    <button
                        className={`px-4 py-2 rounded ${selectedType === '1 Bed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setSelectedType('1 Bed')}
                    > 1 Bed
                    </button>
                )}
                {hasTwoBed && (
                    <button
                        className={`px-4 py-2 rounded ${selectedType === '2 Bed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setSelectedType('2 Bed')}
                    > 2 Bed
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRooms.map((room) => (
                    <div
                        key={room.id}
                        className='bg-gray-50 shadow-md overflow-hidden rounded-lg cursor-pointer hover:-translate-y-2 transition-all relative'
                    >
                        <div className="p-6 bg-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{room.type}</h3>
                                <h4 className="text-lg text-gray-800 font-bold mt-2">${room.rentPerMonth}</h4>
                                <p className="text-gray-600 text-sm mt-2">{room.sqFeet} sqft / Unit No.{room.aptNumber}</p>
                            </div>
                            
                                <button
                                    type="button"
                                    className="ml-4"
                                    onClick={() =>  {navigate(`/roomdetails/${room.id}`);}}
                                >
                                    <MdOutlineNavigateNext size={24} />
                                </button>
                        
                        </div>
                    </div>
                ))}

            </div>
        </div>
        </>
    )
}

export default ApartmentRoomList
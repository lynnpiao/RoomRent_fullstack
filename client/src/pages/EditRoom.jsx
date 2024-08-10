import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../utils/AuthContext';
import { useLoaderData, useNavigate } from 'react-router-dom'
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';


const EditRoom = () => {
    const base_url = import.meta.env.VITE_API_URL;
    const roomInfo = useLoaderData();
    const room = roomInfo.room;
    const existedAmenities = roomInfo.amenities;
    const { authState } = useContext(AuthContext);
    let isManageable = room.managerEmails.includes(authState.email);
    const navigate = useNavigate();

    // room basic information added 
    const [aptNumber, setAptNumber] = useState(null);
    const [sqFeet, setSqFeet] = useState(null);
    const [type, setType] = useState('');
    const [availableDate, setAvailableDate] = useState('');
    const [rentPerMonth, setRentPerMonth] = useState(null);
    const [floor, setFloor] = useState(null);
    const [minLeaseLength, setMinLeaseLength] = useState(null);

    useEffect(() => {
        if (room) {
            setAptNumber(room.room);
            setSqFeet(room.sqFeet);
            setType(room.type);
            setAvailableDate(dayjs(room.availableDate).format('YYYY-MM-DD'));
            setRentPerMonth(room.rentPerMonth);
            setFloor(room.floor);
            setMinLeaseLength(room.minLeaseLength);
        }
    }, [room]);
   
    // room amenities   
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    let category = 'apartment';

    const fetchAmenitiesList = async () => {
        try {
            console.log("Category being sent:", category); // 
            const response = await axios.post(`${base_url}/amenities/bycategory`, { category });
            const data = await response.data;
            console.log(data)
            let filteredAmenities;
            if (!existedAmenities && existedAmenities.length>0){
            filteredAmenities = data.filter(
                amenity => !existedAmenities.some(existing => existing.id === amenity.id)
            );}else{
            filteredAmenities = data;
            }

            setAmenities(filteredAmenities);
        } catch (error) {
            console.error("There was an error fetching amenities!", error);
            toast.error('Failed to fetch amenities');
        }
    };

    useEffect(() => {
        fetchAmenitiesList();
    }, []);

    console.log(room);
    console.log(availableDate)
    console.log(existedAmenities);
    console.log(amenities);


    const handleCheckboxChange = (id) => {
        setSelectedAmenities(prevSelected => {
            if (prevSelected.find(item => item.id === id)) {
                // Remove the amenity if already selected
                return prevSelected.filter(item => item.id !== id);
            } else {
                // Add the amenity if not already selected
                return [...prevSelected, { id }];
            }
        });
    };


    const submitUpdateRoom = (e) => {
        e.preventDefault();
        const formattedAvailableDate = `${availableDate}T00:00:00Z`;
        // update part of the room information
        axios.put(`${base_url}/rooms/${room.id}`,
            {
                availableDate: formattedAvailableDate, 
                rentPerMonth,
                minLeaseLength
            }, {
            withCredentials: true,
        }
        ).then(response => {
            console.log(response);
            navigate(`/roomdetails/${room.id}`)
            toast.success('Update room successfully');

        }).catch(error => {
            console.error('Error updating room:', error);
            toast.error('Failed to update room. Please try again.');
        });

        const roomAmenities = selectedAmenities.map(amenity => amenity.id);

        // add new Amenities to the Room
        if (selectedAmenities.length > 0) {
            axios.post(`${base_url}/amenities/room/${room.id}`, roomAmenities, {
                withCredentials: true,
            })
                .then(amenitiesResponse => {
                    const createdAmenities = amenitiesResponse.data;
                    console.log('Amenities created:', createdAmenities);
                })
                .catch(error => {
                    console.error(`Error creating amenities for the room of ${room.id}`, error);
                    toast.error(`Failed to create amenities for the room of ${room.id}. Please try again.`);
                });
        } else {
            console.log('No amenities added in room');
        }

    }


    return (
        <>
        <form onSubmit={submitUpdateRoom} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className='bg-white rounded-xl shadow-md'>
                <h3 className='text-xl font-bold'> Room Detail</h3>
                <div className="flex w-full">
                    <label htmlFor="aptNumber" className="text-gray-400 w-36 text-sm">
                        Room No.
                    </label>
                    <input
                        type="text"
                        id="aptNumber"
                        value={aptNumber}
                        className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Room No."
                        readOnly
                    />
                </div>

                <div className="flex w-full">
                    <label htmlFor="sqFeet" className="text-gray-400 w-36 text-sm">
                        Square Feet
                    </label>
                    <input
                        type="number"
                        id="sqFeet"
                        value={sqFeet}
                        className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Sqft"
                        readOnly
                    />
                </div>

                <div className="flex w-full">
                    <label htmlFor="floor" className="text-gray-400 w-36 text-sm">
                        Floor
                    </label>
                    <input
                        type="number"
                        id="floor"
                        value={floor}
                        className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Floor"
                        readOnly
                    />
                </div>

                <div className="flex w-full">
                    <label htmlFor="type" className="text-gray-400 w-36 text-sm">
                        Type
                    </label>
                    <input
                        type="text"
                        id="type"
                        value={type}
                        className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Type"
                        readOnly
                    />
                </div>

                <div className="flex w-full">
                    <label htmlFor="availableDate" className="text-gray-400 w-36 text-sm">
                      Available Date
                    </label>
                    <input
                        type="date"
                        id="availableDate"
                        value={availableDate}
                        onChange={e => setAvailableDate(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Available Date"
                        required
                    />
                </div>

                <div className="flex w-full">
                    <label htmlFor="rentPerMonth" className="text-gray-400 w-36 text-sm">
                      RentPerMonth
                    </label>
                    <input
                        type="number"
                        id="rentPerMonth"
                        value={rentPerMonth}
                        onChange={e => setRentPerMonth(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Rent"
                        required
                    />
                </div>
                <div className="flex w-full">
                    <label htmlFor="minLeaseLength" className="text-gray-400 w-36 text-sm">
                        Lease Month
                    </label>
                    <input
                        type="number"
                        id="minLeaseLength"
                        value={minLeaseLength}
                        min={3}
                        onChange={e => setMinLeaseLength(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Minimum  Lease Length"
                        required
                    />
                </div>
            </div>
            <br></br>
            <div className='bg-white rounded-xl shadow-md'>
                <h3 className='text-xl font-bold'>Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* <div className="left"> */}
                    <ul>
                        {amenities.map(amenity => (
                            <li key={amenity.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.some(item => item.id === amenity.id)}
                                        onChange={() => handleCheckboxChange(amenity.id)}
                                    />
                                    {amenity.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <p>Selected amenities: {selectedAmenities.map(item => item.id || item.id).join(', ')}</p>
                </div>

            </div>

            <button
                type="submit"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Submit
            </button>
        </form>
    </>
    )
}

export default EditRoom
import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";


const RoomForm = ({ RoomSubmit, category, isManageable }) => {
    const base_url = import.meta.env.VITE_API_URL;
    let { id } = useParams();

    // room basic information added 
    const [aptNumber, setAptNumber] = useState(null);
    const [sqFeet, setSqFeet] = useState(null);
    const [type, setType] = useState('');
    const [availableDate, setAvailableDate] = useState('');
    const [rentPerMonth, setRentPerMonth] = useState(null);
    const [floor, setFloor] = useState(null);
    const [minLeaseLength, setMinLeaseLength] = useState(null);

    // room amenities   
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const fetchAmenitiesList = async () => {
        try {
            console.log("Category being sent:", category); // 
            const response = await axios.post(`${base_url}/amenities/bycategory`, {category});
            const data = await response.data;
            setAmenities(data);
        } catch (error) {
            console.error("There was an error fetching amenities!", error);
            toast.error('Failed to fetch amenities');
        }
    };

    useEffect(() => {
        fetchAmenitiesList();
    }, []);


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

    const submitCreateRoom = async (e) => {
        e.preventDefault();

        if (!isManageable) {
            console.log("User is not authenticated. Create Room blocked.");
            return;
        }

        // Default time to '00:00:00' and format the date
        const formattedAvailableDate = `${availableDate}T00:00:00Z`;


        const newRoom = {
            aptNumber,
            sqFeet,
            type,
            availableDate:formattedAvailableDate,
            rentPerMonth,
            floor,
            minLeaseLength,
            apartmentId: id
        };

        try {
            console.log(selectedAmenities);
            await RoomSubmit({ newRoom, selectedAmenities });
            console.log("RoomForm Submit Successfully");
        } catch (error) {
            console.log(error);
        }

    };



    return (
        <>
            <form onSubmit={submitCreateRoom} >
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
                            onChange={e => setAptNumber(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Room No."
                            required
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
                            min={0}
                            onChange={e => setSqFeet(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Sqft"
                            required
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
                            min={0}
                            onChange={e => setFloor(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Floor"
                            required
                        />
                    </div>

                    <div className="flex w-full">
                        <label htmlFor="type" className="text-gray-400 w-36 text-sm">
                            Type
                        </label>
                        <select
                            id="type"
                            value={type}
                            required
                            onChange={e => setType(e.target.value)}
                            className="px-2 pt-5 pb-2 bg-white w-full text-sm border-b-2 border-gray-100 focus:border-[#333] outline-none">
                            <option value="" disabled>Select room type</option>
                            <option value="Studio/1 Bath">Studio/1 Bath</option>
                            <option value="1 Bed/1 Bath">1 Bed/1 Bath</option>
                            <option value="2 Bed/2 Bath">2 Bed/2 Bath</option>
                        </select>
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
                            Minimum Lease Month
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
                <Link to={`/apartmentdetails/${id}`}>
                    <button
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Cancel
                    </button>
                </Link>
            </form>
        </>
    )
}


RoomForm.propTypes = {
    RoomSubmit: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    isManageable: PropTypes.bool.isRequired
};

export default RoomForm
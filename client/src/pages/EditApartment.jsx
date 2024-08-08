import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../utils/AuthContext';
import { useLoaderData, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';

const EditApartment = () => {

    const base_url = import.meta.env.VITE_API_URL;
    const apartmentInfo = useLoaderData();
    const apartment = apartmentInfo.apartment;
    const existedAmenities = apartmentInfo.amenities;
    const { authState } = useContext(AuthContext);
    let isManageable = apartmentInfo.apartment.managerEmails.includes(authState.email);
    const navigate = useNavigate();

    // apartment basic information added 
    const [name, setName] = useState(null);
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState(null);
    const [contact_email, setContact_email] = useState('');
    const [contact_phone, setContact_phone] = useState('');

    useEffect(() => {
        if (apartment) {
            setName(apartment.name);
            setDescription(apartment.description);
            setAddress(apartment.address);
            setZipCode(apartment.zipCode);
            setContact_email(apartment.contact_email);
            setContact_phone(apartment.contact_phone);
        }
    }, [apartment]);

    // apartment amenities   
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    let category = 'community';

    const fetchAmenitiesList = async () => {
        try {
            console.log("Category being sent:", category); // 
            const response = await axios.post(`${base_url}/amenities/bycategory`, { category });
            const data = await response.data;
            const filteredAmenities = data.filter(
                amenity => !existedAmenities.some(existing => existing.id === amenity.id)
            );

            setAmenities(filteredAmenities);
        } catch (error) {
            console.error("There was an error fetching amenities!", error);
            toast.error('Failed to fetch amenities');
        }
    };

    useEffect(() => {
        fetchAmenitiesList();
    }, []);

    console.log(apartment);
    console.log(existedAmenities);
    console.log(amenities);

    const validateEmail = (value) => {
        return value.includes('@');
    };

    const validatePhone = (value) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setContact_email(value);
        if (!validateEmail(value)) {
            setErrors(prev => ({ ...prev, contact_email: 'Invalid email' }));
        } else {
            setErrors(prev => ({ ...prev, contact_email: '' }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setContact_phone(value);

        if (!value) {
            // Clear error if phone number is null or empty
            setErrors(prev => ({ ...prev, contact_phone: '' }));
        } else if (!validatePhone(value)) {
            // Set error if phone number is invalid
            setErrors(prev => ({ ...prev, contact_phone: 'Invalid phone number' }));
        } else {
            // Clear error if phone number is valid
            setErrors(prev => ({ ...prev, contact_phone: '' }));
        }
    };


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


    const submitUpdateApartment = (e) => {

        e.preventDefault();


        // update part of the apartment information
        axios.put(`${base_url}/apartments/${apartment.id}`,
            {
                description,
                contact_email,
                contact_phone
            }, {
            withCredentials: true,
        }
        ).then(response => {
            console.log(response);
            navigate(`/apartmentdetails/${apartment.id}`)
            toast.success('Update apartment successfully');

        }).catch(error => {
            console.error('Error updating apartment:', error);
            toast.error('Failed to update apartment. Please try again.');
        });

        const apartmentAmenities = selectedAmenities.map(amenity => amenity.id);

        // add new Amenities to the Apartment
        if (selectedAmenities.length > 0) {
            axios.post(`${base_url}/amenities/apartment/${apartment.id}`, apartmentAmenities, {
                withCredentials: true,
            })
                .then(amenitiesResponse => {
                    const createdAmenities = amenitiesResponse.data;
                    console.log('Amenities created:', createdAmenities);
                })
                .catch(error => {
                    console.error(`Error creating amenities for the apartment of ${apartment.id}`, error);
                    toast.error(`Failed to create amenities for the apartment of ${apartment.id}. Please try again.`);
                });
        } else {
            console.log('No amenities added in apartment');
        }

    }

    return (
        <>
            <form onSubmit={submitUpdateApartment} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
                <div className='bg-white rounded-xl shadow-md'>
                    <h3 className='text-xl font-bold'> Apartment Detail</h3>
                    <div className="flex w-full">
                        <label htmlFor="name" className="text-gray-400 w-36 text-sm">
                            Apartment Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            readOnly
                            className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    <div className="flex w-full">
                        <label htmlFor="description" className="text-gray-400 w-36 text-sm">
                            Description
                        </label>
                        <input
                            type="textarea"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Description"
                            required
                        />
                    </div>

                    <div className="flex w-full">
                        <label htmlFor="address" className="text-gray-400 w-36 text-sm">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            readOnly
                            className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    <div className="flex w-full">
                        <label htmlFor="zipCode" className="text-gray-400 w-36 text-sm">
                            ZipCode
                        </label>
                        <input
                            type="text"
                            id="zipCode"
                            value={zipCode}
                            readOnly
                            className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    <div className="flex w-full">
                        <label htmlFor="contact_email" className="text-gray-400 w-36 text-sm">
                            Contact Email
                        </label>
                        <input
                            type="text"
                            id="contact_email"
                            value={contact_email}
                            onChange={handleEmailChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Contact Email"
                            required
                        />
                    </div>

                    <div className="flex w-full">
                        <label htmlFor="contact_phone" className="text-gray-400 w-36 text-sm">
                            Contact Phone
                        </label>
                        <input
                            type="text"
                            id="contact_phone"
                            value={contact_phone}
                            onChange={handlePhoneChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Contact Phone"
                        />
                    </div>


                </div>
                <br></br>

                <div className='bg-white rounded-xl shadow-md'>
                    <h3 className='text-xl font-bold'>Other Amenities</h3>
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
                    Update
                </button>
                {/* <Link to={`/myapartments`}>
                    <button
                        address="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Cancel
                    </button>
                </Link> */}
            </form>
        </>
    )
}

export default EditApartment
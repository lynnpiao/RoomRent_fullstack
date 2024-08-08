import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";


const ApartmentForm = ({ ApartmentSubmit, category, isManageable }) => {
    const base_url = import.meta.env.VITE_API_URL;
    let { id } = useParams();

    // apartment basic information added 
    const [name, setName] = useState(null);
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState(null);
    const [contact_email, setContact_email] = useState('');
    const [contact_phone, setContact_phone] = useState('');

    const validateZipCode = (value) => {
        const zipCodePattern = /^\d{5}(-\d{4})?$/; // Adjust this pattern as needed for your specific zip code format
        return zipCodePattern.test(value);
      };
    
      const validateEmail = (value) => {
        return value.includes('@');
      };
    
      const validatePhone = (value) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(value);
      };
    
      const handleZipCodeChange = (e) => {
        const value = e.target.value;
        setZipCode(value);
      
        if (!value) {
          // Clear error if zip code is null or empty
          setErrors(prev => ({ ...prev, zipCode: '' }));
        } else if (!validateZipCode(value)) {
          // Set error if zip code is invalid
          setErrors(prev => ({ ...prev, zipCode: 'Invalid zip code' }));
        } else {
          // Clear error if zip code is valid
          setErrors(prev => ({ ...prev, zipCode: '' }));
        }
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


    // apartment amenities   
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

    const submitCreateApartment = async (e) => {
        e.preventDefault();

        if (!isManageable) {
            console.log("User is not authenticated. Create Apartment blocked.");
            return;
        }


        const newApartment = {
            address,
            name,
            description,
            zipCode,
            contact_email,
            contact_phone
        };

        try {
            console.log(selectedAmenities);
            await ApartmentSubmit({ newApartment, selectedAmenities });
            console.log("ApartmentForm Submit Successfully");
        } catch (error) {
            console.log(error);
        }

    };



    return (
        <>
            <form onSubmit={submitCreateApartment} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
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
                            onChange={e => setName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Apartment Name"
                            required
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
                            onChange={e => setAddress(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Address"
                            required
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
                            onChange={handleZipCodeChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="ZipCode"
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


ApartmentForm.propTypes= {
    ApartmentSubmit: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    isManageable: PropTypes.bool.isRequired
};

export default ApartmentForm
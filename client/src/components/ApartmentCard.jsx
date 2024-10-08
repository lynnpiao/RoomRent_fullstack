import { React, useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../utils/AuthContext';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import axios from 'axios';
import PropTypes from "prop-types";


const ApartmentCard = ({ apartment, onDelete, isHome }) => {

    // console.log(apartment);

    const base_url = import.meta.env.VITE_API_URL;

    const { authState } = useContext(AuthContext);

    const [showFullDescription, setShowFullDescription] = useState(false);
    let description = apartment.description;
    if (!showFullDescription) {
        description = description.substring(0, 60) + '...';
    }

    let isManageable = apartment.managerEmails.includes(authState.email);

    const navigate = useNavigate();

    const handleDeleteClick = () => {
        onDelete(apartment.id);
    };

    const [images, setImages] = useState([]);
    const [map, setMap] = useState(null);
    const [maxWidthImage, setMaxWidthImage] = useState(null);

    const fetchImage = async (apartmentName) => {
        try {
            // console.log(apartmentName);
            const response = await axios.post(`${base_url}/apartment_image`, { name: apartmentName });
            //   console.log(response.data);
            // Assuming response.data contains the image URL
            setImages(response.data); // Ensure this matches the shape of your data
        } catch (error) {
            console.error('Error fetching image of apartment', error);
            toast.error('Failed to fetch apartments');
        }
    };

    const fetchMap = async (apartmentName) => {
        try {
            // console.log(apartmentName);
            const response = await axios.post(`${base_url}/apartment_map`, { name: apartmentName });

            // console.log(response.data);
            setMap(response.data);
        } catch (error) {
            console.error('Error fetching image of apartment', error);
            toast.error('Failed to fetch apartments');
        }
    };


    const getMaxWidthImage = (imagesArray) => {
        if (!imagesArray || imagesArray.length === 0) {
            throw new Error('The images array is empty or undefined');
        }

        return imagesArray.reduce((maxWidthImage, currentImage) => {
            return currentImage.original_width > maxWidthImage.original_width
                ? currentImage
                : maxWidthImage;
        });
    };

    // useEffect(() => {
    //     fetchImage(apartment.name);
    //     fetchMap(apartment.name);
    // }, []);

    // useEffect(() => {
    //     if (images.length > 0) {
    //         const maxImage = getMaxWidthImage(images);
    //         setMaxWidthImage(maxImage);
    //         // console.log(maxWidthImage.original);

    //     }
    // }, [images]);

    return (
        <>
            <div className="flex max-lg:flex-col bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] hover:scale-105 transition-all duration-300">
                <img
                    src="https://images1.apartments.com/i2/gEInKBqPxtTvwybInPpMbCHiV_Ww0UmPp0YFqM1Goak/111/the-exchange-street-apartments-malden-ma-building-photo.jpg"
                    // src={maxWidthImage.original} 
                    alt="apartment pic" className="lg:w-2/5 min-h-[250px] h-full object-cover" />

                {/* {maxWidthImage && (
                    <img
                        src="https://images1.apartments.com/i2/gEInKBqPxtTvwybInPpMbCHiV_Ww0UmPp0YFqM1Goak/111/the-exchange-street-apartments-malden-ma-building-photo.jpg"
                        // src={maxWidthImage.original} 
                        alt="apartment pic" className="lg:w-2/5 min-h-[250px] h-full object-cover" />
                )} */}
                <div className="p-6 lg:w-3/5">

                    <h3 onClick={() => {
                        navigate(`/apartmentdetails/${apartment.id}`);
                    }} className="text-xl font-bold text-[#333]">{apartment.name}</h3>

                    {isManageable && !isHome &&
                        <div className="flex space-x-4">
                            <Link to={`/editapartment/${apartment.id}`}>
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

                    <span className="text-sm block text-gray-400 mt-2">
                        <a
                            href="https://www.google.com/maps/place/The+Exchange+Street+Apartments/@42.4262356,-71.0712794,15z/data=!4m2!3m1!1s0x0:0xe55209e282eb8d8?sa=X&ved=2ahUKEwib_Oe4-9aHAxVQQvEDHYdRIsYQ_BJ6BAhAEAA&hl=en&gl=us"
                            // href= {map.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {apartment.address}
                        </a>

                        {map &&
                            <a
                                href={map.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {apartment.address}
                            </a>}

                    </span>

                    <div className="flex space-x-4">
                        <p className="text-sm mt-4">{description}</p>
                        <button
                            onClick={() => setShowFullDescription((prevState) => !prevState)}
                            className='text-indigo-500 mb-5 hover:text-indigo-600'
                        >
                            {showFullDescription ? 'Less' : 'More'}
                        </button>
                    </div>
                </div>
            </div></>
    )
}

ApartmentCard.propTypes = {
    apartment: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    isHome: PropTypes.bool.isRequired
};


export default ApartmentCard
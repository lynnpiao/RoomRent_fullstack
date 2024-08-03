import {React, useContext, useState} from 'react'
import { AuthContext } from '../utils/AuthContext';
import { useParams} from 'react-router-dom';
import { useCookies } from "react-cookie";
// icons 
import { IoMdFitness } from "react-icons/io";
import { IoLibraryOutline } from "react-icons/io5";
import { BiSolidWasher, BiCloset } from "react-icons/bi";
import { PiButterfly, PiSwimmingPool } from "react-icons/pi";
import { GiWhirlpoolShuriken, GiCardKingClubs, GiWindow, GiWoodBeam } from "react-icons/gi";
import { LuView, LuPackage, LuParkingCircle } from "react-icons/lu";
import { MdBalcony, MdOutlinePayment, MdOutdoorGrill, MdPets, MdCountertops } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { CgUnavailable } from "react-icons/cg";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from 'axios';
import { toast } from 'react-toastify';


const AmenitySection = ({ amenities, type, isManageable }) => {

    const base_url = import.meta.env.VITE_API_URL;
    const { authState } = useContext(AuthContext);
    const [cookies,] = useCookies(['accessToken']);
    const [localAmenities, setLocalAmenities] = useState(amenities);
    const accessToken = cookies.accessToken;

    let { id } = useParams();

    const community_amenity_icons = {
        '24h Fitness': <IoMdFitness />,
        'Butterfly Access': <PiButterfly />,
        'Club Room': <GiCardKingClubs />,
        'Library': <IoLibraryOutline />,
        'Ocean View': <LuView />,
        'Online payment': <MdOutlinePayment />,
        'Outdoor kitchen': <MdOutdoorGrill />,
        'Package Concierge': <LuPackage />,
        'Parking': <LuParkingCircle />,
        'Pet Friendly': <MdPets />,
        'Swimming Pool': <PiSwimmingPool />
    };

    const community_amenity_details = {
        '24h Fitness': 'Access the fitness center any time with 24-hour availability.',
        'Butterfly Access': 'Secure and convenient entry with butterfly access system.',
        'Club Room': 'Enjoy social gatherings and events in the club room.',
        'Library': 'Quiet space for reading and studying with a variety of books.',
        'Ocean View': 'Breathtaking views of the ocean from your apartment.',
        'Online payment': 'Convenient online payment options for rent and utilities.',
        'Outdoor kitchen': 'Cook and entertain outdoors with a fully equipped kitchen.',
        'Package Concierge': 'Secure package delivery and storage services available.',
        'Parking': 'Ample and convenient parking options for residents.',
        'Pet Friendly': 'Welcoming environment for pets with pet-friendly amenities.',
        'Swimming Pool': 'Relax and enjoy the swimming pool and sun deck.'
    };


    const apartment_amenity_icons = {
        'Air conditioning': <TbAirConditioning />,
        'Floor-to-ceiling windows': <GiWindow />,
        'Granite countertops': <MdCountertops />,
        'Hardwood flooring': <GiWoodBeam />,
        'Private balconies and patios': <MdBalcony />,
        'Stackable washer and dryer': <BiSolidWasher />,
        'Walk-in closets': <BiCloset />,
        'whirlpool appliances': <GiWhirlpoolShuriken />

    }

    const apartment_amenity_details = {
        'Air conditioning': 'Keep your apartment cool and comfortable with an efficient air conditioning system.',
        'Floor-to-ceiling windows': 'Enjoy abundant natural light and stunning views with tall floor-to-ceiling windows.',
        'Granite countertops': 'High-quality, durable granite surfaces in the kitchen for a stylish and functional workspace.',
        'Hardwood flooring': 'Beautiful and long-lasting hardwood floors that add elegance and warmth to your living space.',
        'Private balconies and patios': 'Relax and unwind in your own private outdoor area with a balcony or patio.',
        'Stackable washer and dryer': 'Convenient in-unit laundry with space-saving, stackable washer and dryer units.',
        'Walk-in closets': 'Ample storage space with large walk-in closets, perfect for organizing your wardrobe.',
        'whirlpool appliances': 'Enjoy modern and reliable Whirlpool brand kitchen appliances for all your culinary needs.'

    }

    const icons = type === 'community' ? community_amenity_icons : apartment_amenity_icons;
    const details = type === 'community' ? community_amenity_details : apartment_amenity_details;


    const deleteApartmentAmenity = async (amenityId) => {

        if (!isManageable) {
            console.log("User is not authenticated. Delete Amenity blocked.");
            return;
        }
        // Display confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this amenity?');
        if (!confirmDelete) {
            return; // If user cancels, exit the function
          }
        // delete
        try {
            const response = await axios.delete(`${base_url}/amenities/apartment/${id}/${amenityId}`, 
              {
                withCredentials: true, // Make sure cookies are sent with the request
              });

            // After deletion, update the state by filtering out the deleted amenity
            const updatedAmenities = localAmenities.filter(amenity => amenity.id !== amenityId);
            setLocalAmenities(updatedAmenities);

            toast.success('Deleted amenity successfully');

        } catch (error) {
            console.error('Error deleting amenity:', error);
            // toast.error('Failed to delete amenity');
        }
        
    
      };

    const deleteRoomAmenity = async (amenityId) => {

        if (!isManageable) {
            console.log("User is not authenticated. Delete Amenity blocked.");
            return;
        }
        // Display confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this amenity?');
        if (!confirmDelete) {
            return; // If user cancels, exit the function
          }
        // delete
        try {
            const response = await axios.delete(`${base_url}/amenities/room/${id}/${amenityId}`, 
              {
                withCredentials: true, // Make sure cookies are sent with the request
              });

            // After deletion, update the state by filtering out the deleted amenity
            const updatedAmenities = localAmenities.filter(amenity => amenity.id !== amenityId);
            setLocalAmenities(updatedAmenities);
            
            toast.success('Deleted amenity successfully');

        } catch (error) {
            console.error('Error deleting amenity:', error);
            // toast.error('Failed to delete amenity');
        }
        

    
    };

    const deleteAmenity = type === 'community' ? deleteApartmentAmenity : deleteRoomAmenity;

    return (
        <div className="bg-gray-50 px-4 py-12 font-[sans-serif]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-gray-800 sm:text-4xl text-2xl font-extrabold text-center mb-16">{type === 'community' ? 'Community Amenity' : 'Room Amenity'}</h2>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 max-md:max-w-lg mx-auto gap-8">
                    {localAmenities.map(amenity => (
                        <div key={amenity.id} className="p-6 flex gap-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gray-100 p-3 rounded-md shrink-0">
                                {icons[amenity.name] || (
                                    < CgUnavailable />
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-800 text-xl font-semibold mb-3">{amenity.name}</h3>
                                <p className="text-gray-600 text-sm">
                                    {details[amenity.name] || 'No details available'}
                                </p>
                            </div>
                            {isManageable && (
                                <button
                                    type="button"
                                    className=""
                                    onClick={() => deleteAmenity(amenity.id)}
                                >
                                    <RiDeleteBin6Fill />
                                </button>
                            )}
                        </div>
                    ))}


                </div>
            </div>
        </div>
    )
}

export default AmenitySection
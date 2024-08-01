import { React, useState, useEffect, useContext } from 'react';
import { useCookies } from "react-cookie";
import ApartmentCard from './ApartmentCard';
import { toast } from 'react-toastify';
import { AuthContext } from "../utils/AuthContext";
import PropTypes from "prop-types";
import axios from 'axios';

const ApartmentSection = ({ isHome = false }) => {

    const base_url = import.meta.env.VITE_API_URL;
    const [apartments, setApartments] = useState([]);
    const { authState } = useContext(AuthContext);
    const [user, setUser] = useState({});

    useEffect(() => {
        if (authState && authState.id) {
            setUser({ id: authState.id });
        }
    }, [authState]);

    const fetchApartmentList = async () => {

        const url = isHome ? `${base_url}/apartments` : `${base_url}/apartments/manage/${user.id}`;

        try {
            // console.log(url);
            const response = await axios.get(url);
            const data = await response.data;

            setApartments(data);// Ensure this matches the shape of your data
        } catch (error) {

            if (error.response && error.response.status === 404) {
                console.log('No apartments found.');
                setApartments([]);
                return null; // or return an appropriate error message or status
            }

            console.error('Error loading apartments:', error);
            toast.error('Failed to fetch apartments');
        }
    };

    useEffect(() => {
        fetchApartmentList();
    }, []);

    const [cookies, setCookies] = useCookies(['accessToken']);
    const accessToken = cookies.accessToken;

    const deleteApartment = async (id) => {
        // Display confirmation dialog

        if (!authState) {
            console.log("User is not authenticated. Delete Apartment blocked.");
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this apartment?');

        if (!confirmDelete) {
            return; // If user cancels, exit the function
        }

        try {
            const response = await axios.delete(`${base_url}/apartments/${id}`, {
                data: { user },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // After deletion, refetch ingredients
            await fetchApartmentList();// Assuming fetchIngredients updates state
            toast.success('Deleted apartment successfully');

        } catch (error) {
            console.error('Error deleting apartment:', error);
            // toast.error('Failed to delete apartment');
        }
    };


    return (
        <>
            <div className="bg-white font-sans p-4">
                {isHome && (
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                        Latest Apartment
                    </h4>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {apartments.map((apartment, index) => (
                        <ApartmentCard
                            key={index}
                            apartment={apartment}
                            onDelete={deleteApartment}
                            isHome={isHome}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}


ApartmentSection.propTypes = {
    isHome: PropTypes.bool.isRequired
};

export default ApartmentSection
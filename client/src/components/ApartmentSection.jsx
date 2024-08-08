import { React, useState, useEffect, useContext } from 'react';
import { useCookies } from "react-cookie";
import ApartmentCard from './ApartmentCard';
import { toast } from 'react-toastify';
import { AuthContext } from "../utils/AuthContext";
import PropTypes from "prop-types";
import axios from 'axios';

const ApartmentSection = ({ isHome }) => {

    const base_url = import.meta.env.VITE_API_URL;
    const [apartments, setApartments] = useState([]);
    const { authState } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [viewAll, setViewAll] = useState(false);

    useEffect(() => {
        if (authState && authState.id) {
            setUser({ id: authState.id });
        }
    }, [authState]);

    const getUserId = () => {
        const userId = authState?.user?.id;
        if (!userId) {
            return localStorage.getItem('id');
        }
        return userId;
    };

    const fetchApartmentList = async () => {
        const userId = getUserId();
        const url = isHome ? `${base_url}/apartments` : `${base_url}/apartments/manage/${userId}`;

        try {
            const response = await axios.get(url);
            const data = await response.data;
            setApartments(data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('No apartments found.');
                setApartments([]);
                return null;
            }
            console.error('Error loading apartments:', error);
            toast.error('Failed to fetch apartments');
        }
    };

    const fetchAllApartmentList = async () => {
        const url = `${base_url}/apartments/all`;

        try {
            const response = await axios.get(url);
            const data = await response.data;
            setApartments(data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('No apartments found.');
                setApartments([]);
                return null;
            }
            console.error('Error loading all apartments:', error);
            toast.error('Failed to fetch all apartments');
        }
    };

    useEffect(() => {
        if (viewAll) {
            fetchAllApartmentList();
        } else {
            fetchApartmentList();
        }
    }, [viewAll]);

    const [cookies, setCookies] = useCookies(['accessToken']);
    const accessToken = cookies.accessToken;

    const deleteApartment = async (id) => {
        const apartmentId = parseInt(id);

        if (!authState) {
            console.log("User is not authenticated. Delete Apartment blocked.");
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this apartment?');

        if (!confirmDelete) {
            return;
        }

        axios.delete(`${base_url}/manageapartments/all`, {
            data: { apartmentId },
            withCredentials: true,
        })
            .then(() => {
                return axios.delete(`${base_url}/apartments/${apartmentId}`, { withCredentials: true });
            })
            .then(() => {
                return fetchApartmentList();
            })
            .then(() => {
                toast.success('Deleted apartment successfully');
            })
            .catch(error => {
                console.error('Error deleting apartment:', error);
                toast.error('Failed to delete apartment. Please try again.');
            });
    };

    const handleToggleView = () => {
        setViewAll(!viewAll);
    };

    return (
        <div className="bg-white font-sans p-4">
            {isHome ? (
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                    Latest Apartment
                </h4>
            ) : (
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                    My Apartment
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

            <button
                type="button"
                className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded mt-4"
                onClick={handleToggleView}
            >
                {viewAll ? 'View Less' : 'View All'}
            </button>
        </div>
    );
}

ApartmentSection.propTypes = {
    isHome: PropTypes.bool.isRequired
};

export default ApartmentSection;

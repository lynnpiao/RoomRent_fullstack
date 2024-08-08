import React from 'react'
import { AuthContext } from '../utils/AuthContext'
import { useContext, useState, useEffect } from 'react'
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useCookies } from "react-cookie";
import axios from "axios";
import ApartmentForm from '../components/ApartmentForm';
import ApartmentSection from '../components/ApartmentSection'

const MyApartments = () => {
    const base_url = import.meta.env.VITE_API_URL;
    const { authState } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (authState && authState.id) {
            setUser({ id: authState.id });
        }
    }, [authState]);

    // Create New Apartment
    const createApartment = ({ newApartment, selectedAmenities }) => {
        const apartmentAmenities = selectedAmenities.map(amenity => amenity.id);
        const userId = user.id || localStorage.getItem('userId');

        axios.post(`${base_url}/apartments`, newApartment, {
            withCredentials: true,
        })
            .then(apartmentResponse => {
                const createdApartment = apartmentResponse.data.createdApartment;
                const apartmentId = createdApartment.id;
                console.log('Apartment created:', createdApartment);

                if (selectedAmenities.length > 0) {
                    axios.post(`${base_url}/amenities/apartment/${apartmentId}`, apartmentAmenities, {
                        withCredentials: true,
                    })
                        .then(amenitiesResponse => {
                            const createdAmenities = amenitiesResponse.data;
                            console.log('Amenities created:', createdAmenities);
                        })
                        .catch(error => {
                            console.error(`Error creating amenities for the apartment of ${apartmentId}`, error);
                            toast.error(`Failed to create amenities for the apartment of ${apartmentId}. Please try again.`);
                        });
                } else {
                    console.log('No amenities added in apartment');
                }

                axios.post(`${base_url}/manageapartments`, {
                    apartmentId,
                    userId,
                }, {
                    withCredentials: true,
                })
                    .then(manageApartmentResponse => {
                        const createdManagement = manageApartmentResponse.data;
                        console.log('Apartment Management created:', createdManagement);
                        toast.success('Successfully created apartment');
                        setRefresh(!refresh); // Trigger re-render of ApartmentSection
                    })
                    .catch(error => {
                        console.error(`Error creating apartment management for the apartment of ${apartmentId}`, error);
                        toast.error(`Failed to create apartment management for the apartment of ${apartmentId}. Please try again.`);
                    });

            })
            .catch(error => {
                console.error('Error creating main part of the apartment:', error);
                toast.error('Failed to create main part of the apartment. Please try again.');
            });
    };

    return (
        <>
            <ApartmentSection isHome={false} key={refresh} />
            <br></br>
            <div className="bg-white font-sans p-4">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                    Add New Apartment
                </h4>
                <ApartmentForm ApartmentSubmit={createApartment} category='community' isManageable={true} />
            </div>
        </>
    )
}

export default MyApartments
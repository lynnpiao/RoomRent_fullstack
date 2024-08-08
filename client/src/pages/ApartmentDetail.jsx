import { React, useContext } from 'react'
import { AuthContext } from '../utils/AuthContext';
import ApartmentContentSection from '../components/ApartmentContentSection';
import AmenitySection from '../components/AmenitySection';
import ApartmentRoomList from '../components/ApartmentRoomList';
import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApartmentDetail = () => {
    const apartmentInfo = useLoaderData();
    const { authState } = useContext(AuthContext);
    let isManageable = apartmentInfo.apartment.managerEmails.includes(authState.email);
    const navigate = useNavigate();

    const deleteApartment = async (id) => {
        // Display confirmation dialog
        // const userId = parseInt(getUserId());
        const apartmentId = parseInt(id);

        if (!authState) {
            console.log("User is not authenticated. Delete Apartment blocked.");
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this apartment?');

        if (!confirmDelete) {
            return; // If user cancels, exit the function
        }

        // delete all the managers under this apartment
        axios.delete(`${base_url}/manageapartments/all`, {
            data: {apartmentId },
            withCredentials: true,
        })
        .then(() => {
            // Delete the apartment
            return axios.delete(`${base_url}/apartments/${apartmentId}`, { withCredentials: true });
        })
        .then(() => {
            navigate('/myapartments');
            toast.success('Deleted apartment successfully');
            
        })
        .catch(error => {
            console.error('Error deleting apartment:', error);
            toast.error('Failed to delete apartment. Please try again.');
        });
    };
    return (
        <>
            <ApartmentContentSection apartment={apartmentInfo.apartment} isManageable={isManageable} />
            {apartmentInfo.rooms ? (
                <ApartmentRoomList rooms={apartmentInfo.rooms} />
            ) : (
                <></>
            )}
            {apartmentInfo.amenities ? (<AmenitySection amenities={apartmentInfo.amenities} type={'community'} isManageable={isManageable} />)
                : (
                    <></>
                )}

            {isManageable && (
                <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded"
                        onClick={() => deleteApartment(apartmentInfo.apartment.id)}
                    >
                        Delete the Apartment
                    </button>
                </div>
            )}
            <br></br>
        </>
    )
}

const apartmentLoader = async ({ params }) => {

    // console.log(params.id);
    const base_url = import.meta.env.VITE_API_URL;

    try {
        const [apartmentResponse, amenitiesResponse, roomsResponse] = await Promise.all([
            axios.get(`${base_url}/apartments/${params.id}`),
            axios.get(`${base_url}/amenities/apartment/${params.id}`).catch(error => {
                if (error.response && error.response.status === 404) {
                    return { status: 404, data: null }; // Return a 404 status with null data
                }
                throw error; // Rethrow other errors
            }),
            axios.get(`${base_url}/rooms/apartment/${params.id}`).catch(error => {
                if (error.response && error.response.status === 404) {
                    return { status: 404, data: null }; // Return a 404 status with null data
                }
                throw error; // Rethrow other errors
            }),
        ]);

        return {
            apartment: apartmentResponse.data,
            amenities: amenitiesResponse.status === 404 ? null : amenitiesResponse.data,
            rooms: roomsResponse.status === 404 ? null : roomsResponse.data,
        };

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // or return an appropriate error message or status
        }
        throw error; // rethrow other errors to be handled globally or by the component
    }
};


export { ApartmentDetail as default, apartmentLoader }
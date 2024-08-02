import { React} from 'react';
import { Link } from "react-router-dom";

const ApartmentContentSection = ({apartment, isManageable}) => {


    let iframe_src = `https://maps.google.com/maps?q=${apartment.zipCode}&t=&z=13&ie=UTF8&iwloc=&output=embed`

    return (
        <div className="bg-gray-50 px-4 py-12 font-[sans-serif]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 gap-x-12">
                    <div className="text-right">
                        <iframe src={iframe_src}
                            class="left-0 top-0 h-full w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg" frameborder="0"
                            allowfullscreen></iframe>
                    </div>
                    <div>
                        <h2 className="text-[#333] text-4xl font-extrabold mb-6">{apartment.name}</h2>

                        {isManageable &&
                            <Link to={`/addroom`} className="ml-4 sm:ml-0">
                                <button
                                    type="button"
                                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                    Add New Room
                                </button>
                            </Link>}

                        <span className="text-sm block text-gray-400 mt-2">{apartment.address}</span>
                        <h3 className="text-[#333] text-xl font-extrabold mb-6">Details:</h3>
                        <p className="text-base text-gray-500 mb-4">{apartment.description}</p>
                        <h3 className="text-[#333] text-xl font-extrabold mb-6">Contact:</h3>
                        <span className="text-sm block text-gray-400 mt-2">{apartment.contact_email}</span>
                        <span className="text-sm block text-gray-400 mt-2">{apartment.contact_phone}</span>

                    </div>
                </div>
            </div>
        </div>
    )
}




export default ApartmentContentSection
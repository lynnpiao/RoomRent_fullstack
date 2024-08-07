import { Link } from 'react-router-dom';
import { IoBedOutline } from "react-icons/io5";
import { BiBath } from "react-icons/bi";
import { GrSteps } from "react-icons/gr";
import { MdSquareFoot } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from 'dayjs';
import { useState, useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import ContactModal from './ContactModal';
import PropTypes from 'prop-types';

const formatAvailabilityDate = (availableDate) => {
    const now = dayjs();
    const available = dayjs(availableDate);
    if (available.isAfter(now, 'day')) {
        return available.format('YYYY-MM-DD');
    }
    return 'Now';
};

const RoomContentSection = ({ room }) => {

    const availabilityDate = formatAvailabilityDate(room.availableDate);
    const bed_type = room.type.split('/')[0];
    const bath_type = room.type.split('/')[1];
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { authState } = useContext(AuthContext);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const room_pic_urls = {
        'Studio/1 Bath': ["https://www.chr-apartments.com/sites/default/files/styles/tile_image_cropped/public/2022-06/Hancock%20Village%20Apartments%20-Josiah%20Bartlett%20Building%20%20Kitchen.jpg?itok=NvlCBlQv",
            "https://www.chr-apartments.com/sites/default/files/styles/property_featured/public/2021-01/EWilde_150223_2089.jpg?itok=c7Fms2Aw",
            "https://www.chr-apartments.com/sites/default/files/styles/tile_image_cropped/public/2019-09/EWilde_150223_2064.jpg?itok=TOtj5G2f",],
        '1 Bed/1 Bath': ["https://www.chr-apartments.com/sites/default/files/styles/tile_image_cropped/public/2019-09/EWilde_150223_2064.jpg?itok=TOtj5G2f",
            "https://160pleasant.com/wp-content/uploads/2021/06/Image-10-of-17-2-scaled.jpg",
            "https://images1.apartments.com/i2/9ks3Ill6ejupOss_Bb6bpWMxMTU46fpU0qKuJDrUpt4/117/the-exchange-saint-petersburg-fl-primary-photo.jpg",],
        '2 Bed/2 Bath': ["https://www.chr-apartments.com/sites/default/files/styles/tile_image_cropped/public/2019-09/EWilde_150223_2211.jpg?itok=fOpFtGni",
            "https://marvel-b1-cdn.bc0a.com/f00000000254107/cdn.tfc.com/marketing/files/building_images/2-Gold-St_4803_Bedroom_04-2019.jpg",
            "https://www.compass.com/m/7290374297d24b89e36f964c12772965cc66cae1_img_0_54575/640x480.jpg",]

    }

    const images = room_pic_urls[room.type];
    const [lastClicked, setLastClicked] = useState(null);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
        setLastClicked('left');
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        setLastClicked('right');
    };

    return (
        <div className="font-[sans-serif] tracking-wide max-md:mx-auto">
            <div className="bg-gradient-to-r from-gray-600 via-gray-900 to-gray-900 md:min-h-[600px] grid items-start grid-cols-1 lg:grid-cols-5 md:grid-cols-2">


                <div className="lg:col-span-3 h-full p-8">
                    <div className="relative h-full flex items-center justify-center lg:min-h-[580px]">
                        <img src={images[currentIndex]} alt="Room pictures" className="w-full h-full object-cover" />
                        <div className="flex space-x-4 items-end absolute right-0 max-md:right-4 md:bottom-4 bottom-0">
                            <div
                                className={`w-10 h-10 grid items-center justify-center rounded-full shrink-0 cursor-pointer ${lastClicked === 'left' ? 'bg-white' : 'bg-[#333]'}`}
                                onClick={handlePrevClick}
                            >
                                <FaAngleLeft className={`${lastClicked === 'left' ? 'text-black' : 'text-white'}`} />
                            </div>
                            <div
                                className={`w-10 h-10 grid items-center justify-center rounded-full shrink-0 cursor-pointer ${lastClicked === 'right' ? 'bg-white' : 'bg-[#333]'}`}
                                onClick={handleNextClick}
                            >
                                <FaAngleRight className={`${lastClicked === 'right' ? 'text-black' : 'text-white'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-100 py-6 px-8 h-full">
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800">Unit No.{room.aptNumber}</h2>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-800">Type</h3>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="text-sm block text-gray-400 mt-2"> <IoBedOutline /> {bed_type}</span>
                            <span className="text-sm block text-gray-400 mt-2"> <BiBath /> {bath_type}</span>
                            <span className="text-sm block text-gray-400 mt-2"> <MdSquareFoot /> {room.sqFeet} sqft</span>
                            <span className="text-sm block text-gray-400 mt-2"> <GrSteps /> {room.floor} floor</span>
                        </div>
                    </div>


                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-800">Price</h3>
                        <p className="text-gray-800 text-3xl font-bold mt-4">${room.rentPerMonth} /mo</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-800">Availability</h3>
                        <span className="text-sm block text-gray-400 mt-2"> {availabilityDate}</span>
                    </div>


                    <div className="flex flex-wrap gap-4 mt-8">
                        {authState.role === 'tenant' && (
                            <div className="flex flex-wrap gap-4 mt-8">
                                <button
                                    type="button"
                                    className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded"
                                    onClick={openModal}
                                >
                                    Contact
                                </button>
                            </div>
                        )}
                        <ContactModal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            managerEmail={room.managerEmails[0]}
                        />
                    </div>

                </div>
            </div>

            <div className="mt-8 max-w-2xl px-6">
                <h3 className="text-lg font-bold text-gray-800">Lease Terms</h3>

                <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                    <li className="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-4 bg-green-500 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Min Lease Length: {room.minLeaseLength}
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-4 bg-green-500 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Deposit and Fees: Contact manager for details
                    </li>
                </ul>

                <div class="mt-8">
                    <h3 class="text-lg font-bold text-gray-800">Apartment Details</h3>
                    <p class="text-sm text-gray-600 mt-4">Name: <Link to={`/apartmentdetails/${room.apartment.id}`} className="text-blue-500 hover:underline">{room.apartment.name}</Link> </p>
                    <p class="text-sm text-gray-600 mt-4">Address: {room.apartment.address}</p>
                    <p class="text-sm text-gray-600 mt-4">Introduction: {room.apartment.description}</p>
                </div>


            </div>
        </div>
    )
}

RoomContentSection.propTypes = {
    room: PropTypes.object.isRequired
};


export default RoomContentSection
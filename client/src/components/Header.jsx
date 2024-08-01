import { React, useState, useContext } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from '../utils/AuthContext';
import { useCookies } from "react-cookie";
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {authState, setAuthState } = useContext(AuthContext);
    const [cookies, removeCookie] = useCookies(['accessToken']);


    const handleClick = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    }

    const navigateToSign = () => {
        navigate('/register');
    }
    console.log(document.cookie);

    const SingOutAndNagivateToHome = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("email");
            localStorage.removeItem("id");
            localStorage.removeItem("role");
            removeCookie("accessToken", { path: '/' }); //, { path: '/' }
            setAuthState({ email: "", id: 0, role: "", status: false });
            navigate('/');
        }
    }

    const linkState = ({ isActive }) =>
        isActive
            ? 'bg-gray-800 text-white font-medium hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-3 py-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            : 'text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-3 py-2 dark:text-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700';

    return (
        <>
            <header className='flex bg-white border-b py-4 sm:px-8 px-6 font-[sans-serif] min-h-[80px] tracking-wide relative z-50'>
                <div className='flex flex-wrap items-center lg:gap-y-2 gap-4 w-full'>
                    <h1 className="text-3xl font-sans font-bold"> Room Rent</h1>

                    <div id="collapseMenu"
                        style={{ display: isMenuOpen ? 'block' : 'none' }}
                        className='lg:ml-10 max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
                        <button id="toggleClose" onClick={handleClick} className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
                            <IoClose size={30} />
                        </button>

                        <ul
                            className='lg:flex lg:gap-x-3 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
                            <li className='max-lg:border-b max-lg:py-3 px-3 font-sans'>
                                <NavLink to='/' className={linkState}>
                                    Home
                                </NavLink></li>
                            <li className='max-lg:border-b max-lg:py-3 px-3 font-sans'>
                                {authState.status && (
                                    <>
                                        {authState.role === 'tenant' && (
                                            <NavLink to='/mylikes' className={linkState}>
                                                Liked Rooms
                                            </NavLink>
                                        )}

                                        {authState.role === 'manager' && (
                                            <NavLink to='/myapartments' className={linkState}>
                                                Manage Apartments
                                            </NavLink>
                                        )}
                                    </>
                                )}</li>
                        </ul>
                    </div>

                    <div className="flex gap-x-6 gap-y-4 ml-auto">
                        <div
                            className='flex border-2 focus-within:border-gray-400 rounded-full px-6 py-3 overflow-hidden max-w-52 max-lg:hidden'>
                            <input type='text' placeholder='Search something...' className='w-full text-sm bg-transparent outline-none pr-2' />
                            <FaSearch />
                        </div>

                        <div className='flex items-center space-x-8'>

                            {!authState.status ?
                                (<>
                                    <button onClick={navigateToLogin}
                                        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-sans font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Login
                                    </button>
                                    <button onClick={navigateToSign}
                                        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-sans font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Sign up</button>
                                </>) : (
                                    <>
                                        <button onClick={SingOutAndNagivateToHome}
                                            className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-sans font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Logout</button>
                                    </>
                                )

                            }

                            <button id="toggleOpen" onClick={handleClick} className='lg:hidden'>
                                <MdMenu size={30} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
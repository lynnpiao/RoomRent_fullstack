import { React, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MdOutlineAttachEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { AuthContext } from '../utils/AuthContext';
import HomePage from '../pages/HomePage';

const UserForm = ({ UserSubmit, UserFormType }) => {
    const { authState } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');
    const [role, setRole] = useState('');

    if (authState.status) {
        return <HomePage/>; // Do not render the form if user is authenticated
      }


    const submitForm = async (e) => {
        e.preventDefault();

        const newUser = {
            email,
            password,
            role
        };

        const loginUser = {
            email,
            password
        }

        try {
            const user = UserFormType === "Register" ? newUser : loginUser;
            await UserSubmit(user);
            console.log("UserForm submitted successfully");
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <>
            <form onSubmit={submitForm} className="space-y-4 font-sans text-[#333] max-w-md mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
                <div className="relative flex items-center mb-4">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent w-full text-sm border outline-[#007bff] rounded transition-all"
                    />
                    <MdOutlineAttachEmail size={20} className="absolute right-3 text-gray-400"/>
                </div>

                <div className="relative flex items-center mb-4">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassWord(e.target.value)}
                        placeholder="Enter Password"
                        className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent w-full text-sm border outline-[#007bff] rounded transition-all"
                    />
                    <FaEye size={20} className="absolute right-3 text-gray-400"/>
                </div>

                {UserFormType === "Register" && (
                    <div className="relative flex items-center mb-4">
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="px-4 py-3 bg-white w-full text-sm border outline-[#007bff] rounded transition-all"
                        >
                            <option value="" disabled>Select role</option>
                            <option value="manager">Manager</option>
                            <option value="tenant">Tenant</option>
                        </select>
                        <IoPersonCircleSharp size={20} className="absolute right-3 text-gray-400"/>
                    </div>
                )}

                <div className="mt-8">
                    <button type="submit" className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-300">
                        {UserFormType === "Register" ? "Sign up" : "Login"}
                    </button>
                </div>

                <p className="text-gray-800 text-sm mt-6 text-center">
                    {UserFormType === "Register" ? (
                        <>
                            Already have an account?
                            <NavLink to="/login" className="text-blue-600 font-semibold hover:underline ml-1">
                                Login here
                            </NavLink>
                        </>
                    ) : (
                        <>
                            Don't have an account?
                            <NavLink to="/register" className="text-blue-600 font-semibold hover:underline ml-1">
                                Register here
                            </NavLink>
                        </>
                    )}
                </p>
            </form>
        </>

    )
}


UserForm.propTypes = {
    UserFormType: PropTypes.string.isRequired,
    UserSubmit: PropTypes.func.isRequired
};

export default UserForm
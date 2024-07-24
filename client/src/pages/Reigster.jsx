import UserForm from "../components/UserForm";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();

    // Create New User
    const createUser = async (newUser) => {
        console.log(newUser);
        try {
            const response = await axios.post('http://localhost:8000/user', newUser, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.data;
            console.log(data);
            toast.success('Account created successfully');
            navigate("/login");

        } catch (error) {
            console.error('Error creating user:', error); // Log the error for debugging
            toast.error('Failed to create account. Please try again.'); // Display error toast notification

        }
    };

    return (
        <>
            <UserForm UserSubmit={createUser} UserFormType="Register" />
        </>
    );
};

export default Register;
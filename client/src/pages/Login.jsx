import UserForm from "../components/UserForm";
import {useContext} from "react";
import { AuthContext } from "../utils/AuthContext";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";


const Login = () => {
    const [cookies, setCookies] = useCookies(['accessToken']);
    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();


    // Login User
    const loginUser = (loginUser) => {

        axios.post('http://localhost:8000/user/login', loginUser, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure credentials (cookies) are sent

    }).then(response => {
        console.log(response);
        // Store token and user information in localStorage
       
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("id", response.data.user.id);
        localStorage.setItem("role", response.data.user.role);
        
          
        // Set the cookie using the react-cookie hook 
        //setCookies('accessToken', response.data.token, { path: '/' }); // Ensure the path is set appropriately

        // Update authentication state
        setAuthState({
            email: response.data.user.email,
            role: response.data.user.role,
            id: response.data.user.id,
            status: true,
        });

        // Display success message and navigate to home
        
        toast.success('Login successfully');
        setTimeout(() => {
            navigate('/');
        }, 1000);

    }).catch(error => {
        // Log error and show error message
        console.error('Error login:', error);
        toast.error('Failed to login account. Please try again.');
    });

    };

    return (
        <>
            <UserForm UserSubmit={loginUser} UserFormType="Login" />
        </>
    );
};

export default Login;
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { AuthContext } from "./utils/AuthContext";
import { useCookies } from "react-cookie";
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Register from './pages/Reigster';
import Login from './pages/Login';
import axios from 'axios';



const App = () => {

  const [cookies,] = useCookies(['accessToken']);

  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    role: "",
    status: false,
  });

  useEffect(() => {
    const accessToken = cookies.accessToken;

    console.log('Retrieved accessToken from cookies:', accessToken); //

    if (accessToken) {
      axios
        .get("http://localhost:8000/user/auth", {
          withCredentials: true
        })
        .then((response) => {
          if (response.data.error) {
            setAuthState({ ...authState, status: false });
          } else {
            console.log('auth response', response);
            setAuthState({
              email: response.data.user.email,
              id: response.data.user.id,
              role: response.data.user.role,
              status: true,
            });
          }
        });
    }
  }, [cookies]);



  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path='*' element={<PageNotFound />} /> */}
      </Route>
    )
  );

  return (<div className="App">
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  </div>);
}

export default App
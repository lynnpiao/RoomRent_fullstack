import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import Login from './Login';


const HomePage = () => {
  const { authState } = useContext(AuthContext);

  return (
    <>
    {authState.status ? (
      <div>Welcome to the homepage!</div>
    ) : (
      <Login />
    )}
  </>
  )
}

export default HomePage
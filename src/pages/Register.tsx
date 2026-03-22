import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to login page since we now have combined login/signup
const Register: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default Register;
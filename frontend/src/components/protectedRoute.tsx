import  {useAuth}  from '../context/authContext';
import { useEffect } from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated,user } = useAuth();

console.log(isAuthenticated,"isAuthenticated in ProtectedRoute");
  if (isAuthenticated==false) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
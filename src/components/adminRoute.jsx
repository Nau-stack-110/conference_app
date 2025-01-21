import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return children; 
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,  
};

export default AdminRoute;

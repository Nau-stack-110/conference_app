import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    }, []);
      
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
        navigate('/'); 
    };

    return {isAuthenticated, handleLogout};
};

export default useAuth;
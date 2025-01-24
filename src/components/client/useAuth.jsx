import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

        // Affichage du message de déconnexion réussie avec SweetAlert2
        Swal.fire({
            title: 'Déconnexion réussie!',
            text: 'Vous avez été déconnecté avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };
    
    return {isAuthenticated, handleLogout};
};

export default useAuth;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './authUser'; 
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Le nom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Les mots de passe ne correspondent pas';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await registerUser(formData);
        console.log('Utilisateur inscrit avec succès :', response.data);
        Swal.fire({
          title: 'Inscription réussie!! \n Veuillez connecter maintenant',
          icon:'success',
          toast:'true',
          timer:'6000',
          position:'top-right',
          timerProgressBase:true,
          showConfirmButton:false,
        })
        navigate('/login');
      } catch (error) {
        console.error('Erreur d\'inscription :', error.response.data);
        Swal.fire({
          title: 'Echec d\'inscription!!',
          icon:'error',
          toast:'true',
          timer:'6000',
          position:'top-right',
          showConfirmButton:false,
        })
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#2C3E50]">
            Créer un compte
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Nom d'utilisateur */}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="username"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3498DB] focus:border-[#3498DB]`}
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.nom && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3498DB] focus:border-[#3498DB]`}
                placeholder="Adresse email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <motion.p className="text-red-500 text-xs mt-1">{errors.email}</motion.p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3498DB] focus:border-[#3498DB]`}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <motion.p className="text-red-500 text-xs mt-1">{errors.password}</motion.p>
              )}
            </div>

            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password2"
                required
                className={`appearance-none rounded-lg relative block w-full px-10 py-2 border ${
                  errors.password2 ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#3498DB] focus:border-[#3498DB]`}
                placeholder="Confirmer le mot de passe"
                value={formData.password2}
                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              />
              {errors.password2 && (
                <motion.p className="text-red-500 text-xs mt-1">{errors.password2}</motion.p>
              )}
            </div>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3498DB] hover:bg-[#2980B9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3498DB]"
            >
              S&apos;inscrire
            </motion.button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-medium text-[#3498DB] hover:text-[#2980B9]">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register; 
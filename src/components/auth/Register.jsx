import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './authUser'; 
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const passwordStrengthColors = {
  0: 'bg-red-500',
  1: 'bg-orange-500',
  2: 'bg-yellow-500',
  3: 'bg-green-500'
};

const passwordStrengthLabels = {
  0: 'Très faible',
  1: 'Faible',
  2: 'Moyen',
  3: 'Fort'
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^A-Za-z0-9]/)) strength++;
  return Math.min(3, Math.floor(strength));
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  useEffect(() => {
    if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      setErrors(prev => ({...prev, email: 'Format email invalide'}));
    } else {
      setErrors(prev => ({...prev, email: ''}));
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.password && formData.password.length < 8) {
      setErrors(prev => ({...prev, password: 'Minimum 8 caractères'}));
    } else {
      setErrors(prev => ({...prev, password: ''}));
    }
  }, [formData.password]);

  useEffect(() => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({...prev, confirmPassword: 'Les mots de passe ne correspondent pas'}));
    } else {
      setErrors(prev => ({...prev, confirmPassword: ''}));
    }
  }, [formData.confirmPassword, formData.password]);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

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
              {errors.username && (
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
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
              
              {/* Progress Bar */}
              <AnimatePresence>
                {formData.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 space-y-1"
                  >
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${passwordStrengthColors[passwordStrength]}`}
                        style={{ width: `${(passwordStrength + 1) * 25}%` }}
                      />
                    </div>
                    <motion.span
                      key={passwordStrength}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-sm font-medium ${passwordStrengthColors[passwordStrength].replace('bg', 'text')}`}
                    >
                      {passwordStrengthLabels[passwordStrength]}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

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
              disabled={Object.values(errors).some(error => error)}
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
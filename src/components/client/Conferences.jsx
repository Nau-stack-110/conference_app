import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';
import { formatDate, formatTime } from './utils';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from './useAuth';

const ConferenceCard = ({ conference, onRegister }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate()
  return ( 
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden h-auto"
    >
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{conference.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{conference.description}</p>
        
        <div className='flex justify-between flex-wrap'>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FaCalendar className="mr-2" />
            {formatDate(conference.date)}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FaMapMarkerAlt className="mr-2" />
            {conference.lieu}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-[#3498DB] hover:text-[#2980B9] text-sm flex items-center"
        >
          {showDetails ? 'Masquer les détails' : 'Voir les détails'}
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t"
            >
              <div className="space-y-2 text-sm">
                {conference.sessions && conference.sessions.length > 0 ? (
                  <div className="mt-2">
                    <h4 className="font-semibold mb-1">Programme:</h4>
                    <div className="space-y-1">
                      {conference.sessions
                        .sort((a, b) => new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`))
                        .map((event, index) => (
                          <div key={index} className="text-gray-600">
                            • {formatTime(event.start_time)} - {event.title}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Aucune session disponible.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full bg-[#3498DB] text-white py-2 rounded-lg hover:bg-[#2980B9] text-sm"
          onClick={() => {
            const token = localStorage.getItem('access_token');
            if (!token) {
              Swal.fire({
                title: 'Connexion requise',
                html: `<div class="text-center">
                        <p class="mb-4">Vous devez être connecté pour vous inscrire à cette conférence</p>
                        <div class="flex justify-center gap-4">
                          <a href="/login" class="bg-[#3498DB] text-white px-6 py-2 rounded-lg hover:bg-[#2980B9] transition-colors">
                            Se connecter
                          </a>
                          <a href="/register" class="bg-[#2C3E50] text-white px-6 py-2 rounded-lg hover:bg-[#1A2A3B] transition-colors">
                            S'inscrire
                          </a>
                        </div>
                      </div>`,
                showConfirmButton: false,
                showCloseButton: true,
                customClass: {
                  popup: 'rounded-2xl',
                  closeButton: 'hover:text-red-500'
                }
              });
            } else {
              onRegister(conference.id);
            }
          }}
        >
          S&apos;inscrire à l&apos;événement
        </motion.button>
      </div>
    </motion.div>
  );
};

ConferenceCard.propTypes = {
  conference: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    lieu: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    sessions: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
};

const Conferences = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const conferencesPerPage = 9;
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'Education', label: 'Éducation' },
    { id: 'Technologies', label: 'Technologies' },
    { id: 'Science', label: 'Science' },
    { id: 'Culture', label: 'Culture' },
    { id: 'Arts', label: 'Arts' },
    { id: 'Business', label: 'Business' },
    { id: 'Autres', label: 'Autres' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/conferences/');
        setConferences(response.data);
        setFilteredConferences(response.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortConferences = (conferences, type) => {
    if (type === 'date') {
      return [...conferences].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return [...conferences].sort((a, b) => b.total_participants - a.total_participants);
  };

  useEffect(() => {
    let filtered = conferences;

    if (searchTerm) {
      filtered = filtered.filter(conf => 
        conf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conf.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(conf => conf.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    setFilteredConferences(sortConferences(filtered, sortBy));
    setCurrentPage(1); // Reset à la première page après filtrage
  }, [searchTerm, activeCategory, conferences, sortBy]);

  const handleRegister = async (conferenceId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        'http://127.0.0.1:8000/api/register-conference/',
        { conference_id: conferenceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mettre à jour l'état des conférences
      setConferences(prev => prev.map(conf => 
        conf.id === conferenceId 
          ? { ...conf, total_participants: conf.total_participants + 1 }
          : conf
      ));

      Swal.fire({
        title: 'Inscription réussie!',
        text: 'Votre ticket est disponible dans "Mes Tickets"',
        icon: 'success',
        confirmButtonText: 'Voir mon ticket'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/my-tickets');
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      let errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        title: 'Erreur!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Nouvelle fonction de recherche par date
  const searchByDateRange = async () => {
    try {
      if (!startDate || !endDate) {
        Swal.fire('Erreur', 'Veuillez sélectionner les deux dates', 'error');
        return;
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/api/conferences/date-range/',
        {
          params: {
            start_date: startDate,
            end_date: endDate
          }
        }
      );

      setConferences(response.data);
      setFilteredConferences(response.data);
      
    } catch (error) {
      let errorMessage = 'Erreur lors de la recherche';
      
      // Récupération des erreurs du backend
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        }
      }

      Swal.fire({
        title: 'Erreur',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-2xl'
        }
      });
    }
  };

  // Nouveau composant LoadingSpinner
  const LoadingSpinner = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center min-h-[300px]"
    >
      <svg 
        className="animate-spin h-12 w-12 text-[#3498DB]" 
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* En-tête de recherche */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Conférences à Madagascar
          </h1>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conférence..."
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-6 flex gap-4">
            <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-2">
              <input
                type="date"
                className="w-full bg-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-2">
              <input
                type="date"
                className="w-full bg-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={searchByDateRange}
              className="bg-white text-[#3498DB] px-6 py-2 rounded-lg hover:bg-opacity-90"
            >
              Rechercher
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStartDate('');
                setEndDate('');
                axios.get('http://127.0.0.1:8000/api/conferences/')
                  .then(res => {
                    setConferences(res.data);
                    setFilteredConferences(res.data);
                  });
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Réinitialiser
            </motion.button>
          </div>
        </div>
      </div>

      {/* Section Tri et Filtres */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy('date')}
                className={`px-6 py-2 rounded-full ${
                  sortBy === 'date'
                    ? 'bg-[#3498DB] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                Plus récentes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy('popularity')}
                className={`px-6 py-2 rounded-full ${
                  sortBy === 'popularity'
                    ? 'bg-[#3498DB] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                Plus populaires
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres par catégorie */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center px-6 py-2 rounded-full transition duration-300 ease-in-out ${
                activeCategory === cat.id
                  ? 'bg-[#3498DB] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="ml-2">{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Liste des conférences */}
        <h2 className="text-3xl font-bold text-center mb-12">
          {sortBy === 'date' ? 'Conférences Récentes' : 'Conférences Populaires'}
        </h2>
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${isLoading ? 'loading-blur' : ''}`}>
          <AnimatePresence>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              filteredConferences
                .slice((currentPage - 1) * conferencesPerPage, currentPage * conferencesPerPage)
                .map((conference) => (
                  <ConferenceCard 
                    key={conference.id}
                    conference={conference}
                    onRegister={handleRegister}
                  />
                ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {filteredConferences.length > conferencesPerPage && (
          <div className="mt-12 flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(filteredConferences.length / conferencesPerPage) }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === index + 1
                    ? 'bg-[#3498DB] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conferences; 
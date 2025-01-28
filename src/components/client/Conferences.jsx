import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';
import { formatDate, formatTime } from './utils';
import { useNavigate } from 'react-router-dom';

const ConferenceCard = ({ conference }) => {
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
              navigate('/login');
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const conferencesPerPage = 9;

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
    const fetchConferences = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/conferences/');
        setConferences(response.data);
        setFilteredConferences(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des conférences:', error);
      }
    };

    fetchConferences();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConferences
            .slice((currentPage - 1) * conferencesPerPage, currentPage * conferencesPerPage)
            .map((conference) => (
              <ConferenceCard key={conference.id} conference={conference} />
            ))}
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
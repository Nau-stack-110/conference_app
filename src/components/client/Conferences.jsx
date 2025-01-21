import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaSearch, FaMapMarkerAlt, FaFilter, FaLaptop, FaBook, FaTheaterMasks, FaBriefcase, FaUsers, FaArtstation } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';
import { formatDate, formatTime } from './utils';

const ConferenceCard = ({ conference }) => {
  const [showDetails, setShowDetails] = useState(false);

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
          onClick={() => navigate('/login')}
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

const categories = [
  { id: 'all', label: 'Toutes', icon: <FaFilter /> },
  { id: 'tech', label: 'Technologie', icon: <FaLaptop /> },
  { id: 'education', label: 'Éducation', icon: <FaBook /> },
  { id: 'culture', label: 'Culture', icon: <FaTheaterMasks /> },
  { id: 'business', label: 'Business', icon: <FaBriefcase /> },
  { id: 'others', label: 'Autres', icon: <FaUsers /> },
  { id: 'arts', label: 'Arts', icon: <FaArtstation /> }
];

const Conferences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const conferencesPerPage = 9;
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/conferences/');
        setConferences(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des conférences:', error);
      }
    };

    fetchConferences();
  }, []);

  const filteredConferences = useMemo(() => {
    let filtered = conferences;

    if (searchTerm) {
      filtered = filtered.filter(conf => 
        conf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conf.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(conf => conf.category === activeCategory);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchTerm, activeCategory, conferences]);

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
              {cat.icon}
              <span className="ml-2">{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Liste des conférences */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConferences.slice((currentPage - 1) * conferencesPerPage, currentPage * conferencesPerPage).map((conference) => (
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
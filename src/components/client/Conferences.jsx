import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ConferenceCard = ({ conference }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{conference.title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaCalendar className="mr-2" />
          {conference.date}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <FaMapMarkerAlt className="mr-2" />
          {conference.location}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-[#3498DB] hover:text-[#2980B9] text-sm flex items-center"
        >
          {showDetails ? 'Masquer les détails' : 'Voir les détails'}
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <p className="text-gray-600 text-sm mb-4">{conference.description}</p>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Prix:</span> {conference.price}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Langue:</span> {conference.language}
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Programme:</h4>
                  <div className="space-y-1">
                    {conference.events.map((event, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {event.time} - {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full bg-[#3498DB] text-white py-2 rounded-lg hover:bg-[#2980B9] text-sm"
        >
          S&apos;inscrire
        </motion.button>
      </div>
    </motion.div>
  );
};

ConferenceCard.propTypes = {
  conference: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
};

const Conferences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const conferencesPerPage = 9;

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'tech', label: 'Technologie' },
    { id: 'education', label: 'Éducation' },
    { id: 'culture', label: 'Culture' },
    { id: 'business', label: 'Business' }
  ];

  const conferences = [
    {
      id: 1,
      title: "Tech Innovation Madagascar 2024",
      date: "15 Juin 2024",
      location: "Carlton Anosy, Antananarivo",
      category: "tech",
      description: "Découvrez les innovations technologiques à Madagascar",
      price: "Gratuit",
      language: "Français/Malagasy",
      events: [
        { time: "08:00", title: "Accueil des participants" },
        { time: "09:00", title: "Ouverture officielle" },
        { time: "10:00", title: "Conférence principale" }
      ]
    },
    {
      id: 2,
      title: "Forum de l'Éducation Numérique",
      date: "20 Juillet 2024",
      location: "EMIT Vontovorona",
      category: "education",
      description: "L'avenir de l'éducation numérique à Madagascar",
      price: "50 000 Ar",
      language: "Malagasy",
      events: [
        { time: "09:00", title: "Présentation des projets" },
        { time: "14:00", title: "Ateliers pratiques" }
      ]
    }
    // Ajoutez d'autres conférences...
  ];

  const [filteredConferences, setFilteredConferences] = useState(conferences);

  useEffect(() => {
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

    setFilteredConferences(filtered);
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  // Pagination
  const indexOfLastConference = currentPage * conferencesPerPage;
  const indexOfFirstConference = indexOfLastConference - conferencesPerPage;
  const currentConferences = filteredConferences.slice(indexOfFirstConference, indexOfLastConference);

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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full ${
                activeCategory === cat.id
                  ? 'bg-[#3498DB] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Liste des conférences */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentConferences.map((conference) => (
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
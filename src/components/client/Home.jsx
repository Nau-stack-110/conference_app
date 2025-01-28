import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaTimes, FaStar, FaCalendar, FaMapMarkerAlt, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import useAuth from './useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const [totalParticipants, setTotalParticipants] = useState(0);
 

  const categories = ['all', 'Education', 'Technologies', 'Science', 'Culture', 'Arts', 'Business', 'Autres'];

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

  const [currentPage, setCurrentPage] = useState(1);
  const [conferencesPerPage] = useState(6);
  const [sortBy, setSortBy] = useState('date');

  const indexOfLastConference = currentPage * conferencesPerPage;
  const indexOfFirstConference = indexOfLastConference - conferencesPerPage;
  const currentConferences = useMemo(() => {
    return filteredConferences
      .filter(conference => activeCategory === 'all' || conference.category === activeCategory)
      .slice(indexOfFirstConference, indexOfLastConference);
  }, [filteredConferences, activeCategory, indexOfFirstConference, indexOfLastConference]);

  const sortConferences = (conferences, type) => {
    if (type === 'date') {
      return [...conferences].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return [...conferences].sort((a, b) => b.total_participants - a.total_participants);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(`${timeString}`).toLocaleTimeString('fr-FR', options);
  };

  const handleRegister = async (conferenceId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/api/register-conference/', {
        conference_id: conferenceId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      Swal.fire({
        title: 'Inscription réussie!',
        text: `Votre ticket est disponible ici: ${response.data.ticket_url}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setTotalParticipants(prev => prev + 1);
      setQrcodeUrl(response.data.ticket_url);
      
      setConferences(prevConferences => 
        prevConferences.map(conference => 
          conference.id === conferenceId 
            ? { ...conference, total_participants: conference.total_participants + 1 } 
            : conference
        )
      );

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      let errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.error || errorMessage;
      } 
      Swal.fire({
        title: 'Erreur!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
    }
  };


  // eslint-disable-next-line react/prop-types
  const ConferenceCard = React.memo(({ conference, onRegister }) => {
    const [showDetails, setShowDetails] = useState(false);

    return ( 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden h-auto"
      >
        <img
          src={conference.image}
          alt={conference.title}
          className="w-full h-32 object-cover"
        />
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
            {showDetails ? (
              <>
                Masquer les détails <FaChevronUp className="ml-1" />
              </>
            ) : (
              <>
                Voir les détails <FaChevronDown className="ml-1" />
              </>
            )}
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
                  <div className="flex items-center text-gray-500">
                    <FaUsers className="mr-2" />
                    {conference.total_participants} participants
                  </div>
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
            onClick={onRegister}
          >
            S&apos;inscrire à l&apos;événement
          </motion.button>
        </div>
      </motion.div>
    );
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section avec Slider */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[80vh]"
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="h-full"
        >
          {conferences.slice(0, 6).map((conference) => (
            <SwiperSlide key={conference.id}>
              <div className="relative h-full">
                <img
                  src={conference.image}
                  alt={conference.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center text-white px-4"
                  >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {conference.title}
                    </h1>
                    <p className="text-xl mb-6">{formatDate(conference.date)}</p>
                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#3498DB] text-white px-8 py-3 rounded-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAuthenticated) {
                            Swal.fire({
                              title: 'Connexion requise',
                              text: 'Veuillez vous connecter pour vous inscrire',
                              icon: 'warning',
                              confirmButtonText: 'Se connecter'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                navigate('/login');
                              }
                            });
                          } else {
                            handleRegister(conference.id);
                          }
                        }}
                      >
                        {isAuthenticated ? "S'inscrire à l'événement" : "Se connecter pour s'inscrire"}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* Section Filtres */}
      <section className="pt-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full ${
                  activeCategory === category
                    ? 'bg-[#3498DB] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'Toutes' : category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Section Tri et Filtres */}
      <section className=" bg-gray-50">
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

      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {sortBy === 'date' ? 'Conférences Récentes' : 'Conférences Populaires'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortConferences(currentConferences, sortBy).map((conference) => (
              <ConferenceCard key={conference.id} conference={conference} onRegister={() => handleRegister(conference.id)} />
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
      </section>

      {/* Section Statistiques */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 bg-[#2C3E50] text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p>Conférences</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">10k+</h3>
              <p>Participants</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">30+</h3>
              <p>Speakers</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">15+</h3>
              <p>Pays</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Restez informé</h2>
          <div className="max-w-md mx-auto">
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 p-3 rounded-lg border"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#3498DB] text-white px-6 py-3 rounded-lg"
              >
                S&apos;abonner
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-8 right-8 bg-[#3498DB] text-white p-4 rounded-full shadow-lg"
      >
        <FaComment size={24} />
      </motion.button>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white p-6 rounded-lg w-full max-w-md relative"
            >
              <button
                onClick={() => setShowFeedback(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              
              <h3 className="text-2xl font-bold mb-4">Votre Feedback</h3>
              
              <div className="mb-4">
                <p className="mb-2">Note :</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <FaStar />
                    </motion.button>
                  ))}
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    rows="4"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Partagez votre expérience..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Votre email"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#3498DB] text-white py-2 rounded-lg"
                >
                  Envoyer
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Afficher le QR code après l'inscription */}
      {qrcodeUrl && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold">Votre QR Code :</h3>
          <img src={qrcodeUrl} alt="QR Code" className="mx-auto my-2" />
          <a href={qrcodeUrl} download className="mt-2 inline-block bg-[#3498DB] text-white px-4 py-2 rounded-lg">
            Télécharger le QR Code
          </a>
          <p className="mt-2">Total des participants : {totalParticipants}</p>
        </div>
      )}

    </div>
  );
};

export default Home; 
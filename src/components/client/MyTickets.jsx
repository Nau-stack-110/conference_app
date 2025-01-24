import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaFileDownload } from 'react-icons/fa';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/my-tickets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div className="text-center">Chargement des tickets...</div>;
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mt-5 mb-8">Mes Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-4"
              >
                <h3 className="text-lg font-bold mb-2">{ticket.conference.title}</h3>
                <p className="text-gray-600 mb-2">
                  <FaCalendar className="inline mr-1" />
                  {new Date(ticket.conference.date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-gray-600 mb-2">
                  <FaMapMarkerAlt className="inline mr-1" />
                  {ticket.conference.lieu}
                </p>
                <a
                  href={ticket.qr_code_url}
                  download
                  className="flex items-center text-[#3498DB] hover:text-[#2980B9] mt-4"
                >
                  <FaFileDownload className="mr-1" />
                  Télécharger le QR Code
                </a>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-600">Aucun ticket trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUserPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const categorie = ['Technologies', 'Education', 'Business', 'Science', 'Cultures', 'Arts', 'Autres'];

const Participants = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const itemsPerPage = 5;
  const [participants, setParticipants] = useState([]);

  const getParticipants = async () =>{
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get("http://127.0.0.1:8000/api/registrations/",{
        headers: {
          Authorization: `Bearer ${token}`,
        }
    });
      setParticipants(response.data);
      setCurrentPage(1);
    } catch (e) {
      console.error("Erreur lors du chargement des participants:", e);
    }
  }

  const [filteredParticipants, setFilteredParticipants] = useState([]);

  useEffect(() => {
    getParticipants();
  }, []);

  useEffect(() => {
    let filtered = participants;
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(participant =>
        participant.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.session.conference.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(participant => 
        participant.session.conference.category === filterStatus
      );
    }

    setFilteredParticipants(filtered);
    setCurrentPage(1);
  }, [searchTerm, participants, filterStatus]);

  // Pagination
  const pageCount = Math.ceil(filteredParticipants.length / itemsPerPage);
  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newParticipant = {
      id: editingParticipant?.id || Date.now(),
      nom: formData.get('nom'),
      email: formData.get('email'),
      conference: formData.get('conference'),
      // statut: formData.get('statut')
    };

    if (editingParticipant) {
      setParticipants(participants.map(p => 
        p.id === editingParticipant.id ? newParticipant : p
      ));
    } else {
      setParticipants([...participants, newParticipant]);
    }
    setShowModal(false);
    setEditingParticipant(null);
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce participant ?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Ajouter le titre
    doc.setFontSize(18);
    doc.text('Liste des Participants', 14, 20);
    
    // Ajouter la date
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Préparer les données pour le tableau
    const tableData = filteredParticipants.map(participant => [
      participant.user.username,
      participant.user.email,
      participant.session.conference,
    ]);

    // Créer le tableau
    doc.autoTable({
      startY: 40,
      head: [['Nom', 'Email', 'Conférence']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      }
    });

    // Sauvegarder le PDF
    doc.save('liste-participants.pdf');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technologies':
        return 'bg-blue-100 text-blue-800';
      case 'Education':
        return 'bg-green-100 text-green-800';
      case 'Business':
        return 'bg-yellow-100 text-yellow-800';
      case 'Science':
        return 'bg-purple-100 text-purple-800';
      case 'Cultures':
        return 'bg-red-100 text-red-800';
      case 'Arts':
        return 'bg-pink-100 text-pink-800';
      case 'Autres':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const getParticipantColor = (participant) => {
    // Vous pouvez personnaliser les couleurs ici selon vos besoins
    return participant.session.conference.category === 'Technologies' ? 'bg-blue-100 text-blue-800' :
           participant.session.conference.category === 'Education' ? 'bg-green-100 text-green-800' :
           participant.session.conference.category === 'Business' ? 'bg-yellow-100 text-yellow-800' :
           participant.session.conference.category === 'Science' ? 'bg-purple-100 text-purple-800' :
           participant.session.conference.category === 'Cultures' ? 'bg-red-100 text-red-800' :
           participant.session.conference.category === 'Arts' ? 'bg-pink-100 text-pink-800' :
           participant.session.conference.category === 'Autres' ? 'bg-gray-100 text-gray-800' :
           '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#2C3E50]">Gestion des Participants</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingParticipant(null);
            setShowModal(true);
          }}
          className="bg-[#3498DB] text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaUserPlus className="mr-2" />
          Ajouter un participant
        </motion.button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un participant..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg flex items-center gap-2"
          >
            <FaFilter />
            Filtrer
          </motion.button>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10"
            >
              <div className="space-y-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    filterStatus === 'all' ? 'bg-[#3498DB] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categorie.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterStatus(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      filterStatus === cat ? 'bg-[#3498DB] text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <table className="min-w-full">
          <thead className="bg-[#2C3E50] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Conférence</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedParticipants.map((participant) => (
              <motion.tr
                key={participant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className={`px-6 py-4 ${getParticipantColor(participant)}`}>{participant.user.username}</td>
                <td className={`px-6 py-4 ${getParticipantColor(participant)}`}>{participant.user.email}</td>
                <td className={`px-6 py-4 ${getCategoryColor(participant.session.conference.category)}`}>
                  {participant.session.conference.title}
                </td>
                 <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${getCategoryColor(participant.session.conference.category)}`} >
                    {participant.session.conference.date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(participant)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(participant.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {[...Array(pageCount)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 
                  ? 'bg-[#3498DB] text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
      )}

      {/* Modal pour ajouter/éditer un participant */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">
                {editingParticipant ? 'Modifier le participant' : 'Ajouter un participant'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom complet</label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={editingParticipant?.username}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingParticipant?.email}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Conférence</label>
                  <input
                    type="text"
                    name="conference"
                    defaultValue={editingParticipant?.conference}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
  
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingParticipant(null);
                    }}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3498DB] text-white rounded-lg"
                  >
                    {editingParticipant ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportToPDF}
        className="flex items-center px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] mt-4"
      >
        <FaDownload className="mr-2" />
        Exporter en PDF
      </motion.button>
    </div>
  );
};

export default Participants; 
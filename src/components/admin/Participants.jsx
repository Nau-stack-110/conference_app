import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUserPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Participants = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [participants, setParticipants] = useState([
    {
      id: 1,
      nom: 'Martin Dupont',
      email: 'martin.dupont@email.com',
      telephone: '+33 6 12 34 56 78',
      conference: 'Tech Summit 2024',
      statut: 'Confirmé',
    },
    {
      id: 2,
      nom: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      telephone: '+33 6 98 76 54 32',
      conference: 'Digital Innovation Forum',
      statut: 'En attente',
    },
    // ... autres participants
  ]);

  const [filteredParticipants, setFilteredParticipants] = useState(participants);

  useEffect(() => {
    let filtered = participants;
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(participant =>
        participant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.conference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(participant => participant.statut === filterStatus);
    }

    setFilteredParticipants(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filterStatus, participants]);

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
      telephone: formData.get('telephone'),
      conference: formData.get('conference'),
      statut: formData.get('statut')
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
      participant.nom,
      participant.email,
      participant.telephone,
      participant.conference,
      participant.statut
    ]);

    // Créer le tableau
    doc.autoTable({
      startY: 40,
      head: [['Nom', 'Email', 'Téléphone', 'Conférence', 'Statut']],
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
                  Tous les statuts
                </button>
                {['Confirmé', 'En attente', 'Annulé'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      filterStatus === status ? 'bg-[#3498DB] text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {status}
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
              <th className="px-6 py-3 text-left">Téléphone</th>
              <th className="px-6 py-3 text-left">Conférence</th>
              <th className="px-6 py-3 text-left">Statut</th>
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
                <td className="px-6 py-4">{participant.nom}</td>
                <td className="px-6 py-4">{participant.email}</td>
                <td className="px-6 py-4">{participant.telephone}</td>
                <td className="px-6 py-4">{participant.conference}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    participant.statut === 'Confirmé' ? 'bg-green-100 text-green-800' :
                    participant.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {participant.statut}
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
              onClick={() => setCurrentPage(i + 1)}
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
                    defaultValue={editingParticipant?.nom}
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
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    defaultValue={editingParticipant?.telephone}
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
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    name="statut"
                    defaultValue={editingParticipant?.statut}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="Confirmé">Confirmé</option>
                    <option value="En attente">En attente</option>
                    <option value="Annulé">Annulé</option>
                  </select>
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
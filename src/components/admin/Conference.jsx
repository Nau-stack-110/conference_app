import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Conference = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConference, setEditingConference] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Tech', 'Business', 'Science', 'Arts', 'Autres'];

  const [conferences, setConferences] = useState([
    {
      id: 1,
      titre: "Tech Summit 2024",
      date: "2024-06-15",
      lieu: "Paris Expo",
      description: "Summit sur les nouvelles technologies",
      categorie: "Tech",
      evenements: [
        { id: 1, nom: "Keynote d'ouverture", heure: "09:00" },
        { id: 2, nom: "Workshop IA", heure: "14:00" },
      ]
    },
    {
        id: 2,
        titre: "Tech INFO 2025",
        date: "2025-01-15",
        lieu: "Paris Expo",
        evenements: [
          { nom: "Keynote d'ouverture", heure: "09:00" },
          { nom: "Workshop IA", heure: "14:00" },
        ]
      },
    // Ajoutez d'autres conférences ici
  ]);

  const [filteredConferences, setFilteredConferences] = useState(conferences);

  useEffect(() => {
    let filtered = conferences;
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(conference =>
        conference.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conference.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conference.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(conference => conference.categorie === filterCategory);
    }

    setFilteredConferences(filtered);
  }, [searchTerm, filterCategory, conferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newConference = {
      id: editingConference?.id || Date.now(),
      titre: formData.get('titre'),
      date: formData.get('date'),
      lieu: formData.get('lieu'),
      description: formData.get('description'),
      categorie: formData.get('categorie'),
      evenements: editingConference?.evenements || []
    };

    if (editingConference) {
      setConferences(conferences.map(conf => 
        conf.id === editingConference.id ? newConference : conf
      ));
    } else {
      setConferences([...conferences, newConference]);
    }
    setShowModal(false);
    setEditingConference(null);
  };

  const handleEdit = (conference) => {
    setEditingConference(conference);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
      setConferences(conferences.filter(conf => conf.id !== id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C3E50]">Gestion des Conférences</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingConference(null);
            setShowModal(true);
          }}
          className="bg-[#3498DB] text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Nouvelle Conférence
        </motion.button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une conférence..."
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
                  onClick={() => setFilterCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    filterCategory === 'all' ? 'bg-[#3498DB] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      filterCategory === cat ? 'bg-[#3498DB] text-white' : 'hover:bg-gray-100'
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredConferences.map((conference) => (
            <motion.div
              key={conference.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-4">{conference.titre}</h3>
              <div className="space-y-2">
                <p><strong>Date:</strong> {conference.date}</p>
                <p><strong>Lieu:</strong> {conference.lieu}</p>
                <p><strong>Catégorie:</strong> {conference.categorie}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <FaEye />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(conference)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                >
                  <FaEdit />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(conference.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
                {editingConference ? 'Modifier la conférence' : 'Nouvelle Conférence'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    name="titre"
                    defaultValue={editingConference?.titre}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingConference?.date}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu</label>
                  <input
                    type="text"
                    name="lieu"
                    defaultValue={editingConference?.lieu}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingConference?.description}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select
                    name="categorie"
                    defaultValue={editingConference?.categorie}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingConference(null);
                    }}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3498DB] text-white rounded-lg"
                  >
                    {editingConference ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Conference; 
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Conference = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConference, setEditingConference] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    speaker: '',
    profession: '',
    start_time: ''
  });
  const [editingSession, setEditingSession] = useState(null);

  const categories = ['Technologies', 'Education', 'Business', 'Science', 'Culture', 'Arts', 'Autres'];

  const [conferences, setConferences] = useState([]);

  const getConferences =  async () =>{
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/conferences/");
      setConferences(response.data);
    } catch (e) {
      console.error("Erreur lors du chargement des conferences:", e);
    }
  }

  const [filteredConferences, setFilteredConferences] = useState(conferences);

  useEffect(() => {
    getConferences();
    let filtered = conferences;
    
    if (searchTerm) {
      filtered = filtered.filter(conference =>
        conference.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conference.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conference.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(conference => conference.category === filterCategory);
    }

    setFilteredConferences(filtered);
  }, [searchTerm, filterCategory, conferences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        Swal.fire({
          title: 'Erreur d\'authentification',
          text: 'Veuillez vous reconnecter',
          icon: 'error'
        });
        return;
      }

      if (editingConference) {
        const response = await axios.put(`http://127.0.0.1:8000/api/conferences/${editingConference.id}/update/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setConferences(conferences.map(conf => 
          conf.id === editingConference.id ? response.data : conf));
        Swal.fire({
          title: 'Conférences mise à jour avec success',
          icon:'success',
          confirmButtonText: 'OK'
        })
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/conferences/create/", 
          formData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        setConferences([...conferences, response.data]);
        Swal.fire({
          title: 'Conférence créée avec succès',
          icon: 'success'
        });
      }
      
      setShowModal(false);
      setEditingConference(null);

    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      Swal.fire({
        title: 'Erreur',
        text: error.response?.data?.date?.[0] ||
               error.response?.data?.detail || 
               'Échec de la création de la conférence',
        icon: 'error'
      });
    }
  };

  const handleEdit = (conference) => {
    setEditingConference(conference);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://127.0.0.1:8000/api/conferences/${id}/update/`,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
      });
        setConferences(conferences.filter(conf => conf.id !== id));
        Swal.fire({
          title: 'Conférence supprimer avec success',
          icon:'success',
          confirmButtonText: 'OK'
        })
      } catch (error) {
        console.error("Erreur lors de la suppression du conference:", error);
        let errorMessage = 'Erreur lors de la suppression du conference';
        if (error.response && error.response.data) {
          errorMessage = error.response.data || errorMessage;
        } 
        Swal.fire({
          title: 'Erreur',
          icon:'error',
          text: errorMessage,
          confirmButtonText: 'OK'
        })
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/conferences/${id}/`);
      const conferenceData = response.data;
      
      setSelectedConference({
        ...conferenceData,
        sessions: conferenceData.sessions.map(session => ({
          id: session.id,
          title: session.title,
          speaker: session.speaker,
          start_time: session.start_time,
          profession: session.profession,
          participants_count: session.participants_count
        }))
      });

    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de charger les détails de la conférence',
        icon: 'error'
      });
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const sessionData = {
        ...newSession,
        conference: selectedConference.id,
        start_time: newSession.start_time.toISOString()
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/sessions/create/",
        sessionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSelectedConference(prev => ({
        ...prev,
        sessions: [...prev.sessions, response.data]
      }));
      
      setShowSessionModal(false);
      Swal.fire({
        title: 'Session créée avec succès!',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('Erreur création session:', error.response?.data);
      Swal.fire({
        title: 'Erreur',
        text: error.response?.data?.non_field_errors?.[0] ||
              Object.values(error.response?.data).flat().join('\n') ||
              'Échec de la création de la session',
        icon: 'error'
      });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmer la suppression?',
        text: "Cette action est irréversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Supprimer'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("access_token");
        await axios.delete(
          `http://localhost:8000/api/sessions/${sessionId}/update/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSelectedConference(prev => ({
          ...prev,
          sessions: prev.sessions.filter(s => s.id !== sessionId)
        }));
        
        Swal.fire('Supprimé!', 'La session a été supprimée.', 'success');
      }
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: error.response?.data?.detail || 
              error.response?.data?.non_field_errors?.[0] ||
              'Échec de la suppression',
        icon: 'error'
      });
    }
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/sessions/${editingSession.id}/update/`,
        {
          ...editingSession,
          start_time: new Date(editingSession.start_time).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedConference(prev => ({
        ...prev,
        sessions: prev.sessions.map(s => 
          s.id === response.data.id ? response.data : s
        )
      }));
      
      setEditingSession(null);
      Swal.fire('Modifié!', 'La session a été mise à jour.', 'success');
      
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: error.response?.data?.non_field_errors?.[0] ||
              Object.values(error.response?.data).flat().join('\n') ||
              'Échec de la modification',
        icon: 'error'
      });
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
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
          {filteredConferences.length} résultat(s)
          </span>
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
              <h3 className="text-xl font-semibold mb-4">{conference.title}</h3>
              <div className="space-y-2">
                <div className='flex flex-wrap justify-between'>
                <p><strong>Date:</strong> {conference.date}</p>
                <p><strong>Price:</strong><span className='text-blue-500'> {conference.price}</span> </p>
                </div>
                <p><strong>Lieu:</strong> {conference.lieu}</p>
                <p><strong>Catégorie:</strong> {conference.category}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleViewDetails(conference.id)}
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
                    name="title"
                    defaultValue={editingConference?.title}
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
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    name="price"
                    defaultValue={editingConference?.price}
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
                    name="category"
                    defaultValue={editingConference?.category}
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

      <AnimatePresence>
        {selectedConference && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-4">{selectedConference.title}</h3>
              <p className="text-lg mb-4">Participants totaux : {selectedConference.total_participants}</p>
              
              <div className="space-y-4">
                {selectedConference.sessions.map(session => (
                  <div key={session.id} className="p-4 border rounded-lg relative">
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingSession(session)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FaEdit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash size={16} />
                      </motion.button>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{session.title}</h4>
                    <div className="flex justify-between">
                      <p className="text-gray-600">
                        <span className="font-semibold">Intervenant:</span> {session.speaker}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Participants:</span> {session.participants_count}
                      </p>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-semibold">Horaire:</span>{" "}
                      {new Date(session.start_time).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })} à {" "}
                      {new Date(session.start_time).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>  

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Nouvelle Session
                </button>
                <button
                  onClick={() => setSelectedConference(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSessionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Nouvelle Session</h3>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newSession.title}
                    onChange={e => setNewSession({...newSession, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Intervenant</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newSession.speaker}
                    onChange={e => setNewSession({...newSession, speaker: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profession</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newSession.profession}
                    onChange={e => setNewSession({...newSession, profession: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date et Heure</label>
                  <DatePicker
                    selected={newSession.start_time ? new Date(newSession.start_time) : null}
                    onChange={(date) => setNewSession({...newSession, start_time: date})}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="w-full p-2 border rounded-lg"
                    placeholderText="Sélectionnez date et heure"
                    minDate={new Date()}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSessionModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Modifier Session</h3>
              <form onSubmit={handleUpdateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={editingSession.title}
                    onChange={e => setEditingSession({...editingSession, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Intervenant</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={editingSession.speaker}
                    onChange={e => setEditingSession({...editingSession, speaker: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profession</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={editingSession.profession}
                    onChange={e => setEditingSession({...editingSession, profession: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date et Heure</label>
                  <DatePicker
                    selected={editingSession.start_time ? new Date(editingSession.start_time) : null}
                    onChange={(date) => setEditingSession({...editingSession, start_time: date})}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="w-full p-2 border rounded-lg"
                    placeholderText="Sélectionnez date et heure"
                    minDate={new Date()}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingSession(null)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Modifier
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
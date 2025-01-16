import { useState } from 'react';
import { FaUserTie, FaEdit, FaTrash, FaPlus, FaEnvelope, FaPhone } from 'react-icons/fa';

const Organisateur = () => {
  const [showModal, setShowModal] = useState(false);
  const [organisateurs] = useState([
    {
      id: 1,
      nom: 'Sophie Martin',
      role: 'Coordinateur principal',
      email: 'sophie.martin@conference4tous.com',
      telephone: '+33 6 12 34 56 78',
      conferences: ['Tech Summit 2024', 'Digital Innovation Forum'],
      status: 'Actif'
    },
    {
        id: 2,
        nom: 'Botez Martin',
        role: 'Coordinateur principal',
        email: 'sophie.martin@conference4tous.com',
        telephone: '+33 6 12 34 56 78',
        conferences: ['Tech Summit 2024', 'Digital Innovation Forum'],
        status: 'Actif'
      },
    // Autres organisateurs...
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#2C3E50]">Gestion des Organisateurs</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#3498DB] text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Nouvel Organisateur
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organisateurs.map((organisateur) => (
          <div key={organisateur.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-[#3498DB] p-3 rounded-full text-white">
                  <FaUserTie size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{organisateur.nom}</h3>
                  <p className="text-sm text-gray-600">{organisateur.role}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button className="text-green-600 hover:text-green-800">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-2" />
                <span className="text-sm">{organisateur.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaPhone className="mr-2" />
                <span className="text-sm">{organisateur.telephone}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Conférences assignées</h4>
              <div className="flex flex-wrap gap-2">
                {organisateur.conferences.map((conf, index) => (
                  <span
                    key={index}
                    className="bg-[#34495E] text-white text-xs px-2 py-1 rounded-full"
                  >
                    {conf}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <span className={`px-2 py-1 rounded-full text-sm ${
                organisateur.status === 'Actif' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {organisateur.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour ajouter/éditer un organisateur */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Nouvel Organisateur</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Nom de l'organisateur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Rôle dans l'organisation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Email professionnel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3498DB] text-white rounded-lg"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organisateur; 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaCamera } from 'react-icons/fa';
import AdminAvatar from '../../assets/react.svg';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: '',
    email: '',
    telephone: '',
    role: '',
    dateInscription: '',
    bio: '',
    image: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);
        setProfileData(decoded);
        try {
          const { data } = await axios.get('http://localhost:8000/api/user-profile/');
          console.log('API Response Data:', data);
          const userId = decoded.user_id;
          const userData = data.find(user => user.id === userId);
          if (userData) {
            const dateInscription = new Date(userData.profile.created_at);
            setProfileData(prev => ({
              ...prev,
              nom: userData.profile.fullname || 'Admin User',
              email: userData.email,
              telephone: userData.profile.telephone || '+261 34 00 976 78',
              role: userData.is_superuser ? 'Administrateur' : 'Utilisateur',
              dateInscription: dateInscription.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }),
              bio: userData.profile.bio || 'Aucune bio.',
              image: userData.profile.image || AdminAvatar
            }));
          } else {
            console.error('Aucun utilisateur correspondant trouvé dans la réponse de l\'API.');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données du profil:', error);
        }
      }
    };

    fetchProfileData();
  }, []); 
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Logique pour sauvegarder les modifications
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Section Photo de profil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-48 h-48 rounded-full overflow-hidden"
              >
                <img
                  src={profileData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <label className="absolute bottom-2 right-2 w-10 h-10 bg-[#3498DB] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2980B9] transition-colors">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{profileData.nom}</h2>
              <p className="text-[#3498DB]">{profileData.role}</p>
            </div>
          </div>

          {/* Section Informations */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Informations personnelles</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-[#3498DB] hover:text-[#2980B9]"
              >
                <FaEdit className="mr-2" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FaUser className="inline mr-2" />
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.nom}
                      onChange={(e) => setProfileData({...profileData, nom: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.nom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FaPhone className="inline mr-2" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.telephone}
                      onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.telephone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date d&apos;inscription
                  </label>
                  <p className="text-gray-600">{profileData.dateInscription}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows="4"
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio}</p>
                )}
              </div>

              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#3498DB] text-white py-2 rounded-lg hover:bg-[#2980B9]"
                >
                  Enregistrer les modifications
                </motion.button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
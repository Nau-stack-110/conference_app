import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl">Nous sommes là pour vous aider</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
            
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-[#3498DB] text-2xl mt-1" />
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p className="text-gray-600">Analakely, Antananarivo 101, Madagascar</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaPhone className="text-[#3498DB] text-2xl mt-1" />
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p className="text-gray-600">+261 34 00 000 00</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-[#3498DB] text-2xl mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">contact@conference4tous.mg</p>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-[#3498DB] hover:text-[#2980B9] text-2xl">
                  <FaFacebook />
                </a>
                <a href="#" className="text-[#3498DB] hover:text-[#2980B9] text-2xl">
                  <FaTwitter />
                </a>
                <a href="#" className="text-[#3498DB] hover:text-[#2980B9] text-2xl">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB]"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sujet</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB]"
                value={formData.sujet}
                onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows="4"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB]"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#3498DB] text-white py-3 rounded-lg hover:bg-[#2980B9]"
            >
              Envoyer le message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 